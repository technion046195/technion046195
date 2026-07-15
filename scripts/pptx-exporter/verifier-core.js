const fs = require("fs");

const JSZip = require("jszip");
const { DOMParser } = require("@xmldom/xmldom");

const {
  ancestorByNamespaceLocalName,
  directChildrenByNamespaceLocalName,
  elementsByLocalName,
  resolveRelationshipTarget,
} = require("./xml-utils");

const DRAWING_NS = "http://schemas.openxmlformats.org/drawingml/2006/main";
const MATH_NS = "http://schemas.openxmlformats.org/officeDocument/2006/math";
const A14_NS = "http://schemas.microsoft.com/office/drawing/2010/main";

async function verifyPptxFile(pptxPath, options = {}) {
  const zip = await JSZip.loadAsync(fs.readFileSync(pptxPath));
  return verifyZipPackage(zip, options);
}

async function verifyZipPackage(zip, options = {}) {
  const parser = new DOMParser();
  const failures = [];
  const slideNames = Object.keys(zip.files)
    .filter((name) => name.match(/^ppt\/slides\/slide\d+\.xml$/))
    .sort((a, b) => slideNumber(a) - slideNumber(b));
  const slideXml = [];
  const slideDocs = [];

  for (const name of slideNames) {
    const file = zip.file(name);
    if (!file) continue;
    const xml = await file.async("string");
    slideXml.push(xml);
    slideDocs.push(parser.parseFromString(xml, "application/xml"));
  }

  failures.push(...await missingContentTypeOverrideFailures(zip));
  failures.push(...await missingRelationshipTargetFailures(zip));
  failures.push(...await invalidPresentationChildOrderFailures(zip));
  failures.push(...unwrappedOfficeMathFailures(slideDocs));
  failures.push(...officeMathRunPropertyFailures(slideDocs));
  failures.push(...invalidTableCellAnchorFailures(slideDocs));

  const allXml = slideXml.join("\n");
  if (options.expectedSlides != null && slideNames.length !== options.expectedSlides) {
    failures.push(`Expected ${options.expectedSlides} slides, found ${slideNames.length}.`);
  }
  if (options.noMathPlaceholders && /PPTXMATH\d+TOKEN/.test(allXml)) {
    failures.push("Found unreplaced math placeholders.");
  }
  if (options.requireOmml && !allXml.includes(":oMath") && !allXml.includes("<oMath")) {
    failures.push("No Office math XML was found.");
  }
  if (options.requireTiming && !allXml.includes("<p:timing")) {
    failures.push("No PowerPoint timing XML was found.");
  }
  if (options.requireHebrewRtl && !hasHebrewRtlParagraph(slideDocs)) {
    failures.push("No Hebrew paragraph with rtl=\"1\" was found.");
  }
  if (options.minBulletParagraphsInBody != null) {
    const maxBulletParagraphs = Math.max(0, ...slideDocs.map(maxBulletParagraphsInTextBody));
    if (maxBulletParagraphs < options.minBulletParagraphsInBody) {
      failures.push(`Expected at least ${options.minBulletParagraphsInBody} bullet paragraphs in one text body, found maximum ${maxBulletParagraphs}.`);
    }
  }

  const docsToCheck = options.slide == null ? slideDocs : [slideDocs[options.slide - 1]].filter(Boolean);
  docsToCheck.forEach((doc, index) => {
    const slideNumberForMessage = options.slide == null ? index + 1 : options.slide;
    if (options.maxObjectsSameY != null) {
      const failure = maxSharedTopYFailure(doc, slideNumberForMessage, options.maxObjectsSameY);
      if (failure) failures.push(failure);
    }
    if (options.maxOverlapEmu != null) {
      const failure = maxOverlapFailure(doc, slideNumberForMessage, options.maxOverlapEmu);
      if (failure) failures.push(failure);
    }
    if (options.minMathHeightEmu != null) {
      const failure = minMathHeightFailure(doc, slideNumberForMessage, options.minMathHeightEmu);
      if (failure) failures.push(failure);
    }
    if (options.maxBottomOverflowEmu != null) {
      const failure = bottomOverflowFailure(doc, slideNumberForMessage, options.maxBottomOverflowEmu);
      if (failure) failures.push(failure);
    }
  });

  return failures;
}

async function missingContentTypeOverrideFailures(zip) {
  const contentTypes = zip.file("[Content_Types].xml");
  if (!contentTypes) {
    return ["Missing required package part: [Content_Types].xml."];
  }

  const xml = await contentTypes.async("string");
  const missing = [];
  for (const match of xml.matchAll(/<Override\b[^>]*\bPartName="\/([^"]+)"[^>]*>/g)) {
    const partName = match[1];
    if (!zip.files[partName]) {
      missing.push(partName);
    }
  }
  return missing.map((partName) => `Content type override references missing package part: ${partName}.`);
}

