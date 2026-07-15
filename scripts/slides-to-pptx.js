#!/usr/bin/env node

/*
 * Convert this repository's Reveal-flavored Markdown slides into an editable
 * PowerPoint deck. The output is intentionally semantic, not pixel-identical:
 * text, images, tables, and equations become editable PPTX objects.
 */

const fs = require("fs");
const os = require("os");
const path = require("path");
const { spawnSync } = require("child_process");

const matter = require("gray-matter");
const MarkdownIt = require("markdown-it");
const cheerio = require("cheerio");
const sizeOf = require("image-size");
const pptxgen = require("pptxgenjs");
const JSZip = require("jszip");
const { DOMParser, XMLSerializer } = require("@xmldom/xmldom");

const { parseDeckModelFromFile } = require("./pptx-exporter/model");
const { planSlides } = require("./pptx-exporter/layout");
const { normalizeLatexForPandoc } = require("./pptx-exporter/math");
const { verifyPptxFile } = require("./pptx-exporter/verifier-core");

const SLIDE_W = 9.75;
const SLIDE_H = 8.125;
const SOURCE_W = 900;
const SOURCE_H = 750;
const BLUE = "006992";
const LIGHT = "F8F9FA";
const TEXT = "1F2933";
const MUTED = "5C6670";
const BG = "FFFFFF";
const CONTENT_TOP = 0.48;
const CONTENT_BOTTOM = SLIDE_H - 0.55;
const OMML_NS = "http://schemas.openxmlformats.org/officeDocument/2006/math";
const WORD_NS = "http://schemas.openxmlformats.org/wordprocessingml/2006/main";
const A14_NS = "http://schemas.microsoft.com/office/drawing/2010/main";
const DRAWING_NS = "http://schemas.openxmlformats.org/drawingml/2006/main";
const MARKUP_COMPAT_NS = "http://schemas.openxmlformats.org/markup-compatibility/2006";
const PRESENTATION_NS = "http://schemas.openxmlformats.org/presentationml/2006/main";
const MATH_TOKEN_PREFIX = "PPTXMATH";
const MATH_TOKEN_SUFFIX = "TOKEN";
const MATH_TOKEN_RE = /PPTXMATH(\d+)TOKEN/g;

const md = new MarkdownIt({
  html: true,
  linkify: false,
  typographer: false,
});

async function main() {
  try {
    const args = parseArgs(process.argv.slice(2));
    if (args.help) {
      printUsage();
      return;
    }
    if (!args.input || !args.output) {
      printUsage();
      throw new Error("Both --input and --output are required.");
    }

    const rootDir = process.cwd();
    const inputPath = path.resolve(rootDir, args.input);
    const outputPath = path.resolve(rootDir, args.output);
    const pandocBin = resolvePandocBin(args.pandoc);

    preflight(inputPath);

    const parsed = parseDeck(inputPath);
    const model = parseDeckModelFromFile(inputPath);
    const plannedSlides = planSlides(model.slides, { splitDenseSlides: args.splitDenseSlides !== false });
    const slides = slidesFromPlannedModel(plannedSlides);
    const mathItems = model.mathItems.slice();
    const animationPlan = [];
    const warnings = [];
    const pptx = buildPresentation(rootDir, inputPath, parsed, slides, mathItems, animationPlan, warnings);

    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    await writePptx(pptx, outputPath);

    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "slides-pptx-"));
    try {
      if (mathItems.length) {
        preflightPandoc(pandocBin);
      }
      const ommlByToken = await convertMathItems(mathItems, pandocBin, tmpDir);
      await patchPresentationXml(outputPath, ommlByToken, animationPlan);
    } finally {
      removeDirectory(tmpDir);
    }

    if (args.strict !== false) {
      const failures = await verifyPptxFile(outputPath, {
        noMathPlaceholders: true,
        requireOmml: mathItems.length > 0,
        requireTiming: animationPlan.some((targets) => targets && targets.length),
      });
      if (failures.length) {
        throw new Error(`Strict PPTX verification failed:\n${failures.join("\n")}`);
      }
    }

    warnings.forEach((warning) => console.warn(`slides:pptx warning: ${warning}`));
    console.log(`Created editable PPTX: ${outputPath}`);
    console.log(`Slides: ${slides.length}; equations: ${mathItems.length}`);
  } catch (error) {
    console.error(`slides:pptx failed: ${error.message}`);
    if (process.env.DEBUG_SLIDES_PPTX) {
      console.error(error.stack);
    }
    process.exitCode = 1;
  }
}

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--help" || arg === "-h") {
      args.help = true;
    } else if (arg === "--input") {
      args.input = argv[++i];
    } else if (arg === "--output") {
      args.output = argv[++i];
    } else if (arg === "--pandoc") {
      args.pandoc = argv[++i];
    } else if (arg === "--strict") {
      args.strict = true;
    } else if (arg === "--no-strict") {
      args.strict = false;
    } else if (arg === "--no-split") {
      args.splitDenseSlides = false;
    } else if (!arg.startsWith("-") && !args.input) {
      args.input = arg;
    } else if (!arg.startsWith("-") && !args.output) {
      args.output = arg;
    } else if (!arg.startsWith("-") && !args.pandoc) {
      args.pandoc = arg;
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }
  return args;
}

function printUsage() {
  console.log([
    "Usage:",
    "  npm run slides:pptx -- --input content/tutorial06/slides.md --output public/assets/tutorial06_slides.pptx",
    "",
    "Options:",
    "  --input   Path to a Reveal Markdown slides.md file",
    "  --output  Destination .pptx path",
    "  --pandoc  Optional Pandoc executable path; defaults to PANDOC_BIN or pandoc",
    "  --strict  Fail if generated package/schema verification fails (default)",
    "  --no-strict  Write output even if strict verification would fail",
    "  --no-split  Preserve one source slide per PPTX slide for debugging",
  ].join("\n"));
}

function preflight(inputPath) {
  if (!fs.existsSync(inputPath)) {
    throw new Error(`Input file does not exist: ${inputPath}`);
  }
}

function preflightPandoc(pandocBin) {
  const pandoc = spawnSync(pandocBin, ["--version"], { encoding: "utf8" });
  if (pandoc.error || pandoc.status !== 0) {
    throw new Error([
      `Pandoc is required for native editable equations, but "${pandocBin}" could not be run.`,
      "Install Pandoc or run inside the repository Docker image, then try again.",
      "You can also pass --pandoc C:\\path\\to\\pandoc.exe or set PANDOC_BIN.",
    ].join(" "));
  }
}

function resolvePandocBin(explicitPandocBin) {
  if (explicitPandocBin) {
    return explicitPandocBin;
  }
  if (process.env.PANDOC_BIN) {
    return process.env.PANDOC_BIN;
  }
  const localPandoc = path.join(os.homedir(), "AppData", "Local", "Pandoc", "pandoc.exe");
  if (process.platform === "win32" && fs.existsSync(localPandoc)) {
    return localPandoc;
  }
  return "pandoc";
}

function removeDirectory(dirPath) {
  if (!fs.existsSync(dirPath)) {
    return;
  }
  if (fs.rmSync) {
    fs.rmSync(dirPath, { recursive: true, force: true });
    return;
  }
  fs.rmdirSync(dirPath, { recursive: true });
}

function parseDeck(inputPath) {
  const raw = fs.readFileSync(inputPath, "utf8");
  const parsed = matter(raw);
  const $ = cheerio.load(parsed.content, { decodeEntities: false }, false);
  const root = $(".slides").first();
  if (!root.length) {
    throw new Error(`Could not find outer .slides container in ${inputPath}`);
  }

  const defaultDir = getDirection(root.attr("style"), root.attr("dir")) || "rtl";
  const slides = [];
  root.children("section").each(function eachSection() {
    collectLeafSections($, this, { dir: defaultDir, classes: [] }, slides);
  });
  if (!slides.length) {
    throw new Error(`No leaf <section> slides found in ${inputPath}`);
  }

  return {
    frontmatter: parsed.data || {},
    slides,
  };
}

function collectLeafSections($, section, inherited, slides) {
  const current = inheritSectionContext($, section, inherited);
  const children = $(section).children("section");
  if (children.length) {
    children.each(function eachChild() {
      collectLeafSections($, this, current, slides);
    });
    return;
  }
  slides.push({
    html: $(section).html() || "",
    dir: current.dir || "rtl",
    classes: current.classes,
  });
}

function inheritSectionContext($, section, inherited) {
  const classes = inherited.classes.slice();
  const ownClasses = ($(section).attr("class") || "").split(/\s+/).filter(Boolean);
  ownClasses.forEach((name) => {
    if (classes.indexOf(name) === -1) {
      classes.push(name);
    }
  });
  return {
    dir: getDirection($(section).attr("style"), $(section).attr("dir")) || inherited.dir,
    classes,
  };
}

function prepareSlides(slides) {
  return slides.map((sourceSlide, slideIndex) => ({
    html: sourceSlide.html,
    dir: sourceSlide.dir,
    classes: sourceSlide.classes,
    sourceIndex: slideIndex,
  }));
}

function slidesFromPlannedModel(plannedSlides) {
  return plannedSlides.map((slide, slideIndex) => ({
    html: plannedBlocksToHtml(slide.blocks),
    dir: slide.dir,
    classes: slide.classes || [],
    sourceIndex: slide.sourceIndex == null ? slideIndex : slide.sourceIndex,
    preTokenized: true,
    continuationLabel: slide.continuationLabel || "",
  }));
}

