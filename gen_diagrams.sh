#!/bin/bash

set -e

declare -A diagrams
diagrams["tutorial01_optimization/assets/dist_from_circle.png"]="-p0 -b20"
diagrams["tutorial02_probability/assets/random_process.png"]="-p1 -b20"
diagrams["tutorial02_probability/assets/ex_2_1_venn.png"]="-p2 -b20"
diagrams["lecture01_intro/assets/data_vs_prior.png"]="-p3 -t -b20"
diagrams["lecture01_intro/assets/data_vs_prior_ml.png"]="-p4 -t -b20"
diagrams["lecture01_intro/assets/missing_number.png"]="-p5 -t -b20"

for diag in "${!diagrams[@]}"; do
    echo "Generating ./content/$diag"
    if [ -f "./content/$diag" ]; then
        rm "./content/$diag"
    fi
    IFS=' ' read -r -a args <<< "${diagrams[$diag]}"
    drawio -x -f png -s 4 -o "./content/$diag" "${args[@]}" ./content/assets/diagrams.drawio
    # mogrify -strip "./content/$diag"
done

# drawio -x -f png -s 4 -o "./content/tutorial02_probability/assets/random_process.svg" -p1 -b20 ./content/assets/diagrams.drawio
# cp ./content/tutorial02_probability/assets/random_process_layers.svg /tmp/random_process_layers.svg
# sed -i "s/visibility=\"visible\"/visibility=\"hidden\">/g" /tmp/random_process_layers.svg

# sed -i "s/<g id=\"layer_1\" visibility=\"hidden\">/<g id=\"layer_1\" visibility=\"visble\">/g" /tmp/random_process_layers.svg
# ../node_modules/.bin/svgexport /tmp/random_process_layers.svg ./content/tutorial02_probability/assets/random_process_1.png
# sed -i "s/<g id=\"layer_2\" visibility=\"hidden\">/<g id=\"layer_2\" visibility=\"visble\">/g" /tmp/random_process_layers.svg
# ../node_modules/.bin/svgexport /tmp/random_process_layers.svg ./content/tutorial02_probability/assets/random_process_2.png
# sed -i "s/<g id=\"layer_3\" visibility=\"hidden\">/<g id=\"layer_3\" visibility=\"visble\">/g" /tmp/random_process_layers.svg
# ../node_modules/.bin/svgexport /tmp/random_process_layers.svg ./content/tutorial02_probability/assets/random_process_3.png
# sed -i "s/<g id=\"layer_4\" visibility=\"hidden\">/<g id=\"layer_4\" visibility=\"visble\">/g" /tmp/random_process_layers.svg
# ../node_modules/.bin/svgexport /tmp/random_process_layers.svg ./content/tutorial02_probability/assets/random_process_4.png
# sed -i "s/<g id=\"layer_5\" visibility=\"hidden\">/<g id=\"layer_5\" visibility=\"visble\">/g" /tmp/random_process_layers.svg
# ../node_modules/.bin/svgexport /tmp/random_process_layers.svg ./content/tutorial02_probability/assets/random_process_5.png
# sed -i "s/<g id=\"layer_6\" visibility=\"hidden\">/<g id=\"layer_6\" visibility=\"visble\">/g" /tmp/random_process_layers.svg
# ../node_modules/.bin/svgexport /tmp/random_process_layers.svg ./content/tutorial02_probability/assets/random_process_6.png