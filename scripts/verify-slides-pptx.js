#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const { verifyPptxFile } = require("./pptx-exporter/verifier-core");

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (!args.pptx) {
    throw new Error("--pptx is required.");
  }

  const pptxPath = path.resolve(process.cwd(), args.pptx);
  if (!fs.existsSync(pptxPath)) {
    throw new Error(`PPTX does not exist: ${pptxPath}`);
  }

  const failures = await verifyPptxFile(pptxPath, args);
  if (failures.length) {
    console.error(failures.join("\n"));
    process.exitCode = 1;
    return;
  }

  console.log(`Verified ${pptxPath}`);
}

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--pptx") {
      args.pptx = argv[++i];
    } else if (arg === "--expected-slides") {
      args.expectedSlides = Number(argv[++i]);
    } else if (arg === "--min-bullet-paragraphs-in-body") {
      args.minBulletParagraphsInBody = Number(argv[++i]);
    } else if (arg === "--slide") {
      args.slide = Number(argv[++i]);
    } else if (arg === "--max-objects-same-y") {
      args.maxObjectsSameY = Number(argv[++i]);
    } else if (arg === "--max-overlap-emu") {
      args.maxOverlapEmu = Number(argv[++i]);
    } else if (arg === "--min-math-height-emu") {
      args.minMathHeightEmu = Number(argv[++i]);
    } else if (arg === "--max-bottom-overflow-emu") {
      args.maxBottomOverflowEmu = Number(argv[++i]);
    } else if (arg === "--require-timing") {
      args.requireTiming = true;
    } else if (arg === "--require-omml") {
      args.requireOmml = true;
    } else if (arg === "--require-hebrew-rtl") {
      args.requireHebrewRtl = true;
    } else if (arg === "--no-math-placeholders") {
      args.noMathPlaceholders = true;
    } else if (!arg.startsWith("-") && !args.pptx) {
      args.pptx = arg;
    } else if (!arg.startsWith("-") && args.expectedSlides == null) {
      args.expectedSlides = Number(arg);
    } else if (!arg.startsWith("-") && args.minBulletParagraphsInBody == null) {
      args.minBulletParagraphsInBody = Number(arg);
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }
  return args;
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
