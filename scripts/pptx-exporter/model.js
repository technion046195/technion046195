const fs = require("fs");

const matter = require("gray-matter");
const MarkdownIt = require("markdown-it");
const cheerio = require("cheerio");

const { getDirection, normalizeText } = require("./xml-utils");

const MATH_TOKEN_PREFIX = "PPTXMATH";
const MATH_TOKEN_SUFFIX = "TOKEN";

const md = new MarkdownIt({
  html: true,
  linkify: false,
  typographer: false,
});

function parseDeckModelFromFile(inputPath) {
  const raw = fs.readFileSync(inputPath, "utf8");
  return parseDeckModel(raw, { inputPath });
}

function parseDeckModel(raw, options = {}) {
  const parsed = matter(raw);
  const mathItems = [];
  const $source = cheerio.load(parsed.content, { decodeEntities: false }, false);
  const root = $source(".slides").first();
  if (!root.length) {
    throw new Error(`Could not find outer .slides container${options.inputPath ? ` in ${options.inputPath}` : ""}.`);
  }

  const defaultDir = getDirection(root.attr("style"), root.attr("dir")) || "rtl";
  const sourceSlides = [];
  root.children("section").each(function eachSection() {
    collectLeafSections($source, this, { dir: defaultDir, classes: [] }, sourceSlides);
  });

  return {
    title: parsed.data && parsed.data.title ? String(parsed.data.title) : titleFromSlides(sourceSlides),
    frontmatter: parsed.data || {},
    mathItems,
    slides: sourceSlides.map((slide, index) => parseSlide(slide, index, mathItems)),
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
    raw: $(section).html() || "",
    dir: current.dir || "rtl",
    classes: current.classes,
  });
}

function inheritSectionContext($, section, inherited) {
  const classes = inherited.classes.slice();
  ($(section).attr("class") || "").split(/\s+/).filter(Boolean).forEach((name) => {
    if (!classes.includes(name)) classes.push(name);
  });
  return {
    classes,
    dir: getDirection($(section).attr("style"), $(section).attr("dir")) || inherited.dir,
  };
}

function parseSlide(sourceSlide, sourceIndex, mathItems) {
  const rendered = renderMarkdownWithMathTokens(sourceSlide.raw, mathItems);
  const $ = cheerio.load(rendered, { decodeEntities: false }, false);
  annotateFragments($);
  const context = { dir: sourceSlide.dir || "rtl" };
  return {
    sourceIndex,
    dir: context.dir,
    classes: sourceSlide.classes,
    raw: sourceSlide.raw,
    html: rendered,
    blocks: $.root().contents().toArray().flatMap((node) => blockFromNode($, node, context)).filter(Boolean),
  };
}

function annotateFragments($) {
  $(".fragment").each((index, node) => {
    const rawIndex = $(node).attr("data-fragment-index");
    const parsedIndex = rawIndex == null || rawIndex === "" ? NaN : Number(rawIndex);
    $(node).attr("data-pptx-fragment-id", `frag${index + 1}`);
    $(node).attr("data-pptx-fragment-order", Number.isFinite(parsedIndex) ? String(parsedIndex) : String(index));
    $(node).attr("data-pptx-fragment-source-order", String(index));
    $(node).attr("data-pptx-fragment-effect", $(node).hasClass("fade-out") ? "exit" : "entrance");
  });
}

