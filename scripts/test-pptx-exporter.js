#!/usr/bin/env node

const assert = require("assert");
const fs = require("fs");
const os = require("os");
const path = require("path");

const JSZip = require("jszip");

const { parseDeckModelFromFile } = require("./pptx-exporter/model");
const { planSlides } = require("./pptx-exporter/layout");
const { normalizeLatexForPandoc } = require("./pptx-exporter/math");
const { verifyZipPackage } = require("./pptx-exporter/verifier-core");

async function run() {
  await testParseDeckModelCapturesBlocksMathDirectionAndFragments();
  testLayoutSplitsDenseSlidesWithoutShrinkingBelowReadableFloors();
  testBareMultilineDisplayMathIsWrappedForPandoc();
  await testVerifierRejectsRepairTriggeringPackageAndSchemaIssues();
  console.log("pptx exporter tests passed");
}

function testBareMultilineDisplayMathIsWrappedForPandoc() {
  const latex = [
    "\\sum_{k=1}^K\\sum_{i\\in\\mathcal{I}_k}\\lVert\\boldsymbol{x}^{(j)}-\\boldsymbol{\\mu}^{(i)}\\rVert_2^2",
    "=n\\left(-6-6\\frac{\\alpha-1}{\\alpha+1}\\right)^2 + \\alpha n\\left(6-6\\frac{\\alpha-1}{\\alpha+1}\\right)^2 \\\\=n\\cdot \\frac{36}{\\left(\\alpha+1\\right)^2}\\left(4\\alpha^2+4\\alpha\\right)\\\\=\\frac{144\\alpha n}{\\alpha+1}",
  ].join("\n");

  const normalized = normalizeLatexForPandoc(latex, true);

  assert.ok(normalized.startsWith("\\begin{aligned}"), "bare multiline display math should be wrapped in aligned");
  assert.ok(normalized.includes("&=n\\left"), "first equality should receive an alignment marker");
  assert.ok(normalized.includes("\\\\\n&=n\\cdot"), "linebreak equality should receive an alignment marker");
  assert.ok(normalized.endsWith("\\end{aligned}"), "aligned wrapper should be closed");
}

async function testParseDeckModelCapturesBlocksMathDirectionAndFragments() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "pptx-model-test-"));
  const input = path.join(dir, "slides.md");
  fs.writeFileSync(input, [
    "---",
    "title: Test Deck",
    "---",
    '<div class="slides site-style" style="direction:rtl">',
    "<section>",
    "## כותרת",
    "",
    '<div dir="ltr"><a href="/assets/example.pdf" class="link-button" target="_blank">PDF</a></div>',
    "",
    "- פריט עם $\\alpha_1$",
    '- <span dir="ltr">English island</span>',
    "",
    '<div class="fragment">$$',
    "\\sum_i x_i",
    "$$</div>",
    '<div class="fragment" data-fragment-index="2">טקסט מופיע בלחיצה</div>',
    "</section>",
    "</div>",
  ].join("\n"));

  const model = parseDeckModelFromFile(input);

  assert.strictEqual(model.title, "Test Deck");
  assert.strictEqual(model.slides.length, 1);
  assert.strictEqual(model.slides[0].dir, "rtl");
  assert.deepStrictEqual(model.slides[0].blocks.map((block) => block.type), ["heading", "list", "math", "paragraph"]);
  assert.ok(!model.slides[0].blocks.some((block) => block.text === "PDF"), "link-button PDF navigation must not become slide content");
  assert.strictEqual(model.mathItems.length, 2);
  assert.strictEqual(model.mathItems[0].display, false);
  assert.strictEqual(model.mathItems[1].display, true);
  assert.strictEqual(model.slides[0].blocks[2].fragment.effect, "entrance");
  assert.strictEqual(model.slides[0].blocks[3].fragment.order, 2);
  assert.strictEqual(model.slides[0].blocks[1].items[1].runs[0].dir, "ltr");
}

function testLayoutSplitsDenseSlidesWithoutShrinkingBelowReadableFloors() {
  const denseBlocks = [{ type: "heading", level: 2, text: "Dense Slide", runs: [{ text: "Dense Slide" }] }];
  for (let i = 0; i < 26; i += 1) {
    denseBlocks.push({
      type: "paragraph",
      runs: [{ text: `Long readable paragraph ${i + 1} with enough words to require real vertical space.` }],
    });
  }

  const planned = planSlides([{ sourceIndex: 0, dir: "ltr", blocks: denseBlocks }], { splitDenseSlides: true });

  assert.ok(planned.length > 1, "dense source slide should split into continuation slides");
  planned.forEach((slide) => {
    slide.blocks.forEach((block) => {
      if (block.type === "paragraph") {
        assert.ok(block.layout.fontSize >= 14, `paragraph font too small: ${block.layout.fontSize}`);
      }
      if (block.type === "list") {
        assert.ok(block.layout.fontSize >= 14, `list font too small: ${block.layout.fontSize}`);
        assert.ok(block.layout.nestedFontSize >= 12, `nested list font too small: ${block.layout.nestedFontSize}`);
      }
    });
  });
  assert.ok(planned.slice(1).every((slide) => /continued/.test(slide.continuationLabel)), "continuation slides should be labeled");
}

async function testVerifierRejectsRepairTriggeringPackageAndSchemaIssues() {
  const zip = new JSZip();
  zip.file("[Content_Types].xml", [
    '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">',
    '<Override PartName="/ppt/presentation.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.presentation.main+xml"/>',
    '<Override PartName="/ppt/slideMasters/slideMaster99.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slideMaster+xml"/>',
    "</Types>",
  ].join(""));
  zip.file("ppt/presentation.xml", [
    '<p:presentation xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main">',
    "<p:sldIdLst/>",
    "<p:notesMasterIdLst/>",
    "</p:presentation>",
  ].join(""));
  zip.file("ppt/slides/slide1.xml", [
    '<p:sld xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main" xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:a14="http://schemas.microsoft.com/office/drawing/2010/main">',
    "<p:cSld><p:spTree>",
    "<p:sp><p:nvSpPr><p:cNvPr id=\"2\" name=\"Math\"/></p:nvSpPr><p:txBody><a:p><a14:m/></a:p></p:txBody></p:sp>",
    "<p:graphicFrame><a:tbl><a:tr><a:tc><a:tcPr anchor=\"mid\"/></a:tc></a:tr></a:tbl></p:graphicFrame>",
    "</p:spTree></p:cSld>",
    "</p:sld>",
  ].join(""));

  const failures = await verifyZipPackage(zip, { noMathPlaceholders: true });

  assert.ok(failures.some((failure) => failure.includes("slideMaster99.xml")), "missing content type target should fail");
  assert.ok(failures.some((failure) => failure.includes("notesMasterIdLst")), "presentation child order should fail");
  assert.ok(failures.some((failure) => failure.includes("invalid anchor")), "invalid table anchor should fail");
  assert.ok(failures.some((failure) => failure.includes("outside mc:AlternateContent")), "unwrapped math should fail");
}

run().catch((error) => {
  console.error(error.stack || error.message);
  process.exitCode = 1;
});