function plannedBlocksToHtml(blocks) {
  return blocks.map(blockToHtml).filter(Boolean).join("\n");
}

function blockToHtml(block) {
  const fragmentAttrs = fragmentHtmlAttrs(block.fragment);
  if (block.type === "heading") {
    const level = Math.max(1, Math.min(6, Number(block.level) || 2));
    return `<h${level}${fragmentAttrs}>${runsToHtml(block.runs || [{ text: block.text || "" }])}</h${level}>`;
  }
  if (block.type === "paragraph") {
    return `<p${fragmentAttrs}>${runsToHtml(block.runs || [{ text: block.text || "" }])}</p>`;
  }
  if (block.type === "list") {
    const tag = block.ordered ? "ol" : "ul";
    const items = (block.items || []).map((item) => (
      `<li${fragmentHtmlAttrs(item.fragment)}>${runsToHtml(item.runs || [{ text: item.text || "" }])}</li>`
    )).join("\n");
    return `<${tag}${fragmentAttrs}>${items}</${tag}>`;
  }
  if (block.type === "math") {
    const math = `<p>${escapeHtml(block.token || block.text || "")}</p>`;
    return block.fragment ? `<div${fragmentAttrs}>${math}</div>` : math;
  }
  if (block.type === "image") {
    return `<p${fragmentAttrs}><img src="${escapeHtml(block.src || "")}" alt="${escapeHtml(block.alt || "")}" style="${escapeHtml(block.style || "")}"></p>`;
  }
  if (block.type === "table") {
    const rows = (block.rows || []).map((row) => (
      `<tr>${row.map((cell) => `<td>${escapeHtml(cell.text || "")}</td>`).join("")}</tr>`
    )).join("\n");
    return `<table${fragmentAttrs}>${rows}</table>`;
  }
  if (block.type === "code") {
    return `<pre${fragmentAttrs}><code>${escapeHtml(block.text || "")}</code></pre>`;
  }
  return "";
}

function runsToHtml(runs) {
  return (runs || []).map((run) => {
    const text = escapeHtml(run.text || "");
    return run.dir === "ltr" ? `<span dir="ltr">${text}</span>` : text;
  }).join(" ");
}

function fragmentHtmlAttrs(fragment) {
  if (!fragment) return "";
  const classes = fragment.effect === "exit" ? "fragment fade-out" : "fragment";
  return ` class="${classes}" data-fragment-index="${Number(fragment.order) || 0}"`;
}

