const path = require("path");

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

function firstChildByLocalName(node, localName) {
  for (let child = node && node.firstChild; child; child = child.nextSibling) {
    if (child.localName === localName || child.nodeName === localName || child.nodeName.endsWith(`:${localName}`)) {
      return child;
    }
  }
  return null;
}

function directChildrenByNamespaceLocalName(node, namespaceURI, localName) {
  const results = [];
  for (let child = node && node.firstChild; child; child = child.nextSibling) {
    if (child.namespaceURI === namespaceURI && child.localName === localName) {
      results.push(child);
    }
  }
  return results;
}

function ancestorByNamespaceLocalName(node, namespaceURI, localName) {
  let current = node.parentNode;
  while (current) {
    if (current.namespaceURI === namespaceURI && current.localName === localName) {
      return current;
    }
    current = current.parentNode;
  }
  return null;
}

function normalizeText(text) {
  return String(text || "").replace(/\s+/g, " ").trim();
}

function parseStyle(styleText) {
  const style = {};
  String(styleText || "")
    .split(";")
    .map((entry) => entry.trim())
    .filter(Boolean)
    .forEach((entry) => {
      const separator = entry.indexOf(":");
      if (separator === -1) return;
      const key = entry.slice(0, separator).trim().toLowerCase();
      const value = entry.slice(separator + 1).trim();
      if (key) style[key] = value;
    });
  return style;
}

function getDirection(styleText, dirAttr) {
  if (dirAttr === "rtl" || dirAttr === "ltr") {
    return dirAttr;
  }
  const direction = (parseStyle(styleText).direction || "").replace(/['"]/g, "").toLowerCase();
  return direction === "rtl" || direction === "ltr" ? direction : "";
}

function resolveRelationshipTarget(relName, target) {
  if (!target) return "";
  const sourcePart = relName.includes("/_rels/")
    ? relName.replace("/_rels/", "/").replace(/\.rels$/, "")
    : relName.replace(/^_rels\//, "").replace(/\.rels$/, "");
  const sourceDir = sourcePart.includes("/") ? sourcePart.slice(0, sourcePart.lastIndexOf("/") + 1) : "";
  return path.posix.normalize(target.startsWith("/") ? target.slice(1) : sourceDir + target);
}

module.exports = {
  ancestorByNamespaceLocalName,
  directChildrenByNamespaceLocalName,
  elementsByLocalName,
  firstChildByLocalName,
  getDirection,
  normalizeText,
  parseStyle,
  resolveRelationshipTarget,
};
