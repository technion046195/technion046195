#!/bin/bash

set -e

echo "-> Running prebuild script"

if [ ! -d "./static/docs" ]; then
    mkdir -p "./static/docs"
fi

pages=(tutorial01_optimization tutorial02_probability)
for page in "${pages[@]}"; do
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

    echo "Generating static/docs/$page.docx"
    pandoc "./content/$page/page.md" \
        --resource-path="./content/$page" \
        -f markdown+tex_math_dollars \
        -t docx \
        -o "./static/docs/$page.docx"
done
