function normalizeLatexForPandoc(latex, display) {
  const text = String(latex || "").replace(/\r\n/g, "\n").trim();
  if (!display || !text) {
    return text;
  }
  if (!needsAlignedWrapper(text)) {
    return text;
  }
  const normalizedBreaks = text.replace(/\n\s*(?=(?:\\Leftrightarrow|\\Rightarrow|\\Leftarrow|\\leq|\\geq|\\le|\\ge|=|<|>))/g, "\\\\");
  const rows = normalizedBreaks
    .split(/\\\\/)
    .map((row) => row.trim())
    .filter(Boolean)
    .map(addAlignmentMarker);
  return `\\begin{aligned}\n${rows.join(" \\\\\n")}\n\\end{aligned}`;
}

function needsAlignedWrapper(latex) {
  if (!/\\\\/.test(latex) && !/\n\s*(?:\\Leftrightarrow|\\Rightarrow|\\Leftarrow|\\leq|\\geq|\\le|\\ge|=|<|>)/.test(latex)) {
    return false;
  }
  if (/\\begin\{(?:aligned|align|alignat|gathered|gather|matrix|pmatrix|bmatrix|cases|array)\}/.test(latex)) {
    return false;
  }
  return true;
}

function addAlignmentMarker(row) {
  if (row.includes("&")) {
    return row;
  }
  const relationIndex = topLevelRelationIndex(row);
  if (relationIndex === -1) {
    return `&${row}`;
  }
  return `${row.slice(0, relationIndex)}&${row.slice(relationIndex)}`;
}

function topLevelRelationIndex(row) {
  const relationCommands = ["\\Leftrightarrow", "\\Rightarrow", "\\Leftarrow", "\\leq", "\\geq", "\\le", "\\ge"];
  let braceDepth = 0;
  for (let i = 0; i < row.length; i += 1) {
    const char = row[i];
    if (char === "{" && row[i - 1] !== "\\") {
      braceDepth += 1;
      continue;
    }
    if (char === "}" && row[i - 1] !== "\\") {
      braceDepth = Math.max(0, braceDepth - 1);
      continue;
    }
    if (braceDepth !== 0) {
      continue;
    }
    if (char === "=" || char === "<" || char === ">") {
      return i;
    }
    if (char === "\\") {
      const command = relationCommands.find((candidate) => row.startsWith(candidate, i));
      if (command) {
        return i;
      }
    }
  }
  return -1;
}

module.exports = {
  normalizeLatexForPandoc,
};