function escapeHtml(text) {
  return String(text || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function buildPresentation(rootDir, inputPath, parsed, slides, mathItems, animationPlan, warnings) {
  const pptx = new pptxgen();
  pptx.author = "technion046195";
  pptx.subject = "Editable export generated from Reveal Markdown";
  pptx.company = "Technion 046195";
  pptx.lang = "he-IL";
  pptx.layout = "LAYOUT_WIDE";
  pptx.defineLayout({ name: "TECHNION_REVEAL", width: SLIDE_W, height: SLIDE_H });
  pptx.layout = "TECHNION_REVEAL";
  pptx.theme = {
    headFontFace: "Arial",
    bodyFontFace: "Arial",
    lang: "he-IL",
  };

  const title = titleFromFrontmatterOrSlides(parsed, slides);
  if (title) {
    pptx.title = plainText(title);
  }

  const sourceDir = path.dirname(inputPath);
  slides.forEach((slideData, index) => {
    const slide = pptx.addSlide();
    addBackground(slide, rootDir);
    const slideAnimations = [];
    const context = {
      pptx,
      rootDir,
      sourceDir,
      slideData,
      mathItems,
      warnings,
      fragments: {},
      animationTargets: slideAnimations,
      layout: { y: CONTENT_TOP, objectCounter: 0, profile: { fontScale: 1, gapScale: 1 } },
      dir: slideData.dir || "rtl",
      align: (slideData.dir || "rtl") === "ltr" ? "left" : "right",
      sourceIndex: slideData.sourceIndex,
      slideIndex: index,
    };
    attachSharedLayout(context);
    renderSlide(slide, slideData, context);
    animationPlan[index] = slideAnimations;
    addSlideNumber(slide, index + 1, slides.length);
  });

  return pptx;
}

function titleFromFrontmatterOrSlides(parsed, slides) {
  if (parsed.frontmatter && parsed.frontmatter.title) {
    return String(parsed.frontmatter.title);
  }
  if (!slides.length) {
    return "";
  }
  const text = cheerio.load(renderMarkdownWithMathTokens(slides[0].html, []).html, { decodeEntities: false }, false)
    .root()
    .text();
  return text.trim();
}

function addBackground(slide, rootDir) {
  const bgPath = path.join(rootDir, "content", "assets", "paper_background.png");
  if (fs.existsSync(bgPath)) {
    slide.addImage({ path: bgPath, x: 0, y: 0, w: SLIDE_W, h: SLIDE_H });
  } else {
    slide.background = { color: BG };
  }
}

function addSlideNumber(slide, current, total) {
  slide.addText(`${current}/${total}`, {
    x: SLIDE_W - 0.9,
    y: SLIDE_H - 0.35,
    w: 0.62,
    h: 0.18,
    fontFace: "Arial",
    fontSize: 7,
    color: MUTED,
    align: "right",
    margin: 0,
    transparency: 20,
  });
}

function renderSlide(slide, slideData, context) {
  const rendered = slideData.preTokenized
    ? { html: slideData.html, mathItems: context.mathItems }
    : renderMarkdownWithMathTokens(slideData.html, context.mathItems);
  const $ = cheerio.load(rendered.html, { decodeEntities: false }, false);
  annotateFragments($, context);
  const nodes = $.root().contents().toArray();
  const onlyTitle = isSingleTitleSlide($, nodes);

  if (onlyTitle) {
    renderTitleSlide(slide, $, nodes[0], context);
    return;
  }

  context.layout.profile = fitSlideLayout($, nodes, context);
  nodes.forEach((node) => {
    renderBlock(slide, $, node, context);
  });
}

function fitSlideLayout($, nodes, context) {
  const available = CONTENT_BOTTOM - CONTENT_TOP;
  const defaultProfile = { fontScale: 1, gapScale: 1 };
  let total = measureBlocks($, nodes, context, defaultProfile);
  if (total <= available) {
    return defaultProfile;
  }

  const compactGaps = { fontScale: 1, gapScale: 0.55 };
  total = measureBlocks($, nodes, context, compactGaps);
  if (total <= available) {
    context.warnings.push(`Slide ${context.slideIndex + 1} uses compact vertical spacing to fit dense content.`);
    return compactGaps;
  }

  const fontScale = Math.max(0.82, Math.min(1, (available / total) * 0.94));
  const compressed = { fontScale, gapScale: 0.5 };
  total = measureBlocks($, nodes, context, compressed);
  if (total > available && fontScale > 0.82) {
    const tighter = { fontScale: Math.max(0.82, fontScale * (available / total) * 0.96), gapScale: 0.42 };
    const tighterTotal = measureBlocks($, nodes, context, tighter);
    if (tighterTotal < total) {
      total = tighterTotal;
      compressed.fontScale = tighter.fontScale;
      compressed.gapScale = tighter.gapScale;
    }
  }
  if (total > available) {
    context.warnings.push([
      `Slide ${context.slideIndex + 1} content is still taller than the slide after compression`,
      `(${total.toFixed(2)}in used for ${available.toFixed(2)}in available).`,
    ].join(" "));
  } else {
    context.warnings.push(`Slide ${context.slideIndex + 1} uses ${Math.round(fontScale * 100)}% font scaling to fit dense content.`);
  }
  return compressed;
}

function measureBlocks($, nodes, context, profile) {
  return nodes.reduce((sum, node) => sum + measureBlock($, node, context, profile), 0);
}

function measureBlock($, node, context, profile) {
  if (node.type === "text") {
    const text = normalizeText(node.data).trim();
    return text ? measuredParagraphHeight([{ text, options: {} }], context, { fontSize: 17 }, profile).total : 0;
  }
  if (node.type !== "tag") {
    return 0;
  }

  const scopedContext = contextForElement($, node, context);
  const name = node.name.toLowerCase();
  if (name.match(/^h[1-6]$/)) {
    if (!normalizeText($(node).text()).trim()) {
      return 0;
    }
    return measuredHeadingHeight($, node, scopedContext, Number(name.substring(1)), profile).total;
  }
  if (name === "p") {
    if (containsOnlyImage($, node)) {
      return measureImageGroupHeight($, node, scopedContext) + scaledGapForProfile(0.25, profile);
    }
    if (isDisplayMathParagraph($, node, scopedContext)) {
      return measuredDisplayMathHeight($, node, scopedContext, profile).total;
    }
    const runs = inlineRuns($, node, { dir: scopedContext.dir, color: TEXT, fontFace: "Arial" });
    return hasVisibleRuns(runs) ? measuredParagraphHeight(runs, scopedContext, { fontSize: 17 }, profile).total : 0;
  }
  if (name === "ul" || name === "ol") {
    return measuredListHeight($, node, scopedContext, name === "ol", 0, profile).total;
  }
  if (name === "table") {
    return measuredTableHeight($, node, scopedContext).total;
  }
  if (name === "div") {
    if ($(node).hasClass("imgbox") || $(node).find("> p > img, > img").length) {
      return measureImageGroupHeight($, node, scopedContext) + scaledGapForProfile(0.25, profile);
    }
    if ($(node).find("a.link-button").length && !normalizeText($(node).text()).replace(/PDF|Code/g, "").trim()) {
      return scaledGapForProfile(0.46, profile);
    }
    const next = contextForElement($, node, scopedContext);
    return measureBlocks($, $(node).contents().toArray(), next, profile);
  }
  if (name === "blockquote") {
    const runs = inlineRuns($, node, { dir: scopedContext.dir, color: MUTED, italic: true, fontFace: "Arial" });
    const fontSize = scaledFontForProfile(15, profile, 12);
    const height = Math.max(0.45, estimateTextHeight(runsText(runs), fontSize, SLIDE_W - 1.5, 1.2));
    return height + scaledGapForProfile(0.12, profile);
  }
  if (name === "pre") {
    const fontSize = scaledFontForProfile(12, profile, 12);
    const text = $(node).text().replace(/\s+$/g, "");
    const height = Math.min(2.6, Math.max(0.45, estimateTextHeight(text, fontSize, SLIDE_W - 1.3, 1.1)));
    return height + scaledGapForProfile(0.15, profile);
  }
  if (name === "a" && $(node).hasClass("link-button")) {
    return scaledGapForProfile(0.46, profile);
  }
  if (name === "img") {
    return measureImageGroupHeight($, node, scopedContext) + scaledGapForProfile(0.25, profile);
  }
  const next = contextForElement($, node, scopedContext);
  return measureBlocks($, $(node).contents().toArray(), next, profile);
}

function annotateFragments($, context) {
  $(".fragment").each((index, node) => {
    const id = `frag${index + 1}`;
    const rawIndex = $(node).attr("data-fragment-index");
    const parsedIndex = rawIndex == null || rawIndex === "" ? NaN : Number(rawIndex);
    const order = Number.isFinite(parsedIndex) ? parsedIndex : index;
    const effect = $(node).hasClass("fade-out") ? "exit" : "entrance";
    $(node).attr("data-pptx-fragment-id", id);
    context.fragments[id] = {
      id,
      order,
      sourceOrder: index,
      effect,
      tagName: node.name ? node.name.toLowerCase() : "",
    };
    if (isInlineFragmentNode(node)) {
      context.warnings.push([
        `Slide ${context.slideIndex + 1} has an inline ${node.name}.fragment.`,
        "The text is preserved, but independent inline-run animation is not supported yet.",
      ].join(" "));
    }
  });
}

function isInlineFragmentNode(node) {
  const name = node.name ? node.name.toLowerCase() : "";
  return ["span", "strong", "b", "em", "i", "code", "a"].indexOf(name) !== -1;
}

function isSingleTitleSlide($, nodes) {
  const meaningful = nodes.filter((node) => {
    if (node.type === "text") {
      return Boolean(normalizeText(node.data).trim());
    }
    if (node.type === "tag" && node.name === "p") {
      const text = normalizeText($(node).text()).trim();
      const hasButton = $(node).find("a.link-button").length;
      return Boolean(text) && !hasButton;
    }
    if (node.type === "tag" && node.name === "div" && $(node).find("a.link-button").length) {
      return false;
    }
    return true;
  });
  return meaningful.length === 1 && meaningful[0].type === "tag" && meaningful[0].name === "h1";
}

function renderTitleSlide(slide, $, node, context) {
  const x = 0.72;
  const y = 2.2;
  const w = SLIDE_W - 1.44;
  const h = 2.35;
  slide.addShape(shapeType(context.pptx, "roundRect"), {
    x,
    y,
    w,
    h,
    rectRadius: 0.12,
    fill: { color: BLUE },
    line: { color: BLUE, transparency: 100 },
    shadow: { type: "outer", color: "888888", opacity: 0.35, blur: 2, angle: 45, distance: 3 },
    objectName: objectNameForFragment(context, "title-panel"),
  });
  const runs = inlineRuns($, node, {
    dir: context.dir,
    color: LIGHT,
    bold: true,
    fontFace: "Arial",
  });
  slide.addText(runs.length ? runs : plainText($(node).text()), {
    x: x + 0.35,
    y: y + 0.25,
    w: w - 0.7,
    h: h - 0.5,
    fontFace: "Arial",
    fontSize: 28,
    bold: true,
    color: LIGHT,
    align: "center",
    valign: "mid",
    margin: 0.08,
    fit: "shrink",
    rtlMode: context.dir !== "ltr",
    lang: context.dir === "ltr" ? "en-US" : "he-IL",
    objectName: objectNameForFragment(context, "title"),
  });
}

function renderBlock(slide, $, node, context) {
  if (node.type === "text") {
    const text = normalizeText(node.data).trim();
    if (text) {
      addParagraph(slide, [{ text, options: {} }], context, { fontSize: 17 });
    }
    return;
  }
  if (node.type !== "tag") {
    return;
  }

  const scopedContext = contextForElement($, node, context);
  const name = node.name.toLowerCase();
  if (name.match(/^h[1-6]$/)) {
    if (normalizeText($(node).text()).trim()) {
      addHeading(slide, $, node, scopedContext, Number(name.substring(1)));
    }
  } else if (name === "p") {
    if (containsOnlyImage($, node)) {
      addImageGroup(slide, $, node, scopedContext);
    } else if (isDisplayMathParagraph($, node, scopedContext)) {
      addDisplayMathBlock(slide, $, node, scopedContext);
    } else {
      const runs = inlineRuns($, node, { dir: scopedContext.dir, color: TEXT, fontFace: "Arial" });
      if (hasVisibleRuns(runs)) {
        addParagraph(slide, runs, scopedContext, { fontSize: 17 });
      }
    }
  } else if (name === "ul" || name === "ol") {
    addList(slide, $, node, scopedContext, name === "ol", 0);
  } else if (name === "table") {
    addTable(slide, $, node, scopedContext);
  } else if (name === "div") {
    if ($(node).hasClass("imgbox") || $(node).find("> p > img, > img").length) {
      addImageGroup(slide, $, node, scopedContext);
    } else if ($(node).find("a.link-button").length && !normalizeText($(node).text()).replace(/PDF|Code/g, "").trim()) {
      addLinkButton(slide, $, node, scopedContext);
    } else {
      const next = contextForElement($, node, scopedContext);
      $(node).contents().toArray().forEach((child) => renderBlock(slide, $, child, next));
    }
  } else if (name === "blockquote") {
    addQuote(slide, $, node, scopedContext);
  } else if (name === "pre") {
    addCodeBlock(slide, $, node, scopedContext);
  } else if (name === "a" && $(node).hasClass("link-button")) {
    addLinkButton(slide, $, node, scopedContext);
  } else if (name === "img") {
    addImageGroup(slide, $, node, scopedContext);
  } else {
    const next = contextForElement($, node, scopedContext);
    $(node).contents().toArray().forEach((child) => renderBlock(slide, $, child, next));
  }
}

function measuredHeadingHeight($, node, context, level, profile) {
  const runs = inlineRuns($, node, {
    dir: context.dir,
    color: level <= 2 ? TEXT : BLUE,
    bold: true,
    fontFace: "Arial",
  });
  const sizes = { 1: 30, 2: 25, 3: 21, 4: 18, 5: 15, 6: 14 };
  const baseFontSize = sizes[level] || 18;
  const fontSize = scaledFontForProfile(baseFontSize, profile, level <= 2 ? 16 : 9);
  const textHeight = estimateTextHeight(runsText(runs), fontSize, SLIDE_W - 1.1, 1.18);
  const minHeight = scaledValueForProfile(level <= 2 ? 0.45 : 0.32, profile, 0.24);
  const height = Math.max(textHeight, minHeight);
  const layoutHeight = Math.max(height, scaledValueForProfile(level <= 2 ? 0.5 : 0.38, profile, 0.28));
  return {
    fontSize,
    height,
    total: layoutHeight + scaledGapForProfile(0.08, profile),
  };
}

function measuredParagraphHeight(runs, context, opts, profile) {
  const baseFontSize = opts.fontSize || 17;
  const fontSize = scaledFontForProfile(baseFontSize, profile, 14);
  const w = opts.w || SLIDE_W - 1.3;
  const text = runsText(runs);
  const minHeight = scaledValueForProfile(opts.minHeight || 0.26, profile, 0.2);
  const height = Math.max(minHeight, estimateTextHeight(text, fontSize, w, 1.22));
  return {
    fontSize,
    height,
    total: height + scaledGapForProfile(opts.after == null ? 0.09 : opts.after, profile),
  };
}

function measuredDisplayMathHeight($, node, context, profile) {
  const token = normalizeText($(node).text()).trim();
  const item = mathItemForToken(context.mathItems, token);
  const latex = item ? item.latex : "";
  const baseFontSize = latex.length > 110 ? 16 : 18;
  const fontSize = scaledFontForProfile(baseFontSize, profile, 14);
  const height = estimateDisplayMathHeight(latex, fontSize, SLIDE_W - 1.3);
  return {
    fontSize,
    height,
    total: height + scaledGapForProfile(0.16, profile),
  };
}

function measuredListHeight($, node, context, ordered, depth, profile, existingItems) {
  const items = existingItems || [];
  if (!existingItems) {
    collectListItems($, node, context, ordered, depth, items);
  }
  const fontSize = scaledFontForProfile(16, profile, 14);
  const nestedFontSize = scaledFontForProfile(14, profile, 12);
  const w = SLIDE_W - 1.28;
  const text = items.map((item) => runsText(item.runs)).join("\n");
  const height = Math.max(
    scaledValueForProfile(0.36, profile, 0.28),
    estimateTextHeight(text, fontSize, w, 1.22) + items.length * scaledGapForProfile(0.05, profile)
  );
  return {
    fontSize,
    nestedFontSize,
    height,
    total: height + scaledGapForProfile(0.12, profile),
  };
}

function measuredTableHeight($, node, context) {
  const rows = [];
  $(node).find("tr").each((_, tr) => {
    if ($(tr).children("th,td").length) {
      rows.push(tr);
    }
  });
  if (!rows.length) {
    return { height: 0, total: 0 };
  }
  const rowHeight = 0.34;
  const height = Math.min(SLIDE_H - context.y - 0.55, rows.length * rowHeight + 0.12);
  return { height, total: height + 0.18 };
}

function addHeading(slide, $, node, context, level) {
  const runs = inlineRuns($, node, {
    dir: context.dir,
    color: level <= 2 ? TEXT : BLUE,
    bold: true,
    fontFace: "Arial",
  });
  const measured = measuredHeadingHeight($, node, context, level, context.layout.profile);
  const fontSize = measured.fontSize;
  const height = measured.height;
  slide.addText(runs.length ? runs : plainText($(node).text()), {
    x: 0.55,
    y: context.y,
    w: SLIDE_W - 1.1,
    h: Math.max(height, level <= 2 ? 0.45 : 0.32),
    fontFace: "Arial",
    fontSize,
    bold: true,
    color: level <= 2 ? TEXT : BLUE,
    align: context.align,
    margin: 0.02,
    fit: "shrink",
    rtlMode: context.dir !== "ltr",
    lang: context.dir === "ltr" ? "en-US" : "he-IL",
    breakLine: false,
    objectName: objectNameForFragment(context, "heading"),
  });
  context.y += measured.total;
}

function addParagraph(slide, runs, context, opts) {
  const measured = measuredParagraphHeight(runs, context, opts, context.layout.profile);
  const fontSize = measured.fontSize;
  const x = opts.x || 0.65;
  const w = opts.w || SLIDE_W - 1.3;
  const height = measured.height;
  slide.addText(runs, {
    x,
    y: context.y,
    w,
    h: height,
    fontFace: "Arial",
    fontSize,
    color: TEXT,
    align: opts.align || context.align,
    valign: "top",
    margin: 0.03,
    fit: "shrink",
    rtlMode: (opts.dir || context.dir) !== "ltr",
    lang: (opts.dir || context.dir) === "ltr" ? "en-US" : "he-IL",
    breakLine: false,
    objectName: objectNameForFragment(context, "paragraph"),
  });
  context.y += measured.total;
}

function addDisplayMathBlock(slide, $, node, context) {
  const token = normalizeText($(node).text()).trim();
  const item = mathItemForToken(context.mathItems, token);
  const latex = item ? item.latex : "";
  const measured = measuredDisplayMathHeight($, node, context, context.layout.profile);
  const fontSize = measured.fontSize;
  const x = 0.65;
  const w = SLIDE_W - 1.3;
  const height = measured.height;
  slide.addText([{
    text: token,
    options: {
      fontFace: "Cambria Math",
      fontSize,
      color: TEXT,
      rtlMode: false,
      lang: "en-US",
    },
  }], {
    x,
    y: context.y,
    w,
    h: height,
    fontFace: "Cambria Math",
    fontSize,
    color: TEXT,
    align: "center",
    valign: "mid",
    margin: 0.03,
    fit: "shrink",
    rtlMode: false,
    lang: "en-US",
    breakLine: false,
    objectName: objectNameForFragment(context, "math"),
  });
  context.y += measured.total;
}

function addList(slide, $, node, context, ordered, depth) {
  const items = [];
  collectListItems($, node, context, ordered, depth, items);
  if (!items.length) {
    return;
  }

  const x = context.dir === "ltr" ? 0.78 : 0.58;
  const w = SLIDE_W - 1.28;
  const measured = measuredListHeight($, node, context, ordered, depth, context.layout.profile, items);
  const height = measured.height;
  const hasParagraphFragments = items.some((item) => item.ownFragmentId);
  let objectName;
  if (context.currentFragmentId) {
    objectName = objectNameForFragment(context, "list");
  } else if (hasParagraphFragments) {
    objectName = objectNameForGeneratedObject(context, "list");
  }

  const runs = [];
  items.forEach((item, itemIndex) => {
    const itemRuns = item.runs.length ? item.runs : [{
      text: item.text,
      options: runOptions(item.context),
    }];
    itemRuns.forEach((run, runIndex) => {
      const options = Object.assign({}, run.options || {});
      options.fontFace = options.fontFace || "Arial";
      options.fontSize = item.depth ? measured.nestedFontSize : measured.fontSize;
      options.color = options.color || TEXT;
      options.rtlMode = item.context.dir !== "ltr";
      options.lang = item.context.dir === "ltr" ? "en-US" : "he-IL";
      if (runIndex === 0) {
        options.bullet = item.ordered
          ? { type: "number", style: "arabicPeriod", startAt: item.number }
          : { indent: 18 };
        options.indentLevel = item.depth;
        options.paraSpaceAfter = item.depth ? 2 : 4;
      }
      if (runIndex === itemRuns.length - 1 && itemIndex < items.length - 1) {
        options.breakLine = true;
      }
      runs.push({ text: run.text, options });
    });

    if (!context.currentFragmentId && item.ownFragmentId && objectName) {
      const fragment = context.fragments[item.ownFragmentId];
      context.animationTargets.push({
        fragmentId: fragment.id,
        order: fragment.order,
        sourceOrder: fragment.sourceOrder,
        effect: fragment.effect,
        objectName,
        paragraphIndex: itemIndex,
      });
    }
  });

  slide.addText(runs, {
    x,
    y: context.y,
    w,
    h: height,
    fontFace: "Arial",
    fontSize: measured.fontSize,
    color: TEXT,
    align: context.align,
    margin: 0.02,
    fit: "shrink",
    rtlMode: context.dir !== "ltr",
    lang: context.dir === "ltr" ? "en-US" : "he-IL",
    breakLine: false,
    objectName,
  });
  context.y += measured.total;
}

function collectListItems($, node, context, ordered, depth, items) {
  $(node).children("li").each((index, li) => {
    const itemContext = contextForElement($, li, context);
    const clone = $(li).clone();
    clone.children("ul,ol").remove();
    const runs = inlineRuns($, clone[0], { dir: itemContext.dir, color: TEXT, fontFace: "Arial" });
    const text = normalizeText(inlineText($, clone[0])).trim();
    if (runs.length || text) {
      items.push({
        runs,
        text,
        context: itemContext,
        ordered,
        number: index + 1,
        depth,
        ownFragmentId: $(li).attr("data-pptx-fragment-id") || "",
      });
    }
    $(li).children("ul,ol").each((_, childList) => {
      collectListItems($, childList, itemContext, childList.name.toLowerCase() === "ol", depth + 1, items);
    });
  });
}

function addTable(slide, $, node, context) {
  const rows = [];
  $(node).find("tr").each((_, tr) => {
    const row = [];
    $(tr).children("th,td").each((__, cell) => {
      row.push({
        text: normalizeText(inlineText($, cell)).trim(),
        options: {
          bold: cell.name.toLowerCase() === "th",
          color: TEXT,
          fill: cell.name.toLowerCase() === "th" ? { color: "AAAAAA" } : undefined,
          margin: 0.05,
        },
      });
    });
    if (row.length) {
      rows.push(row);
    }
  });
  if (!rows.length) {
    return;
  }

  const x = 0.55;
  const w = SLIDE_W - 1.1;
  const h = measuredTableHeight($, node, context).height;
  slide.addTable(rows, {
    x,
    y: context.y,
    w,
    h,
    border: { type: "solid", color: "777777", pt: 0.8 },
    fill: { color: "FFFFFF" },
    color: TEXT,
    fontFace: "Arial",
    fontSize: 12,
    align: "center",
    valign: "mid",
    margin: 0.03,
    rtlMode: context.dir !== "ltr",
    lang: context.dir === "ltr" ? "en-US" : "he-IL",
    autoFit: true,
    objectName: objectNameForFragment(context, "table"),
  });
  context.y += h + 0.18;
}

function addQuote(slide, $, node, context) {
  const runs = inlineRuns($, node, { dir: context.dir, color: MUTED, italic: true, fontFace: "Arial" });
  const fontSize = scaledFont(15, context, 12);
  const height = Math.max(0.45, estimateTextHeight(runsText(runs), fontSize, SLIDE_W - 1.5, 1.2));
  slide.addShape(shapeType(context.pptx, "rect"), {
    x: 0.55,
    y: context.y,
    w: 0.06,
    h: height,
    fill: { color: BLUE },
    line: { transparency: 100 },
    objectName: objectNameForFragment(context, "quote-rule"),
  });
  slide.addText(runs, {
    x: 0.72,
    y: context.y,
    w: SLIDE_W - 1.35,
    h: height,
    fontFace: "Arial",
    fontSize,
    italic: true,
    color: MUTED,
    align: context.align,
    margin: 0.03,
    fit: "shrink",
    rtlMode: context.dir !== "ltr",
    objectName: objectNameForFragment(context, "quote"),
  });
  context.y += height + scaledGap(0.12, context);
}

function addCodeBlock(slide, $, node, context) {
  const text = $(node).text().replace(/\s+$/g, "");
  const fontSize = scaledFont(12, context, 12);
  const height = Math.min(2.6, Math.max(0.45, estimateTextHeight(text, fontSize, SLIDE_W - 1.3, 1.1)));
  slide.addShape(shapeType(context.pptx, "rect"), {
    x: 0.65,
    y: context.y,
    w: SLIDE_W - 1.3,
    h: height,
    fill: { color: "F3F4F6" },
    line: { color: "D5D8DC", pt: 0.75 },
    objectName: objectNameForFragment(context, "code-bg"),
  });
  slide.addText(text, {
    x: 0.72,
    y: context.y + 0.05,
    w: SLIDE_W - 1.44,
    h: height - 0.1,
    fontFace: "Courier New",
    fontSize,
    color: TEXT,
    align: "left",
    margin: 0.02,
    fit: "shrink",
    rtlMode: false,
    objectName: objectNameForFragment(context, "code"),
  });
  context.y += height + scaledGap(0.15, context);
}

function addLinkButton(slide, $, node, context) {
  const anchor = node.name && node.name.toLowerCase() === "a" ? $(node) : $(node).find("a").first();
  if (!anchor.length) {
    return;
  }
  const label = normalizeText(anchor.text()).trim() || "Link";
  const href = anchor.attr("href") || "";
  const url = href.match(/^https?:\/\//) ? href : href;
  const w = Math.max(0.8, Math.min(1.35, label.length * 0.18 + 0.3));
  const x = context.dir === "ltr" ? 0.65 : SLIDE_W - 0.65 - w;
  slide.addShape(shapeType(context.pptx, "roundRect"), {
    x,
    y: context.y,
    w,
    h: 0.36,
    fill: { color: BLUE },
    line: { color: "005A7E", pt: 0.6 },
    objectName: objectNameForFragment(context, "button-bg"),
  });
  slide.addText(label, {
    x,
    y: context.y + 0.04,
    w,
    h: 0.25,
    fontFace: "Arial",
    fontSize: 10,
    bold: true,
    color: LIGHT,
    align: "center",
    margin: 0,
    hyperlink: url ? { url } : undefined,
    objectName: objectNameForFragment(context, "button"),
  });
  context.y += scaledGap(0.46, context);
}

function addImageGroup(slide, $, node, context) {
  const container = $(node);
  const images = node.name && node.name.toLowerCase() === "img" ? [node] : container.find("img").toArray();
  if (!images.length) {
    return;
  }

  const hasShadow = !container.hasClass("no-shadow");
  const layout = imageGroupLayout($, node, context);
  const placements = layout.placements;
  const rowH = layout.rowH;
  const gap = layout.gap;

  const totalW = layout.totalW;
  let x = (SLIDE_W - totalW) / 2;
  const y = context.y;
  if (hasShadow) {
    slide.addShape(shapeType(context.pptx, "rect"), {
      x: x - 0.06,
      y: y - 0.06,
      w: totalW + 0.12,
      h: rowH + 0.12,
      fill: { color: "FFFFFF" },
      line: { color: "FFFFFF", transparency: 100 },
      shadow: { type: "outer", color: "888888", opacity: 0.25, blur: 1.2, angle: 45, distance: 1.5 },
      objectName: objectNameForFragment(context, "image-shadow"),
    });
  }

  placements.forEach((item, index) => {
    slide.addImage({
      path: item.imagePath,
      x,
      y: y + (rowH - item.h) / 2,
      w: item.w,
      h: item.h,
      objectName: objectNameForFragment(context, "image"),
    });
    x += item.w + (index < placements.length - 1 ? gap : 0);
  });
  context.y += rowH + scaledGap(0.25, context);
}

function measureImageGroupHeight($, node, context) {
  const layout = imageGroupLayout($, node, context);
  return layout.rowH;
}

function imageGroupLayout($, node, context) {
  const container = $(node);
  const images = node.name && node.name.toLowerCase() === "img" ? [node] : container.find("img").toArray();
  const style = parseStyle(container.attr("style"));
  const gap = 0.12;
  const availableW = maxWidthToInches(style["max-width"], SLIDE_W - 1.2);
  const maxH = maxHeightToInches(style["max-height"], SLIDE_H - context.y - 0.7);
  const totalGap = gap * Math.max(0, images.length - 1);
  const perImageW = Math.max(0.4, (availableW - totalGap) / Math.max(1, images.length));
  const placements = [];
  let rowH = 0;

  images.forEach((img) => {
    const imagePath = resolveImagePath($(img), context.sourceDir);
    const dims = sizeOf(imagePath);
    const explicitWidth = attrPx($(img).attr("width"));
    let targetW = explicitWidth ? pxToInches(explicitWidth) : perImageW;
    targetW = Math.min(targetW, perImageW);
    let targetH = targetW * (dims.height / dims.width);
    if (targetH > maxH) {
      targetH = maxH;
      targetW = targetH * (dims.width / dims.height);
    }
    placements.push({ imagePath, w: targetW, h: targetH });
    rowH = Math.max(rowH, targetH);
  });

  return {
    gap,
    placements,
    rowH,
    totalW: placements.reduce((sum, item) => sum + item.w, 0) + totalGap,
  };
}

function resolveImagePath(img, sourceDir) {
  let src = img.attr("src") || "";
  if (!src && img.attr("data-src")) {
    src = img.attr("data-src");
  }
  if (!src) {
    throw new Error("Found an image without src.");
  }
  if (src.match(/^https?:\/\//)) {
    throw new Error(`Remote images are not supported in v1: ${src}`);
  }
  const clean = decodeURIComponent(src.split("?")[0].split("#")[0]);
  const imagePath = path.resolve(sourceDir, clean);
  if (!fs.existsSync(imagePath)) {
    throw new Error(`Image not found: ${imagePath}`);
  }
  return imagePath;
}

function renderMarkdownWithMathTokens(input, mathItems) {
  const replaced = replaceMathWithTokens(input, mathItems);
  return { html: md.render(replaced), mathItems };
}

function replaceMathWithTokens(input, mathItems) {
  let output = "";
  let i = 0;
  while (i < input.length) {
    if (input.slice(i, i + 2) === "$$") {
      const end = input.indexOf("$$", i + 2);
      if (end === -1) {
        throw new Error("Unclosed display math block ($$ ... $$).");
      }
      const latex = input.slice(i + 2, end).trim();
      output += tokenForMath(mathItems, latex, true);
      i = end + 2;
    } else if (input[i] === "$" && input[i - 1] !== "\\" && input[i + 1] !== "$") {
      const end = findInlineMathEnd(input, i + 1);
      if (end === -1) {
        output += input[i];
        i += 1;
      } else {
        const latex = input.slice(i + 1, end).trim();
        output += tokenForMath(mathItems, latex, false);
        i = end + 1;
      }
    } else {
      output += input[i];
      i += 1;
    }
  }
  return output;
}

function findInlineMathEnd(input, start) {
  for (let i = start; i < input.length; i += 1) {
    if (input[i] === "\n") {
      return -1;
    }
    if (input[i] === "$" && input[i - 1] !== "\\" && input[i + 1] !== "$") {
      return i;
    }
  }
  return -1;
}

function tokenForMath(mathItems, latex, display) {
  const decodedLatex = decodeHtmlEntities(latex);
  if (!decodedLatex) {
    throw new Error("Empty math expression found.");
  }
  const id = mathItems.length;
  const token = `${MATH_TOKEN_PREFIX}${id}${MATH_TOKEN_SUFFIX}`;
  mathItems.push({ id, token, latex: decodedLatex, display });
  return token;
}

function decodeHtmlEntities(text) {
  return String(text || "")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, "\"")
    .replace(/&#39;/g, "'");
}

function inlineRuns($, node, context) {
  const runs = [];
  $(node).contents().toArray().forEach((child) => {
    appendInlineRuns($, child, context, runs);
  });
  return runs.filter((run) => run.text !== "");
}

function appendInlineRuns($, node, context, runs) {
  if (node.type === "text") {
    appendTextRuns(node.data || "", context, runs);
    return;
  }
  if (node.type !== "tag") {
    return;
  }
  const name = node.name.toLowerCase();
  if (name === "br") {
    runs.push({ text: "\n", options: {} });
    return;
  }
  if (name === "img") {
    return;
  }

  const next = Object.assign({}, context);
  const style = parseStyle($(node).attr("style"));
  const dir = getDirection($(node).attr("style"), $(node).attr("dir"));
  if (dir) {
    next.dir = dir;
  }
  if (style.color) {
    next.color = cssColorToHex(style.color) || next.color;
  }
  if (name === "strong" || name === "b") {
    next.bold = true;
  }
  if (name === "em" || name === "i") {
    next.italic = true;
  }
  if (name === "code") {
    next.fontFace = "Courier New";
    next.color = next.color || MUTED;
  }
  if (name === "a") {
    next.hyperlink = $(node).attr("href");
    next.color = BLUE;
    next.underline = true;
  }
  $(node).contents().toArray().forEach((child) => {
    appendInlineRuns($, child, next, runs);
  });
}

function appendTextRuns(text, context, runs) {
  const parts = text.split(MATH_TOKEN_RE);
  for (let i = 0; i < parts.length; i += 1) {
    if (i % 2 === 0) {
      const cleaned = normalizeText(parts[i]);
      if (cleaned) {
        runs.push({
          text: cleaned,
          options: runOptions(context),
        });
      }
    } else {
      const token = `${MATH_TOKEN_PREFIX}${parts[i]}${MATH_TOKEN_SUFFIX}`;
      runs.push({
        text: token,
        options: Object.assign(runOptions(context), {
          fontFace: "Cambria Math",
          color: context.color || TEXT,
        }),
      });
    }
  }
}

function runOptions(context) {
  const opts = {};
  if (context.bold) opts.bold = true;
  if (context.italic) opts.italic = true;
  if (context.underline) opts.underline = true;
  if (context.color) opts.color = context.color;
  if (context.fontFace) opts.fontFace = context.fontFace;
  if (context.hyperlink) opts.hyperlink = { url: context.hyperlink };
  opts.rtlMode = context.dir !== "ltr";
  opts.lang = context.dir === "ltr" ? "en-US" : "he-IL";
  return opts;
}

function inlineText($, node) {
  let text = "";
  $(node).contents().toArray().forEach((child) => {
    if (child.type === "text") {
      text += child.data || "";
    } else if (child.type === "tag" && child.name.toLowerCase() === "br") {
      text += "\n";
    } else if (child.type === "tag") {
      text += inlineText($, child);
    }
  });
  return text;
}

function contextForElement($, node, context) {
  const next = childContext(context);
  const dir = getDirection($(node).attr("style"), $(node).attr("dir"));
  if (dir) {
    next.dir = dir;
    next.align = dir === "ltr" ? "left" : "right";
  }
  const fragmentId = $(node).attr("data-pptx-fragment-id");
  if (fragmentId) {
    next.currentFragmentId = fragmentId;
  }
  return next;
}

function childContext(context) {
  const next = Object.assign({}, context);
  next.layout = context.layout;
  attachSharedLayout(next);
  return next;
}

function attachSharedLayout(context) {
  Object.defineProperty(context, "y", {
    enumerable: true,
    configurable: true,
    get() {
      return context.layout.y;
    },
    set(value) {
      context.layout.y = value;
    },
  });
  Object.defineProperty(context, "objectCounter", {
    enumerable: true,
    configurable: true,
    get() {
      return context.layout.objectCounter;
    },
    set(value) {
      context.layout.objectCounter = value;
    },
  });
}

function objectNameForFragment(context, kind) {
  if (!context.currentFragmentId) {
    return undefined;
  }
  const fragment = context.fragments[context.currentFragmentId];
  if (!fragment) {
    return undefined;
  }
  const objectName = `pptxfrag-s${context.slideIndex + 1}-${fragment.id}-${kind}-${context.objectCounter += 1}`;
  context.animationTargets.push({
    fragmentId: fragment.id,
    order: fragment.order,
    sourceOrder: fragment.sourceOrder,
    effect: fragment.effect,
    objectName,
  });
  return objectName;
}

function objectNameForGeneratedObject(context, kind) {
  return `pptxfrag-s${context.slideIndex + 1}-generated-${kind}-${context.objectCounter += 1}`;
}

function containsOnlyImage($, node) {
  const clone = $(node).clone();
  const imgCount = clone.find("img").length;
  clone.find("img").remove();
  return imgCount > 0 && !normalizeText(clone.text()).trim();
}

function isDisplayMathParagraph($, node, context) {
  const token = normalizeText($(node).text()).trim();
  const item = mathItemForToken(context.mathItems, token);
  return Boolean(item && item.display && containsOnlyMathToken(token));
}

function mathItemForToken(mathItems, token) {
  const match = String(token || "").match(/^PPTXMATH(\d+)TOKEN$/);
  if (!match) {
    return null;
  }
  return mathItems[Number(match[1])] || null;
}

function containsOnlyMathToken(text) {
  return /^PPTXMATH\d+TOKEN$/.test(String(text || "").trim());
}

function hasVisibleRuns(runs) {
  return runs.some((run) => normalizeText(run.text).trim());
}

function runsText(runs) {
  if (typeof runs === "string") {
    return runs;
  }
  return runs.map((run) => run.text || "").join("");
}

function plainText(text) {
  return normalizeText(text || "").trim();
}

function normalizeText(text) {
  return String(text || "")
    .replace(/\u00a0/g, " ")
    .replace(/[ \t\r\n]+/g, " ");
}

function scaledFont(baseSize, context, minSize) {
  return scaledFontForProfile(baseSize, context.layout.profile, minSize);
}

function scaledGap(baseGap, context) {
  return scaledGapForProfile(baseGap, context.layout.profile);
}

function scaledFontForProfile(baseSize, profile, minSize) {
  return Math.max(minSize || 1, baseSize * (profile.fontScale || 1));
}

function scaledGapForProfile(baseGap, profile) {
  return baseGap * (profile.gapScale == null ? 1 : profile.gapScale);
}

function scaledValueForProfile(baseValue, profile, minValue) {
  return Math.max(minValue || 0, baseValue * (profile.fontScale || 1));
}

function estimateTextHeight(text, fontSize, width, lineHeight) {
  const effectiveWidth = Math.max(1, width);
  const charsPerLine = Math.max(14, Math.floor(effectiveWidth * (120 / Math.max(fontSize, 1))));
  const lines = String(text || "")
    .split("\n")
    .reduce((sum, line) => sum + Math.max(1, Math.ceil(line.length / charsPerLine)), 0);
  return Math.max(0.18, (lines * fontSize * (lineHeight || 1.18)) / 72);
}

function estimateDisplayMathHeight(latex, fontSize, width) {
  const source = String(latex || "");
  const normalized = source.replace(/\s+/g, " ").trim();
  const explicitRows = Math.max(1, (source.match(/\\\\/g) || []).length + 1);
  const widthRows = Math.max(1, Math.ceil(normalized.length / Math.max(55, width * 11)));
  const structuralRows = explicitRows + (source.match(/\\begin\{cases\}/g) || []).length;
  const rows = Math.max(structuralRows, widthRows);
  let complexity = 1;
  complexity += Math.min(0.5, ((source.match(/\\frac/g) || []).length * 0.055));
  complexity += Math.min(0.35, ((source.match(/\\sum|\\prod/g) || []).length * 0.07));
  complexity += Math.min(0.25, ((source.match(/\\left|\\right/g) || []).length * 0.018));
  complexity += source.indexOf("\\begin{aligned}") !== -1 ? 0.12 : 0;
  const base = (rows * fontSize * 1.72 * complexity) / 72;
  return Math.max(0.62, base + 0.24);
}

function parseStyle(styleText) {
  const style = {};
  String(styleText || "")
    .split(";")
    .forEach((entry) => {
      const separator = entry.indexOf(":") === -1 ? entry.indexOf("=") : entry.indexOf(":");
      if (separator === -1) {
        return;
      }
      const key = entry.slice(0, separator).trim().toLowerCase();
      const value = entry.slice(separator + 1).trim();
      if (key) {
        style[key] = value;
      }
    });
  return style;
}

function getDirection(styleText, dirAttr) {
  if (dirAttr === "rtl" || dirAttr === "ltr") {
    return dirAttr;
  }
  const style = parseStyle(styleText);
  const direction = (style.direction || "").replace(/['"]/g, "").toLowerCase();
  return direction === "rtl" || direction === "ltr" ? direction : "";
}

function cssColorToHex(color) {
  if (!color) return "";
  const raw = String(color).trim();
  if (raw[0] === "#") {
    return raw.slice(1).substring(0, 6).toUpperCase();
  }
  const named = {
    red: "FF0000",
    green: "008000",
    blue: "0000FF",
    white: "FFFFFF",
    black: "000000",
  };
  return named[raw.toLowerCase()] || "";
}

function pxToInches(px) {
  return (Number(px) / SOURCE_W) * SLIDE_W;
}

function attrPx(value) {
  if (!value) return 0;
  const match = String(value).match(/([0-9.]+)/);
  return match ? Number(match[1]) : 0;
}

function maxWidthToInches(value, fallback) {
  if (!value) return fallback;
  const raw = String(value).trim();
  if (raw.endsWith("%")) {
    return fallback * (Number(raw.slice(0, -1)) / 100);
  }
  const px = attrPx(raw);
  return px ? Math.min(fallback, pxToInches(px)) : fallback;
}

function maxHeightToInches(value, fallback) {
  if (!value) return fallback;
  const raw = String(value).trim();
  if (raw.endsWith("%")) {
    return fallback * (Number(raw.slice(0, -1)) / 100);
  }
  const px = attrPx(raw);
  return px ? Math.min(fallback, (px / SOURCE_H) * SLIDE_H) : fallback;
}

function shapeType(pptx, name) {
  if (pptx.ShapeType && pptx.ShapeType[name]) {
    return pptx.ShapeType[name];
  }
  return name;
}

async function writePptx(pptx, outputPath) {
  const result = pptx.writeFile({ fileName: outputPath });
  if (result && typeof result.then === "function") {
    await result;
  }
}

async function convertMathItems(mathItems, pandocBin, tmpDir) {
  const byLatex = {};
  const byToken = {};
  for (let i = 0; i < mathItems.length; i += 1) {
    const item = mathItems[i];
    const key = `${item.display ? "display" : "inline"}:${item.latex}`;
    if (!byLatex[key]) {
      byLatex[key] = await convertLatexToOmml(item, pandocBin, tmpDir);
    }
    byToken[item.token] = byLatex[key];
  }
  return byToken;
}

async function convertLatexToOmml(item, pandocBin, tmpDir) {
  const base = `math-${item.id}`;
  const mdPath = path.join(tmpDir, `${base}.md`);
  const docxPath = path.join(tmpDir, `${base}.docx`);
  const pandocLatex = normalizeLatexForPandoc(item.latex, item.display);
  const body = item.display ? `$$\n${pandocLatex}\n$$\n` : `$${pandocLatex}$\n`;
  fs.writeFileSync(mdPath, body, "utf8");
  const result = spawnSync(pandocBin, [
    mdPath,
    "-f",
    "markdown+tex_math_dollars",
    "-t",
    "docx",
    "-o",
    docxPath,
  ], { encoding: "utf8" });
  if (result.error || result.status !== 0) {
    throw new Error(`Pandoc could not convert equation "${item.latex}": ${(result.stderr || result.error || "").toString().trim()}`);
  }

  let documentXml;
  try {
    const zip = await JSZip.loadAsync(fs.readFileSync(docxPath));
    documentXml = await zip.file("word/document.xml").async("string");
  } catch (error) {
    throw new Error(`Could not read Pandoc DOCX for equation "${item.latex}".`);
  }
  const omml = extractOmml(documentXml);
  if (!omml) {
    throw new Error(`Pandoc produced no editable Office math for equation "${item.latex}".`);
  }
  return omml;
}

function extractOmml(documentXml) {
  const parser = new DOMParser();
  const serializer = new XMLSerializer();
  const doc = parser.parseFromString(documentXml, "application/xml");
  const nodes = elementsByLocalName(doc, "oMath");
  if (!nodes.length) {
    return "";
  }
  const node = nodes[0].cloneNode(true);
  let xml = serializer.serializeToString(node);
  if (xml.indexOf("xmlns:m=") === -1) {
    node.setAttribute("xmlns:m", OMML_NS);
  }
  xml = serializer.serializeToString(node);
  if (xml.indexOf("xmlns:w=") === -1) {
    node.setAttribute("xmlns:w", WORD_NS);
  }
  return serializer.serializeToString(node);
}

async function patchPresentationXml(outputPath, ommlByToken, animationPlan) {
  const tokens = Object.keys(ommlByToken);
  const zip = await JSZip.loadAsync(fs.readFileSync(outputPath));
  const slideNames = Object.keys(zip.files)
    .filter((name) => name.match(/^ppt\/slides\/slide\d+\.xml$/))
    .sort((a, b) => slideNumberFromPath(a) - slideNumberFromPath(b));
  const parser = new DOMParser();
  const serializer = new XMLSerializer();
  let replacements = 0;
  const replacedTokens = new Set();
  let rtlParagraphs = 0;

  for (let i = 0; i < slideNames.length; i += 1) {
    const name = slideNames[i];
    const xml = await zip.file(name).async("string");
    const doc = parser.parseFromString(xml, "application/xml");
    ensureNamespace(doc.documentElement, "a14", A14_NS);

    const textNodes = elementsByLocalName(doc, "t");
    for (let j = 0; j < textNodes.length; j += 1) {
      const token = textNodes[j].textContent;
      if (!ommlByToken[token]) {
        continue;
      }
      const run = ancestorByLocalName(textNodes[j], "r");
      if (!run || !run.parentNode) {
        continue;
      }
      const mathNode = doc.createElementNS(A14_NS, "a14:m");
      const ommlDoc = parser.parseFromString(ommlByToken[token], "application/xml");
      const imported = doc.importNode
        ? doc.importNode(ommlDoc.documentElement, true)
        : ommlDoc.documentElement.cloneNode(true);
      mathNode.appendChild(imported);
      run.parentNode.replaceChild(mathNode, run);
      replacements += 1;
      replacedTokens.add(token);
    }

    rtlParagraphs += normalizeHebrewParagraphs(doc);
    normalizeDuplicateParagraphProperties(doc);
    injectFragmentAnimations(doc, animationPlan[i] || []);
    normalizeOfficeMathForDrawing(doc);
    wrapOfficeMathShapes(doc);
    normalizeTableCellAnchors(doc);
    zip.file(name, serializer.serializeToString(doc));
  }

  const missingTokens = tokens.filter((token) => !replacedTokens.has(token));
  if (missingTokens.length) {
    throw new Error(`Expected to replace ${tokens.length} equation placeholder token(s), but ${missingTokens.length} were not found.`);
  }
  await sanitizePackageParts(zip);
  const buffer = await zip.generateAsync({ type: "nodebuffer" });
  fs.writeFileSync(outputPath, buffer);
}

async function sanitizePackageParts(zip) {
  await removeMissingContentTypeOverrides(zip);
  await normalizePresentationPackageXml(zip);
}

async function removeMissingContentTypeOverrides(zip) {
  const contentTypes = zip.file("[Content_Types].xml");
  if (!contentTypes) {
    throw new Error("PPTX package is missing [Content_Types].xml.");
  }

  const parser = new DOMParser();
  const serializer = new XMLSerializer();
  const doc = parser.parseFromString(await contentTypes.async("string"), "application/xml");
  const overrides = elementsByLocalName(doc, "Override");
  let removed = 0;

  overrides.forEach((override) => {
    const partName = override.getAttribute("PartName") || "";
    const zipName = partName.replace(/^\//, "");
    if (zipName && !zip.files[zipName] && override.parentNode) {
      override.parentNode.removeChild(override);
      removed += 1;
    }
  });

  if (removed) {
    zip.file("[Content_Types].xml", serializer.serializeToString(doc));
  }
}

async function normalizePresentationPackageXml(zip) {
  const presentation = zip.file("ppt/presentation.xml");
  if (!presentation) {
    return;
  }

  const parser = new DOMParser();
  const serializer = new XMLSerializer();
  const doc = parser.parseFromString(await presentation.async("string"), "application/xml");
  const root = doc.documentElement;
  const notesMasterIds = firstChildByLocalName(root, "notesMasterIdLst");
  const slideIds = firstChildByLocalName(root, "sldIdLst");

  if (notesMasterIds && slideIds && !isBeforeSibling(notesMasterIds, slideIds)) {
    root.removeChild(notesMasterIds);
    root.insertBefore(notesMasterIds, slideIds);
    zip.file("ppt/presentation.xml", serializer.serializeToString(doc));
  }
}

function isBeforeSibling(a, b) {
  for (let current = a; current; current = current.nextSibling) {
    if (current === b) {
      return true;
    }
  }
  return false;
}

function normalizeTableCellAnchors(doc) {
  elementsByLocalName(doc, "tcPr")
    .filter((properties) => properties.namespaceURI === DRAWING_NS)
    .forEach((properties) => {
      if (properties.getAttribute("anchor") === "mid") {
        properties.setAttribute("anchor", "ctr");
      }
    });
}

function normalizeOfficeMathForDrawing(doc) {
  elementsByLocalName(doc, "m")
    .filter(isOfficeMathExtensionElement)
    .forEach((mathNode) => {
      elementsByLocalName(mathNode, "r")
        .filter((run) => run.namespaceURI === OMML_NS)
        .forEach((run) => normalizeOfficeMathRun(doc, run));
      elementsByLocalName(mathNode, "ctrlPr")
        .filter((properties) => properties.namespaceURI === OMML_NS)
        .forEach((properties) => ensureDrawingRunProperties(doc, properties));
    });
}

function normalizeOfficeMathRun(doc, run) {
  directChildrenByNamespaceLocalName(run, OMML_NS, "rPr").forEach((properties) => {
    properties.removeAttribute("lang");
    properties.removeAttribute("altLang");
  });
  ensureDrawingRunProperties(doc, run);
}

function ensureDrawingRunProperties(doc, node) {
  if (directChildrenByNamespaceLocalName(node, DRAWING_NS, "rPr").length) {
    return;
  }
  const properties = createDrawingMathRunProperties(doc);
  const mathProperties = directChildrenByNamespaceLocalName(node, OMML_NS, "rPr");
  const lastMathProperties = mathProperties[mathProperties.length - 1];
  node.insertBefore(properties, lastMathProperties ? lastMathProperties.nextSibling : node.firstChild);
}

function createDrawingMathRunProperties(doc) {
  const properties = doc.createElementNS(DRAWING_NS, "a:rPr");
  const latin = doc.createElementNS(DRAWING_NS, "a:latin");
  latin.setAttribute("typeface", "Cambria Math");
  latin.setAttribute("panose", "02040503050406030204");
  latin.setAttribute("pitchFamily", "18");
  latin.setAttribute("charset", "0");
  properties.appendChild(latin);
  return properties;
}

function wrapOfficeMathShapes(doc) {
  const shapes = elementsByLocalName(doc, "sp")
    .concat(elementsByLocalName(doc, "graphicFrame"))
    .filter((shape) => directChildByLocalName(shape.parentNode, "spTree"))
    .filter((shape) => elementsByLocalName(shape, "m").some(isOfficeMathExtensionElement))
    .filter((shape) => !ancestorByLocalName(shape, "AlternateContent"));

  shapes.forEach((shape) => {
    const parent = shape.parentNode;
    if (!parent) {
      return;
    }

    const fallbackShape = shape.cloneNode(true);
    replaceOfficeMathWithFallbackRuns(doc, fallbackShape);

    const alternate = doc.createElementNS(MARKUP_COMPAT_NS, "mc:AlternateContent");
    const choice = doc.createElementNS(MARKUP_COMPAT_NS, "mc:Choice");
    const fallback = doc.createElementNS(MARKUP_COMPAT_NS, "mc:Fallback");
    choice.setAttribute("Requires", "a14");
    choice.setAttribute("xmlns:a14", A14_NS);

    parent.replaceChild(alternate, shape);
    alternate.appendChild(choice);
    alternate.appendChild(fallback);
    choice.appendChild(shape);
    fallback.appendChild(fallbackShape);
  });
}

function replaceOfficeMathWithFallbackRuns(doc, node) {
  elementsByLocalName(node, "m")
    .filter(isOfficeMathExtensionElement)
    .forEach((mathNode) => {
      if (mathNode.parentNode) {
        mathNode.parentNode.replaceChild(createFallbackMathRun(doc, mathNode.textContent), mathNode);
      }
    });
}

function createFallbackMathRun(doc, text) {
  const run = doc.createElementNS(DRAWING_NS, "a:r");
  const runProperties = doc.createElementNS(DRAWING_NS, "a:rPr");
  const latin = doc.createElementNS(DRAWING_NS, "a:latin");
  const textNode = doc.createElementNS(DRAWING_NS, "a:t");
  runProperties.setAttribute("lang", "en-US");
  latin.setAttribute("typeface", "Cambria Math");
  textNode.appendChild(doc.createTextNode(normalizeText(text).trim()));
  runProperties.appendChild(latin);
  run.appendChild(runProperties);
  run.appendChild(textNode);
  return run;
}

function isOfficeMathExtensionElement(node) {
  return node && node.namespaceURI === A14_NS && (node.localName === "m" || node.nodeName.endsWith(":m"));
}

function normalizeDuplicateParagraphProperties(doc) {
  const paragraphs = elementsByLocalName(doc, "p");
  paragraphs.forEach((paragraph) => {
    let firstPPr = null;
    const duplicates = [];
    for (let child = paragraph.firstChild; child; child = child.nextSibling) {
      if (child.localName === "pPr" || child.nodeName === "a:pPr") {
        if (!firstPPr) {
          firstPPr = child;
        } else {
          duplicates.push(child);
        }
      }
    }
    duplicates.forEach((node) => paragraph.removeChild(node));
  });
}

function injectFragmentAnimations(doc, targets) {
  const validTargets = targets
    .map((target) => Object.assign({}, target, { shapeId: shapeIdForObjectName(doc, target.objectName) }))
    .filter((target) => target.shapeId);
  if (!validTargets.length) {
    return;
  }

  elementsByLocalName(doc, "timing").forEach((node) => {
    if (node.parentNode) {
      node.parentNode.removeChild(node);
    }
  });

  const grouped = groupAnimationTargets(validTargets);
  const timingDoc = new DOMParser().parseFromString(buildTimingXml(grouped), "application/xml");
  const timing = doc.importNode
    ? doc.importNode(timingDoc.documentElement, true)
    : timingDoc.documentElement.cloneNode(true);
  const extLst = firstChildByLocalName(doc.documentElement, "extLst");
  doc.documentElement.insertBefore(timing, extLst || null);
}

function shapeIdForObjectName(doc, objectName) {
  if (!objectName) {
    return "";
  }
  const props = elementsByLocalName(doc, "cNvPr");
  for (let i = 0; i < props.length; i += 1) {
    if (props[i].getAttribute("name") === objectName) {
      return props[i].getAttribute("id") || "";
    }
  }
  return "";
}

function groupAnimationTargets(targets) {
  const sorted = targets.slice().sort((a, b) => {
    if (a.order !== b.order) return a.order - b.order;
    if (a.sourceOrder !== b.sourceOrder) return a.sourceOrder - b.sourceOrder;
    return String(a.objectName).localeCompare(String(b.objectName));
  });
  const groups = [];
  sorted.forEach((target) => {
    const last = groups[groups.length - 1];
    if (last && last.order === target.order) {
      last.targets.push(target);
    } else {
      groups.push({ order: target.order, targets: [target] });
    }
  });
  return groups;
}

function buildTimingXml(groups) {
  let id = 1;
  const nextId = () => id++;
  const rootId = nextId();
  const mainSeqId = nextId();
  const groupXml = groups.map((group) => {
    const clickId = nextId();
    const effectXml = group.targets.map((target) => {
      const effectId = nextId();
      const behaviorId = nextId();
      const transition = target.effect === "exit" ? "out" : "in";
      return [
        `<p:par><p:cTn id="${effectId}" presetID="1" presetClass="${target.effect === "exit" ? "exit" : "entr"}" presetSubtype="0" fill="hold" nodeType="clickEffect">`,
        "<p:stCondLst><p:cond delay=\"0\"/></p:stCondLst>",
        "<p:childTnLst>",
        `<p:animEffect transition="${transition}" filter="fade">`,
        "<p:cBhvr>",
        `<p:cTn id="${behaviorId}" dur="500" fill="hold"/>`,
        targetElementXml(target),
        "</p:cBhvr>",
        "</p:animEffect>",
        "</p:childTnLst>",
        "</p:cTn></p:par>",
      ].join("");
    }).join("");
    return [
      `<p:par><p:cTn id="${clickId}" fill="hold">`,
      "<p:stCondLst><p:cond delay=\"indefinite\"/></p:stCondLst>",
      `<p:childTnLst>${effectXml}</p:childTnLst>`,
      "</p:cTn></p:par>",
    ].join("");
  }).join("");
  const buildList = buildAnimationBuildList(groups);
  return [
    `<p:timing xmlns:p="${PRESENTATION_NS}">`,
    "<p:tnLst>",
    `<p:par><p:cTn id="${rootId}" dur="indefinite" restart="never" nodeType="tmRoot">`,
    "<p:childTnLst>",
    "<p:seq concurrent=\"1\" nextAc=\"seek\">",
    `<p:cTn id="${mainSeqId}" dur="indefinite" nodeType="mainSeq">`,
    `<p:childTnLst>${groupXml}</p:childTnLst>`,
    "</p:cTn>",
    "</p:seq>",
    "</p:childTnLst>",
    "</p:cTn></p:par>",
    "</p:tnLst>",
    buildList,
    "</p:timing>",
  ].join("");
}

function targetElementXml(target) {
  const textRange = target.paragraphIndex == null
    ? ""
    : `<p:txEl><p:pRg st="${target.paragraphIndex}" end="${target.paragraphIndex}"/></p:txEl>`;
  return `<p:tgtEl><p:spTgt spid="${target.shapeId}">${textRange}</p:spTgt></p:tgtEl>`;
}

function buildAnimationBuildList(groups) {
  const byShape = {};
  groups.forEach((group) => {
    group.targets.forEach((target) => {
      if (target.paragraphIndex != null) {
        byShape[target.shapeId] = true;
      }
    });
  });
  const entries = Object.keys(byShape).map((shapeId) => `<p:bldP spid="${shapeId}" grpId="0" build="p"/>`);
  return entries.length ? `<p:bldLst>${entries.join("")}</p:bldLst>` : "";
}

function normalizeHebrewParagraphs(doc) {
  const paragraphs = elementsByLocalName(doc, "p");
  let count = 0;
  paragraphs.forEach((paragraph) => {
    if (!containsHebrew(paragraph.textContent || "")) {
      return;
    }
    const pPr = ensureParagraphProperties(doc, paragraph);
    pPr.setAttribute("rtl", "1");
    if (pPr.getAttribute("algn") !== "ctr") {
      pPr.setAttribute("algn", "r");
    }
    setRunLanguages(paragraph, "he-IL");
    count += 1;
  });
  return count;
}

function ensureParagraphProperties(doc, paragraph) {
  for (let child = paragraph.firstChild; child; child = child.nextSibling) {
    if (child.localName === "pPr" || child.nodeName === "a:pPr") {
      return child;
    }
  }
  const pPr = doc.createElementNS("http://schemas.openxmlformats.org/drawingml/2006/main", "a:pPr");
  paragraph.insertBefore(pPr, paragraph.firstChild || null);
  return pPr;
}

function setRunLanguages(paragraph, lang) {
  const runProperties = elementsByLocalName(paragraph, "rPr")
    .concat(elementsByLocalName(paragraph, "endParaRPr"));
  runProperties.forEach((rPr) => {
    rPr.setAttribute("lang", lang);
    rPr.setAttribute("altLang", "en-US");
  });
}

function containsHebrew(text) {
  return /[\u0590-\u05ff]/.test(text);
}

function ensureNamespace(root, prefix, uri) {
  const attr = `xmlns:${prefix}`;
  if (!root.getAttribute(attr)) {
    root.setAttribute(attr, uri);
  }
}

function elementsByLocalName(node, localName) {
  const results = [];
  function visit(current) {
    if (!current) return;
    if (current.localName === localName || current.nodeName === localName || current.nodeName.endsWith(`:${localName}`)) {
      results.push(current);
    }
    for (let child = current.firstChild; child; child = child.nextSibling) {
      visit(child);
    }
  }
  visit(node);
  return results;
}

function ancestorByLocalName(node, localName) {
  let current = node.parentNode;
  while (current) {
    if (current.localName === localName || current.nodeName === localName || current.nodeName.endsWith(`:${localName}`)) {
      return current;
    }
    current = current.parentNode;
  }
  return null;
}

function firstChildByLocalName(node, localName) {
  for (let child = node.firstChild; child; child = child.nextSibling) {
    if (child.localName === localName || child.nodeName === localName || child.nodeName.endsWith(`:${localName}`)) {
      return child;
    }
  }
  return null;
}

function directChildByLocalName(node, localName) {
  return Boolean(node && (node.localName === localName || node.nodeName === localName || node.nodeName.endsWith(`:${localName}`)));
}

function directChildrenByNamespaceLocalName(node, namespaceURI, localName) {
  const results = [];
  for (let child = node.firstChild; child; child = child.nextSibling) {
    if (child.namespaceURI === namespaceURI && child.localName === localName) {
      results.push(child);
    }
  }
  return results;
}

function slideNumberFromPath(name) {
  const match = String(name).match(/slide(\d+)\.xml$/);
  return match ? Number(match[1]) : 0;
}

main();
