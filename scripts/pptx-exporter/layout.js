const SLIDE_H = 8.125;
const CONTENT_TOP = 0.48;
const CONTENT_BOTTOM = SLIDE_H - 0.55;
const AVAILABLE_H = CONTENT_BOTTOM - CONTENT_TOP;

const DEFAULTS = {
  splitDenseSlides: true,
  minBodyFont: 14,
  minNestedFont: 12,
  minCodeFont: 12,
  minTableFont: 12,
  headingFonts: { 1: 30, 2: 25, 3: 21, 4: 18, 5: 15, 6: 14 },
};

function planSlides(slides, options = {}) {
  const config = Object.assign({}, DEFAULTS, options);
  return slides.flatMap((slide) => planSingleSlide(slide, config));
}

function planSingleSlide(slide, config) {
  const plannedBlocks = slide.blocks.map((block) => attachLayout(block, config));
  if (!config.splitDenseSlides || totalHeight(plannedBlocks) <= AVAILABLE_H) {
    return [plannedSlide(slide, plannedBlocks, 0, 1)];
  }

  const title = leadingHeading(plannedBlocks);
  const chunks = [];
  let current = [];
  let currentHeight = 0;
  const bodyBlocks = title ? plannedBlocks.slice(1) : plannedBlocks;
  const titleHeight = title ? title.layout.totalHeight : 0;

  bodyBlocks.forEach((block) => {
    const reservedTitleHeight = chunks.length || current.length ? titleHeight : 0;
    const blockHeight = block.layout.totalHeight;
    if (current.length && currentHeight + reservedTitleHeight + blockHeight > AVAILABLE_H) {
      chunks.push(current);
      current = [];
      currentHeight = 0;
    }
    current.push(block);
    currentHeight += blockHeight;
  });
  if (current.length) chunks.push(current);

  return chunks.map((chunk, index) => {
    const blocks = index === 0 || !title
      ? (title ? [title].concat(chunk) : chunk)
      : [continuationHeading(title, index + 1)].concat(chunk);
    return plannedSlide(slide, blocks, index, chunks.length);
  });
}

function attachLayout(block, config) {
  const copy = Object.assign({}, block);
  if (block.type === "heading") {
    const fontSize = config.headingFonts[block.level] || 18;
    copy.layout = { fontSize, height: estimateTextHeight(block.text, fontSize, 8.65, 1.18), totalHeight: Math.max(0.42, estimateTextHeight(block.text, fontSize, 8.65, 1.18)) + 0.12 };
  } else if (block.type === "paragraph") {
    const fontSize = config.minBodyFont;
    copy.layout = { fontSize, height: estimateTextHeight(blockText(block), fontSize, 8.45, 1.22), totalHeight: estimateTextHeight(blockText(block), fontSize, 8.45, 1.22) + 0.13 };
  } else if (block.type === "list") {
    const fontSize = config.minBodyFont;
    const nestedFontSize = config.minNestedFont;
    const text = (block.items || []).map((item) => item.text).join("\n");
    const itemGap = Math.max(0.06, (block.items || []).length * 0.055);
    copy.layout = {
      fontSize,
      nestedFontSize,
      height: estimateTextHeight(text, fontSize, 8.35, 1.22) + itemGap,
      totalHeight: estimateTextHeight(text, fontSize, 8.35, 1.22) + itemGap + 0.15,
    };
  } else if (block.type === "math") {
    const fontSize = 18;
    const latexLength = String(block.latex || block.text || "").length;
    const height = Math.max(0.48, latexLength > 120 ? 1.15 : 0.72);
    copy.layout = { fontSize, height, totalHeight: height + 0.18 };
  } else if (block.type === "table") {
    const fontSize = config.minTableFont;
    const rows = Math.max(1, (block.rows || []).length);
    const height = Math.min(4.4, rows * 0.38 + 0.16);
    copy.layout = { fontSize, height, totalHeight: height + 0.18 };
  } else if (block.type === "code") {
    const fontSize = config.minCodeFont;
    const height = Math.min(2.9, Math.max(0.52, estimateTextHeight(block.text, fontSize, 8.45, 1.1)));
    copy.layout = { fontSize, height, totalHeight: height + 0.17 };
  } else if (block.type === "image") {
    copy.layout = { height: 2.8, totalHeight: 3.05 };
  } else {
    copy.layout = { fontSize: config.minBodyFont, height: 0.35, totalHeight: 0.45 };
  }
  return copy;
}

function plannedSlide(sourceSlide, blocks, continuationIndex, continuationCount) {
  const continuationLabel = continuationCount > 1
    ? `continued ${continuationIndex + 1}/${continuationCount}`
    : "";
  return {
    sourceIndex: sourceSlide.sourceIndex,
    dir: sourceSlide.dir,
    classes: sourceSlide.classes || [],
    blocks,
    continuationIndex,
    continuationCount,
    continuationLabel,
  };
}

function continuationHeading(title, continuationNumber) {
  const copy = Object.assign({}, title);
  copy.text = `${title.text} (continued ${continuationNumber})`;
  copy.runs = [{ text: copy.text, dir: title.dir }];
  copy.continuation = true;
  copy.layout = Object.assign({}, title.layout);
  return copy;
}

function leadingHeading(blocks) {
  return blocks.length && blocks[0].type === "heading" ? blocks[0] : null;
}

function totalHeight(blocks) {
  return blocks.reduce((sum, block) => sum + block.layout.totalHeight, 0);
}

function blockText(block) {
  return block.text || (block.runs || []).map((run) => run.text).join("");
}

function estimateTextHeight(text, fontSize, width, lineHeight) {
  const effectiveWidth = Math.max(1, width || 8);
  const charsPerLine = Math.max(14, Math.floor(effectiveWidth * (112 / Math.max(fontSize, 1))));
  const normalized = String(text || "").split(/\n/);
  const lines = normalized.reduce((sum, line) => sum + Math.max(1, Math.ceil(line.length / charsPerLine)), 0);
  return Math.max(0.2, (lines * fontSize * (lineHeight || 1.18)) / 72);
}

module.exports = {
  AVAILABLE_H,
  DEFAULTS,
  estimateTextHeight,
  planSlides,
};