async function missingRelationshipTargetFailures(zip) {
  const failures = [];
  const relNames = Object.keys(zip.files).filter((name) => name.endsWith(".rels")).sort();
  for (const relName of relNames) {
    const xml = await zip.file(relName).async("string");
    for (const relationship of relationshipEntries(xml)) {
      if (isExternalRelationshipTarget(relationship)) continue;
      const target = relationship.Target || "";
      const resolved = resolveRelationshipTarget(relName, target);
      if (resolved && !zip.files[resolved]) {
        failures.push(`Relationship target is missing: ${relName} -> ${target} (${resolved}).`);
      }
    }
  }
  return failures;
}

async function invalidPresentationChildOrderFailures(zip) {
  const presentation = zip.file("ppt/presentation.xml");
  if (!presentation) {
    return ["Missing required package part: ppt/presentation.xml."];
  }
  const parser = new DOMParser();
  const doc = parser.parseFromString(await presentation.async("string"), "application/xml");
  const directChildren = [];
  for (let child = doc.documentElement.firstChild; child; child = child.nextSibling) {
    if (child.nodeType === 1) directChildren.push(child.localName || child.nodeName.replace(/^.*:/, ""));
  }
  const notesMasterIndex = directChildren.indexOf("notesMasterIdLst");
  const slideIdIndex = directChildren.indexOf("sldIdLst");
  return notesMasterIndex !== -1 && slideIdIndex !== -1 && notesMasterIndex > slideIdIndex
    ? ["ppt/presentation.xml has notesMasterIdLst after sldIdLst; expected notesMasterIdLst before sldIdLst."]
    : [];
}

function unwrappedOfficeMathFailures(docs) {
  const failures = [];
  docs.forEach((doc, index) => {
    const unwrapped = elementsByLocalName(doc, "m").filter((node) => (
      node.namespaceURI === A14_NS && !hasAncestorChoiceRequiringA14(node)
    ));
    if (unwrapped.length) {
      failures.push(`Slide ${index + 1} has ${unwrapped.length} Office math extension element(s) outside mc:AlternateContent.`);
    }
  });
  return failures;
}

function hasAncestorChoiceRequiringA14(node) {
  let current = node.parentNode;
  while (current) {
    if ((current.localName === "Choice" || current.nodeName.endsWith(":Choice")) &&
        String(current.getAttribute("Requires") || "").split(/\s+/).includes("a14")) {
      return true;
    }
    current = current.parentNode;
  }
  return false;
}

function officeMathRunPropertyFailures(docs) {
  const failures = [];
  docs.forEach((doc, index) => {
    const badRuns = elementsByLocalName(doc, "r").filter((node) => (
      node.namespaceURI === MATH_NS &&
      ancestorByNamespaceLocalName(node, A14_NS, "m") &&
      !directChildrenByNamespaceLocalName(node, DRAWING_NS, "rPr").length
    ));
    if (badRuns.length) {
      failures.push(`Slide ${index + 1} has ${badRuns.length} Office math run(s) without DrawingML a:rPr.`);
    }
  });
  return failures;
}

function invalidTableCellAnchorFailures(docs) {
  const failures = [];
  const validAnchors = new Set(["t", "ctr", "b", "just", "dist"]);
  docs.forEach((doc, index) => {
    const invalidAnchors = elementsByLocalName(doc, "tcPr")
      .filter((node) => node.namespaceURI === DRAWING_NS)
      .map((node) => node.getAttribute("anchor"))
      .filter((anchor) => anchor && !validAnchors.has(anchor));
    if (invalidAnchors.length) {
      failures.push(`Slide ${index + 1} has ${invalidAnchors.length} table cell(s) with invalid anchor value(s): ${Array.from(new Set(invalidAnchors)).sort().join(", ")}`);
    }
  });
  return failures;
}

function relationshipEntries(xml) {
  const entries = [];
  for (const match of String(xml || "").matchAll(/<Relationship\b([^>]*)\/>/g)) {
    entries.push(xmlAttributes(match[1]));
  }
  return entries;
}

function xmlAttributes(text) {
  const attributes = {};
  for (const match of String(text || "").matchAll(/\b([A-Za-z_:][\w:.-]*)="([^"]*)"/g)) {
    attributes[match[1]] = match[2];
  }
  return attributes;
}

function isExternalRelationshipTarget(relationship) {
  const target = relationship.Target || "";
  return relationship.TargetMode === "External" || /^[a-z][a-z0-9+.-]*:/i.test(target) || target.startsWith("#");
}

function bottomOverflowFailure(doc, slideNumberForMessage, maxBottomOverflowEmu) {
  const slideBottom = 7429500;
  const worst = meaningfulObjects(doc)
    .map((object) => ({ object, overflow: object.y + object.cy - slideBottom }))
    .sort((a, b) => b.overflow - a.overflow)[0];
  return worst && worst.overflow > maxBottomOverflowEmu
    ? `Slide ${slideNumberForMessage} has bottom overflow ${worst.overflow} EMU; allowed maximum is ${maxBottomOverflowEmu}. Object: ${worst.object.name}`
    : "";
}

