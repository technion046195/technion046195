#!/bin/bash

set -e

PAGE=$1

docker run -it --rm -v "$PWD:/project/app" --net=host omeryair/technion046195:v0.1 \
    pandoc "/project/app/content/$PAGE/page.md" \
        --resource-path="/project/app/content/$PAGE" \
        -f markdown \
        -t latex \
        --pdf-engine=xelatex \
        -V dir:rtl \
        -V 'mainfont:DejaVu Sans' \
        -V 'monofont:DejaVu Sans Mono' \
        -V geometry:margin=2cm \
        -V linkcolor:blue \
        -o "./static/$PAGE.pdf"
echo "Generated static/$PAGE.pdf"

docker run -it --rm -v "$PWD:/project/app" --net=host omeryair/technion046195:v0.1 \
    pandoc "/project/app/content/$PAGE/page.md" \
        --resource-path="/project/app/content/$PAGE" \
        -f markdown+tex_math_dollars \
        -t docx \
        -o "./static/$PAGE.docx"
echo "Generated static/$PAGE.docx"