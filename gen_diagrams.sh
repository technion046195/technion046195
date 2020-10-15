#!/bin/bash

set -e

declare -A diagrams
diagrams["tutorial01_optimization/assets/dist_from_circle.png"]="-p 0 -t -b 20"
diagrams["tutorial02_probability/assets/random_process.png"]="-p 1 -t -b 20"
diagrams["tutorial02_probability/assets/ex_2_1_venn.png"]="-p 2 -t -b 20"

for diag in "${!diagrams[@]}"; do
    echo "Generating ./content/$diag"
    if [ -f "./content/$diag" ]; then
        rm "./content/$diag"
    fi
    IFS=' ' read -r -a args <<< "${diagrams[$diag]}"
    draw-io -x -f png -o "./content/$diag" "${args[@]}" ./content/assets/diagrams.drawio
    mogrify -strip "./content/$diag"
done