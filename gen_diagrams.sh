#!/bin/bash

set -e

declare -A diagrams
diagrams["tutorial01/assets/dist_from_circle.png"]="-p0 -b20"
diagrams["tutorial02/assets/random_process.png"]="-p1 -b20"
diagrams["tutorial02/assets/ex_2_1_venn.png"]="-p2 -b20"
diagrams["lecture01/assets/data_vs_prior.png"]="-p3 -t -b20"
diagrams["lecture01/assets/data_vs_prior_ml.png"]="-p4 -t -b20"
diagrams["lecture02/assets/models_diagram.png"]="-p6 -t -b20"
diagrams["lecture02/assets/models_diagram_non_parametric.png"]="-p7 -t -b20"
diagrams["lecture03/assets/models_diagram_approx_estim_decomp.png"]="-p8 -t -b20"
diagrams["lecture03/assets/bias_variance_tradeoff.png"]="-p9 -t -b20"
diagrams["tutorial04/assets/bias_variance_tradeoff_less_variance.png"]="-p10 -t -b20"
diagrams["tutorial04/assets/center_of_mass.png"]="-p11 -t -b20"
diagrams["lecture03/assets/bias_and_variance.png"]="-p12 -t -b20"
diagrams["lecture03/assets/overfitting.png"]="-p13 -t -b20"
diagrams["lecture03/assets/approx_estim_tradeoff.png"]="-p14 -t -b20"
diagrams["lecture03/assets/models_diagram_regularization.png"]="-p15 -t -b20"

for diag in "${!diagrams[@]}"; do
    echo "Generating ./content/$diag"
    if [ -f "./content/$diag" ]; then
        rm "./content/$diag"
    fi
    IFS=' ' read -r -a args <<< "${diagrams[$diag]}"
    drawio -x -f png -s 3 -o "./content/$diag" "${args[@]}" ./content/assets/diagrams.drawio
    # mogrify -strip "./content/$diag"
done

# drawio -x -f png -s 4 -o "./content/tutorial02/assets/random_process.svg" -p1 -b20 ./content/assets/diagrams.drawio

# mkdir -p  ./public/tutorial02/assets
# cp ./content/tutorial02/assets/random_process_layers.svg /tmp/random_process_layers.svg
# sed -i "s/visibility=\"visible\"/visibility=\"hidden\">/g" /tmp/random_process_layers.svg
# sed -i "s/<g id=\"layer_1\" visibility=\"hidden\">/<g id=\"layer_1\" visibility=\"visble\">/g" /tmp/random_process_layers.svg
# ../node_modules/.bin/svgexport /tmp/random_process_layers.svg ./public/tutorial02/assets/random_process_1.png
# sed -i "s/<g id=\"layer_2\" visibility=\"hidden\">/<g id=\"layer_2\" visibility=\"visble\">/g" /tmp/random_process_layers.svg
# ../node_modules/.bin/svgexport /tmp/random_process_layers.svg ./public/tutorial02/assets/random_process_2.png
# sed -i "s/<g id=\"layer_3\" visibility=\"hidden\">/<g id=\"layer_3\" visibility=\"visble\">/g" /tmp/random_process_layers.svg
# ../node_modules/.bin/svgexport /tmp/random_process_layers.svg ./public/tutorial02/assets/random_process_3.png
# sed -i "s/<g id=\"layer_4\" visibility=\"hidden\">/<g id=\"layer_4\" visibility=\"visble\">/g" /tmp/random_process_layers.svg
# ../node_modules/.bin/svgexport /tmp/random_process_layers.svg ./public/tutorial02/assets/random_process_4.png
# sed -i "s/<g id=\"layer_5\" visibility=\"hidden\">/<g id=\"layer_5\" visibility=\"visble\">/g" /tmp/random_process_layers.svg
# ../node_modules/.bin/svgexport /tmp/random_process_layers.svg ./public/tutorial02/assets/random_process_5.png
# sed -i "s/<g id=\"layer_6\" visibility=\"hidden\">/<g id=\"layer_6\" visibility=\"visble\">/g" /tmp/random_process_layers.svg
# ../node_modules/.bin/svgexport /tmp/random_process_layers.svg ./public/tutorial02/assets/random_process_6.png