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
  const relation = /(\\Leftrightarrow|\\Rightarrow|\\Leftarrow|\\leq|\\geq|\\le|\\ge|=|<|>)/;
  const match = row.match(relation);
  if (!match) {
    return `&${row}`;
  }
  return `${row.slice(0, match.index)}&${row.slice(match.index)}`;
}

module.exports = {
  normalizeLatexForPandoc,
};