function blockFromNode($, node, context) {
  if (node.type === "text") {
    const text = normalizeText(node.data);
    return text ? [{ type: "paragraph", runs: [{ text, dir: context.dir }], text, dir: context.dir }] : [];
  }
  if (node.type !== "tag") {
    return [];
  }

  const scoped = contextForElement($, node, context);
  const name = node.name.toLowerCase();
  if (name.match(/^h[1-6]$/)) {
    const text = normalizeText($(node).text());
    return text ? [{ type: "heading", level: Number(name.substring(1)), runs: inlineRuns($, node, scoped), text, dir: scoped.dir, fragment: fragmentForNode($, node) }] : [];
  }
  if (name === "p") {
    if (containsOnlyLinkButton($, node)) {
      return [];
    }
    if (containsOnlyImage($, node)) {
      return imageBlocksFrom($, node, scoped);
    }
    if (isDisplayMathParagraph($, node)) {
      return [mathBlockFromNode($, node, scoped)];
    }
    const runs = inlineRuns($, node, scoped);
    return runs.length ? [{ type: "paragraph", runs, text: runs.map((run) => run.text).join(""), dir: scoped.dir, fragment: fragmentForNode($, node) }] : [];
  }
  if (name === "ul" || name === "ol") {
    const items = [];
    collectListItems($, node, scoped, name === "ol", 0, items);
    return items.length ? [{ type: "list", ordered: name === "ol", items, dir: scoped.dir, fragment: fragmentForNode($, node) }] : [];
  }
  if (name === "table") {
    return [{ type: "table", rows: tableRows($, node, scoped), dir: scoped.dir, fragment: fragmentForNode($, node) }];
  }
  if (name === "pre") {
    return [{ type: "code", text: $(node).text().replace(/\s+$/g, ""), dir: "ltr", fragment: fragmentForNode($, node) }];
  }
  if (name === "img") {
    return imageBlocksFrom($, node, scoped);
  }
  if (name === "div") {
    if (containsOnlyLinkButton($, node)) {
      return [];
    }
    if ($(node).hasClass("imgbox") || $(node).find("> p > img, > img").length) {
      return imageBlocksFrom($, node, scoped);
    }
    if (isDisplayMathContainer($, node) || isMathToken(normalizeText($(node).text()))) {
      return [mathBlockFromNode($, node, scoped)];
    }
    if (fragmentForNode($, node) && normalizeText($(node).text()) && !$(node).children().length) {
      const runs = inlineRuns($, node, scoped);
      return [{ type: "paragraph", runs, text: runs.map((run) => run.text).join(""), dir: scoped.dir, fragment: fragmentForNode($, node) }];
    }
  }

  return $(node).contents().toArray().flatMap((child) => blockFromNode($, child, scoped));
}

function collectListItems($, listNode, context, ordered, depth, items) {
  $(listNode).children("li").each((index, li) => {
    const itemContext = contextForElement($, li, context);
    const inlineChildren = $(li).contents().toArray().filter((child) => !(child.type === "tag" && ["ul", "ol"].includes(child.name.toLowerCase())));
    const runs = inlineChildren.flatMap((child) => inlineRunsFromNode($, child, itemContext));
    const text = normalizeText(runs.map((run) => run.text).join(""));
    if (text) {
      items.push({
        ordered,
        number: index + 1,
        depth,
        runs,
        text,
        dir: itemContext.dir,
        fragment: fragmentForNode($, li),
      });
    }
    $(li).children("ul,ol").each((_, nested) => {
      collectListItems($, nested, itemContext, nested.name.toLowerCase() === "ol", depth + 1, items);
    });
  });
}

function inlineRuns($, node, context) {
  return $(node).contents().toArray().flatMap((child) => inlineRunsFromNode($, child, context));
}

function inlineRunsFromNode($, node, context) {
  if (node.type === "text") {
    const text = normalizeText(node.data);
    return text ? [{ text, dir: context.dir }] : [];
  }
  if (node.type !== "tag") {
    return [];
  }
  const scoped = contextForElement($, node, context);
  const name = node.name.toLowerCase();
  if (name === "br") {
    return [{ text: "\n", dir: scoped.dir }];
  }
  const text = normalizeText($(node).text());
  if (isMathToken(text)) {
    return [{ text, dir: "ltr", math: true }];
  }
  if (["strong", "b", "em", "i", "code", "span", "a"].includes(name)) {
    return $(node).contents().toArray().flatMap((child) => inlineRunsFromNode($, child, scoped));
  }
  return text ? [{ text, dir: scoped.dir }] : [];
}

