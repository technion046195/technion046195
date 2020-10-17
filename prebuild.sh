#!/bin/bash

set -e

echo "-> Running prebuild script"

pages=(tutorial01_optimization tutorial02_probability)
for page in "${pages[@]}"; do
    mkdir -p "static/$page"

    if [ -f "./content/$page/code.ipynb" ]; then
        cp "./content/$page/code.ipynb" "./static/$page/code.ipynb"
        if [ -d "./content/$page/output" ]; then
            cp -r "./content/$page/output" "./static/$page/"
        fi
        echo "Generating $page/code.html"
        jupyter nbconvert --to html --template classic --log-level WARN "static/$page/code.ipynb"
    fi

    ## Wating for netlify to suppoted texlive (via homebrew): https://github.com/netlify/build-image/pull/474
    # echo "Generating static/docs/$page.pdf"
    # pandoc "./content/$page/page.md" \
    #     --resource-path="./content/$page" \
    #     -f markdown \
    #     -t latex \
    #     --pdf-engine=xelatex \
    #     -V dir:rtl \
    #     -V 'mainfont:DejaVu Sans' \
    #     -V 'monofont:DejaVu Sans Mono' \
    #     -V geometry:margin=2cm \
    #     -V linkcolor:blue \
    #     -o "./static/docs/$page.pdf"

    echo "Generating static/$page/page.docx"
    pandoc "./content/$page/page.md" \
        --resource-path="./content/$page" \
        -f markdown+tex_math_dollars \
        -t docx \
        -o "./static/$page/page.docx"
done

echo ""
