#!/bin/bash

set -e

REPODIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
PAGE=$1

if [ ! -d "$REPODIR/docx" ]; then
    mkdir "$REPODIR/docx"
fi

docker run -it --rm -v "$PWD:/project/app" --net=host -w "/project/app/content/$PAGE" omeryair/technion046195:v0.1 \
    pandoc page.md -f markdown -t docx -o "../../docx/$PAGE.docx"
echo "Generated docx/$PAGE.docx"