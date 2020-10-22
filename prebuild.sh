#!/bin/bash

set -e

echo "-> Running prebuild script"

mkdir -p ~/.jupyter/custom
cp /project/app/src/styles/style.css ~/.jupyter/custom/custom.css
if [ ! -d "./static" ]; then
    mkdir static
fi

for page in content/*/ ; do
    page=${page#content/}
    page=${page%/}

    if [ -f "./content/$page/code.ipynb" ]; then
        echo "Generating static/${page}_code.html"
        jupyter nbconvert \
            --to html_embed \
            --template classic \
            --log-level WARN \
            --output-dir=static \
            --output="${page}_code.html" \
            "content/$page/code.ipynb"
        cp "./content/$page/code.ipynb" "./static/$page.ipynb"
    fi

    if [ -f "./content/$page/index.md" ]; then
        # # Wating for Netlify to suppoted texlive (via homebrew): https://github.com/netlify/build-image/pull/474
        # echo "Generating static/$page.pdf"
        # pandoc "./content/$page/index.md" \
        #     --resource-path="./content/$page" \
        #     -f markdown \
        #     -t latex \
        #     --pdf-engine=xelatex \
        #     -V dir:rtl \
        #     -V 'mainfont:DejaVu Sans' \
        #     -V 'monofont:DejaVu Sans Mono' \
        #     -V geometry:margin=2cm \
        #     -V linkcolor:blue \
        #     -o "./static/$page.pdf"

        echo "Generating static/$page.docx"
        pandoc "./content/$page/index.md" \
            --resource-path="./content/$page" \
            -f markdown+tex_math_dollars \
            -t docx \
            -o "./static/$page.docx"
    fi
done

echo ""
