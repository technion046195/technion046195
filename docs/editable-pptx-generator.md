# Editable PPTX generator

This repository includes a standalone converter for the Reveal-style Markdown
slides in `content/**/slides.md`. It creates editable PowerPoint files while
leaving the Gatsby/Netlify build unchanged.

## Prerequisites

Install the npm dependencies first:

```bash
npm install
```

The converter also requires Pandoc because equations are exported as native
Office math. The repository Docker image already installs Pandoc. On a local
machine, install Pandoc and make sure `pandoc --version` works, or pass the
executable path with `--pandoc`.

The converter runs strict PPTX package/schema verification after generation by
default. If the generated package has a known PowerPoint repair trigger, the
command fails instead of leaving a questionable deck behind.

## Usage

Convert the tutorial 6 deck:

```bash
npm run slides:pptx -- --input content/tutorial06/slides.md --output public/assets/tutorial06_slides.pptx
```

If Pandoc is not on `PATH`:

```bash
npm run slides:pptx -- --input content/tutorial06/slides.md --output public/assets/tutorial06_slides.pptx --pandoc C:\path\to\pandoc.exe
```

You can also set `PANDOC_BIN`:

```bash
PANDOC_BIN=/usr/bin/pandoc npm run slides:pptx -- --input content/tutorial06/slides.md --output public/assets/tutorial06_slides.pptx
```

For debugging only, pass `--no-split` to preserve one source slide per
PowerPoint slide, or `--no-strict` to inspect a deck even when verification
finds a package/schema issue.

## Supported slide syntax

The v1 converter is designed around the current course slide style:

- Frontmatter followed by an outer `<div class="slides site-style">`.
- Horizontal or vertical Reveal `<section>` groups.
- Markdown headings, paragraphs, bullet and numbered lists.
- Bold, italic, links, inline `span` color, and RTL/LTR direction islands.
- Markdown tables.
- Markdown and HTML images resolved relative to the source `slides.md`.
- `imgbox`, `no-shadow`, `max-width`, and `max-height` image styling.
- Inline and display LaTeX math delimited by `$...$` and `$$...$$`.
- Reveal fragments exported as PowerPoint click animations on the same slide.

## Output behavior

The output is a semantic PowerPoint recreation, not a pixel-perfect browser
capture. Text, tables, images, and equations are editable in PowerPoint. The
course theme is approximated with the same slide ratio, RTL default, paper
background, Technion-blue accents, title panel, and common typography scale.

Reveal fragments are not exported as duplicate incremental slides. A browser
slide stays one PowerPoint slide, and `.fragment` elements become on-click
animations. Fragment order follows `data-fragment-index` when present and
source order otherwise. Fragmented list items animate at the bullet paragraph
level; block fragments such as `div.fragment`, `imgbox.fragment`, images,
tables, and equation blocks animate the generated objects as a group. Basic
`fade-out` fragments are exported as exit animations.

Lists are exported as editable PowerPoint list text bodies. A Markdown or HTML
list should open in PowerPoint as one text box with native bullet or numbering
paragraphs, rather than one text box per bullet.

Display equations are exported as separate editable Office math blocks. The
converter reserves approximate vertical space for these blocks before Pandoc's
OMML is injected so surrounding bullets, paragraphs, images, and equations keep
their relative order on the slide. Inline equations remain part of their
surrounding editable text.

Before writing slides, the converter builds a semantic slide model and runs a
readability-first layout pass. Dense source slides are split into continuation
slides instead of shrinking body text below readable floors. The emitter still
uses editable PowerPoint text, tables, images, and Office math objects.

## Troubleshooting

- `Pandoc is required...`: install Pandoc, run inside the Docker image, pass
  `--pandoc`, or set `PANDOC_BIN`.
- `Image not found`: check that the image path in Markdown is relative to the
  source `slides.md`.
- `Remote images are not supported`: download the image into the repository and
  reference it with a local path.
- `Unclosed display math block`: check for a missing closing `$$`.
- `Pandoc produced no editable Office math`: simplify the LaTeX or confirm that
  Pandoc can convert the equation in isolation.
- Dense math slides may still need manual PowerPoint adjustment when the
  browser layout depends on CSS that has no direct PowerPoint equivalent. Watch
  for CLI warnings that say a slide is still taller than the available slide
  area after compression.
- Inline fragments such as `span.fragment` are preserved as visible editable
  text, but independent inline-run animation is not supported yet. The CLI
  prints a warning when it sees this pattern.

## Structural verification

After generating a deck, run the verifier to catch common export regressions:

```bash
node scripts/verify-slides-pptx.js --pptx public/assets/tutorial06_slides.pptx --expected-slides 64 --min-bullet-paragraphs-in-body 4 --require-timing --require-omml --require-hebrew-rtl --no-math-placeholders
```

The same verifier runs automatically during `npm run slides:pptx` unless
`--no-strict` is supplied.

Run the exporter unit tests with:

```bash
npm test
```

For a layout-specific check, verify that too many editable objects do not share
the same top coordinate on a slide:

```bash
node scripts/verify-slides-pptx.js --pptx public/assets/tutorial08_slides.pptx --slide 7 --max-objects-same-y 2
```

For dense math slides, check both the reserved equation height and object
geometry:

```bash
node scripts/verify-slides-pptx.js --pptx public/assets/tutorial08_slides.pptx --slide 19 --min-math-height-emu 2200000 --max-overlap-emu 50000 --max-bottom-overflow-emu 100000
```

## Known limitations

- The converter intentionally does not run during `gatsby build`.
- Complex CSS layouts are approximated as PowerPoint flow layouts.
- Unsupported equations fail the export instead of falling back to raster
  images.
- Speaker notes, Reveal controls, exact Reveal transition effects, and
  browser-only functionality are not represented in the PPTX.
- Animated GIFs may import as media or static images depending on the PowerPoint
  version.
- Inline fragments inside a larger paragraph do not animate independently in
  this version.
