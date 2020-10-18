#!/bin/bash

set -e

echo "-> Running prebuild script"

pages=(tutorial01_optimization tutorial02_probability)
for page in "${pages[@]}"; do
    mkdir -p "static/$page"

    if [ -f "./content/$page/code.ipynb" ]; then
        echo "Generating static/${page}_code.html"
        jupyter nbconvert \
            --to html \
            --template classic \
            --log-level WARN \
            --output-dir=static \
            --output="${page}_code.html" \
            "content/$page/code.ipynb"
        cp "./content/$page/code.ipynb" "./static/$page.ipynb"
        # if [ -d "./content/$page/output" ]; then
        #     cp -r "./content/$page/output" "./static/$page/"
        # fi
    fi

    # Wating for netlify to suppoted texlive (via homebrew): https://github.com/netlify/build-image/pull/474
    echo "Generating static/$page.pdf"
    pandoc "./content/$page/index.md" \
        --resource-path="./content/$page" \
        -f markdown \
        -t latex \
        --pdf-engine=xelatex \
        -V dir:rtl \
        -V 'mainfont:DejaVu Sans' \
        -V 'monofont:DejaVu Sans Mono' \
        -V geometry:margin=2cm \
        -V linkcolor:blue \
        -o "./static/$page.pdf"

    echo "Generating static/$page.docx"
    pandoc "./content/$page/index.md" \
        --resource-path="./content/$page" \
        -f markdown+tex_math_dollars \
        -t docx \
        -o "./static/$page.docx"
done

echo ""
