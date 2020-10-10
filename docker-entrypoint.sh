#!/bin/bash
set -m

cd /project/app
gatsby develop &
jupyter-notebook --port=7000 --notebook-dir=/project/app --ip=0.0.0.0 --NotebookApp.token='' --no-browser --allow-root &

fg %1