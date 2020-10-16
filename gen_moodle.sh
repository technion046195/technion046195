#!/bin/bash

set -e

pandoc moodle.md \
    -f markdown \
    -t html \
    --self-contained \
    --css=src/styles/style.css \
    -o /tmp/moodle.html

./node_modules/.bin/juice \
    --preserve-font-faces false \
    --preserve-media-queries false \
    --preserve-pseudos false \
    /tmp/moodle.html \
    moodle.html