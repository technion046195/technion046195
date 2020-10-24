#!/bin/bash

set -e

declare -A diagrams
diagrams["tutorial01_optimization/assets/dist_from_circle.png"]="-p 0 -b 20"
diagrams["tutorial02_probability/assets/random_process.png"]="-p 1 -b 20"
diagrams["tutorial02_probability/assets/ex_2_1_venn.png"]="-p 2 -b 20"
diagrams["lecture01_intro/assets/data_vs_prior.png"]="-p 3 -t -b 20"

for diag in "${!diagrams[@]}"; do
    echo "Generating ./content/$diag"
    if [ -f "./content/$diag" ]; then
        rm "./content/$diag"
    fi
    IFS=' ' read -r -a args <<< "${diagrams[$diag]}"
    drawio -x -f png -s 4 -o "./content/$diag" "${args[@]}" ./content/assets/diagrams.drawio
    # mogrify -strip "./content/$diag"
done