function maxOverlapFailure(doc, slideNumberForMessage, maxOverlapEmu) {
  const objects = meaningfulObjects(doc).sort((a, b) => a.y - b.y);
  let worst = null;
  for (let i = 0; i < objects.length - 1; i += 1) {
    const current = objects[i];
    const next = objects[i + 1];
    const overlap = Math.max(0, current.y + current.cy - next.y);
    if (overlap > 0 && (!worst || overlap > worst.overlap)) {
      worst = { current, next, overlap };
    }
  }
  return worst && worst.overlap > maxOverlapEmu
    ? `Slide ${slideNumberForMessage} has object overlap ${worst.overlap} EMU; allowed maximum is ${maxOverlapEmu}. Objects: ${worst.current.name} -> ${worst.next.name}`
    : "";
}

function minMathHeightFailure(doc, slideNumberForMessage, minMathHeightEmu) {
  const dense = meaningfulObjects(doc)
    .filter((object) => elementsByLocalName(object.node, "oMath").length > 0)
    .filter((object) => denseMathScore(object.text) >= 6)
    .sort((a, b) => a.cy - b.cy)[0];
  return dense && dense.cy < minMathHeightEmu
    ? `Slide ${slideNumberForMessage} has dense math object ${dense.name} with height ${dense.cy} EMU; minimum is ${minMathHeightEmu}.`
    : "";
}

function denseMathScore(text) {
  const raw = String(text || "");
  let score = 0;
  score += (raw.match(/[∑Σ]/g) || []).length * 2;
  score += (raw.match(/[=]/g) || []).length;
  score += (raw.match(/[∂]/g) || []).length * 2;
  score += (raw.match(/[{}()[\]]/g) || []).length;
  score += raw.length > 80 ? 4 : 0;
  score += raw.length > 140 ? 4 : 0;
  return score;
}

function maxSharedTopYFailure(doc, slideNumberForMessage, maxObjectsSameY) {
  const objectsByY = {};
  meaningfulObjects(doc).forEach((object) => {
    if (!objectsByY[object.y]) objectsByY[object.y] = [];
    objectsByY[object.y].push(object);
  });
  const worst = Object.entries(objectsByY).map(([y, objects]) => ({ y, objects })).sort((a, b) => b.objects.length - a.objects.length)[0];
  return worst && worst.objects.length > maxObjectsSameY
    ? `Slide ${slideNumberForMessage} has ${worst.objects.length} meaningful objects at y=${worst.y}; allowed maximum is ${maxObjectsSameY}. Objects: ${worst.objects.map((object) => object.name).join(", ")}`
    : "";
}

function meaningfulObjects(doc) {
  return elementsByLocalName(doc, "sp")
    .concat(elementsByLocalName(doc, "graphicFrame"))
    .concat(elementsByLocalName(doc, "pic"))
    .map((object) => {
      const cNvPr = elementsByLocalName(object, "cNvPr")[0];
      const off = elementsByLocalName(object, "off")[0];
      const ext = elementsByLocalName(object, "ext")[0];
      return {
        node: object,
        name: cNvPr ? cNvPr.getAttribute("name") || "" : "",
        text: object.textContent || "",
        x: off ? Number(off.getAttribute("x") || 0) : 0,
        y: off ? Number(off.getAttribute("y") || 0) : 0,
        cx: ext ? Number(ext.getAttribute("cx") || 0) : 0,
        cy: ext ? Number(ext.getAttribute("cy") || 0) : 0,
      };
    })
    .filter(isMeaningfulObject);
}

function isMeaningfulObject(object) {
  const hasText = elementsByLocalName(object.node, "txBody").length > 0;
  const hasTable = elementsByLocalName(object.node, "tbl").length > 0;
  const hasImage = object.node.localName === "pic" || object.node.nodeName.endsWith(":pic");
  if (!hasText && !hasTable && !hasImage) return false;
  if (hasText && /^\s*\d+\s*\/\s*\d+\s*$/.test(object.text)) return false;
  if (hasImage && object.x === 0 && object.y === 0 && object.cx > 8000000 && object.cy > 7000000) return false;
  return true;
}

function hasHebrewRtlParagraph(docs) {
  return docs.some((doc) => elementsByLocalName(doc, "p").some((paragraph) => {
    const text = paragraph.textContent || "";
    const pPr = elementsByLocalName(paragraph, "pPr")[0];
    return /[\u0590-\u05ff]/.test(text) && pPr && pPr.getAttribute("rtl") === "1";
  }));
}

function maxBulletParagraphsInTextBody(doc) {
  return Math.max(0, ...elementsByLocalName(doc, "txBody").map((body) => (
    elementsByLocalName(body, "p").filter(hasBulletProperties).length
  )));
}

function hasBulletProperties(paragraph) {
  const pPr = elementsByLocalName(paragraph, "pPr")[0];
  return Boolean(pPr && (elementsByLocalName(pPr, "buChar").length || elementsByLocalName(pPr, "buAutoNum").length));
}

function slideNumber(name) {
  const match = name.match(/slide(\d+)\.xml$/);
  return match ? Number(match[1]) : 0;
}

module.exports = {
  verifyPptxFile,
  verifyZipPackage,
};
