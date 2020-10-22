#!/bin/bash
set -m

cd /project/app
gatsby develop --host=0.0.0.0 &
jupyter notebook --config_file=./jupyter_notebook_config.py &

fg %1