function containsOnlyLinkButton($, node) {
  if (!$(node).find("a.link-button").length && !(node.name && node.name.toLowerCase() === "a" && $(node).hasClass("link-button"))) {
    return false;
  }
  const textWithoutButtonLabels = normalizeText($(node).text()).replace(/\b(PDF|Code)\b/g, "").trim();
  return !textWithoutButtonLabels;
}

function contextForElement($, node, context) {
  return {
    dir: getDirection($(node).attr("style"), $(node).attr("dir")) || context.dir,
  };
}

function renderMarkdownWithMathTokens(input, mathItems) {
  return md.render(replaceMathWithTokens(input, mathItems));
}

function replaceMathWithTokens(input, mathItems) {
  let output = "";
  let i = 0;
  while (i < input.length) {
    if (input.slice(i, i + 2) === "$$") {
      const end = input.indexOf("$$", i + 2);
      if (end === -1) throw new Error("Unclosed display math block ($$ ... $$).");
      output += tokenForMath(mathItems, input.slice(i + 2, end).trim(), true);
      i = end + 2;
    } else if (input[i] === "$" && input[i - 1] !== "\\" && input[i + 1] !== "$") {
      const end = findInlineMathEnd(input, i + 1);
      if (end === -1) {
        output += input[i];
        i += 1;
      } else {
        output += tokenForMath(mathItems, input.slice(i + 1, end).trim(), false);
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
    if (input[i] === "\n") return -1;
    if (input[i] === "$" && input[i - 1] !== "\\" && input[i + 1] !== "$") return i;
  }
  return -1;
}

function tokenForMath(mathItems, latex, display) {
  const decodedLatex = decodeHtmlEntities(latex);
  if (!decodedLatex) throw new Error("Empty math expression found.");
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

function fragmentForNode($, node) {
  const id = $(node).attr("data-pptx-fragment-id");
  if (!id) return null;
  return {
    id,
    order: Number($(node).attr("data-pptx-fragment-order") || 0),
    sourceOrder: Number($(node).attr("data-pptx-fragment-source-order") || 0),
    effect: $(node).attr("data-pptx-fragment-effect") || "entrance",
  };
}

function mathBlockFromNode($, node, context) {
  const token = normalizeText($(node).text());
  return { type: "math", token, text: token, dir: "ltr", fragment: fragmentForNode($, node) || inheritedFragment($, node), display: true };
}

function inheritedFragment($, node) {
  const parent = $(node).closest(".fragment")[0];
  return parent ? fragmentForNode($, parent) : null;
}

function imageBlocksFrom($, node, context) {
  const images = node.name && node.name.toLowerCase() === "img" ? [node] : $(node).find("> p > img, > img").toArray();
  return images.map((img) => ({
    type: "image",
    src: $(img).attr("src") || "",
    alt: $(img).attr("alt") || "",
    style: $(img).attr("style") || "",
    dir: context.dir,
    fragment: fragmentForNode($, img) || inheritedFragment($, img),
  })).filter((image) => image.src);
}

function tableRows($, node, context) {
  return $(node).find("tr").toArray().map((tr) => (
    $(tr).children("th,td").toArray().map((cell) => ({ text: normalizeText($(cell).text()), dir: context.dir }))
  )).filter((row) => row.length);
}

function containsOnlyImage($, node) {
  const clone = $(node).clone();
  clone.find("img").remove();
  return $(node).find("img").length > 0 && !normalizeText(clone.text());
}

function isDisplayMathParagraph($, node) {
  return isMathToken(normalizeText($(node).text()));
}

function isDisplayMathContainer($, node) {
  const children = $(node).children();
  return children.length === 1 && children.first().is("p") && isDisplayMathParagraph($, children[0]);
}

function isMathToken(text) {
  return /^PPTXMATH\d+TOKEN$/.test(String(text || "").trim());
}

function titleFromSlides(slides) {
  if (!slides.length) return "";
  const $ = cheerio.load(md.render(slides[0].raw), { decodeEntities: false }, false);
  return normalizeText($.root().text());
}

module.exports = {
  parseDeckModel,
  parseDeckModelFromFile,
  replaceMathWithTokens,
};
