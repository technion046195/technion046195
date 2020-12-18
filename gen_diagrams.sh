#!/bin/bash

set -e

declare -A diagrams
diagrams["tutorial01/assets/dist_from_circle.png"]="-p0 -b20 -s3 ./content/assets/diagrams.drawio"
diagrams["tutorial02/assets/random_process.png"]="-p1 -b20 -s3 ./content/assets/diagrams.drawio"
diagrams["tutorial02/assets/ex_2_1_venn.png"]="-p2 -b20 -s3 ./content/assets/diagrams.drawio"
diagrams["lecture01/assets/data_vs_prior.png"]="-p3 -t -b20 -s3 ./content/assets/diagrams.drawio"
diagrams["lecture01/assets/data_vs_prior_ml.png"]="-p4 -t -b20 -s3 ./content/assets/diagrams.drawio"
diagrams["lecture02/assets/models_diagram_non_parametric.png"]="-p6 -t -b20 -s3 ./content/assets/diagrams.drawio"
diagrams["lecture02/assets/models_diagram.png"]="-p7 -t -b20 -s3 ./content/assets/diagrams.drawio"
diagrams["lecture03/assets/models_diagram_approx_estim_decomp.png"]="-p8 -t -b20 -s3 ./content/assets/diagrams.drawio"
diagrams["lecture03/assets/bias_variance_tradeoff.png"]="-p9 -t -b20 -s3 ./content/assets/diagrams.drawio"
diagrams["tutorial04/assets/bias_variance_tradeoff_less_variance.png"]="-p10 -t -b20 -s3 ./content/assets/diagrams.drawio"
diagrams["tutorial04/assets/center_of_mass.png"]="-p11 -t -b20 -s3 ./content/assets/diagrams.drawio"
diagrams["lecture03/assets/bias_and_variance.png"]="-p12 -t -b20 -s3 ./content/assets/diagrams.drawio"
diagrams["lecture03/assets/overfitting.png"]="-p13 -t -b20 -s3 ./content/assets/diagrams.drawio"
diagrams["lecture03/assets/approx_estim_tradeoff.png"]="-p14 -t -b20 -s3 ./content/assets/diagrams.drawio"
diagrams["lecture03/assets/models_diagram_regularization.png"]="-p15 -t -b20 -s3 ./content/assets/diagrams.drawio"
diagrams["lecture04/assets/binary_tree.png"]="-p16 -t -b20 -s3 ./content/assets/diagrams.drawio"
diagrams["lecture04/assets/tree_fraud_detection.png"]="-p17 -t -b20 -s4 ./content/assets/diagrams.drawio"
diagrams["lecture04/assets/engineering_flowchart.png"]="-p18 -t -b20 -s3 ./content/assets/diagrams.drawio"

diagrams["assets/course_diagram.png"]="-p0 -b20 -s3 ./content/assets/course_diagram.drawio"
diagrams["lecture02/assets/course_diagram.png"]="-p1 -b20 -s3 ./content/assets/course_diagram.drawio"
diagrams["lecture03/assets/course_diagram.png"]="-p2 -b20 -s3 ./content/assets/course_diagram.drawio"
diagrams["lecture04/assets/course_diagram.png"]="-p3 -b20 -s3 ./content/assets/course_diagram.drawio"
diagrams["lecture05/assets/course_diagram.png"]="-p4 -b20 -s3 ./content/assets/course_diagram.drawio"
diagrams["lecture06/assets/course_diagram.png"]="-p5 -b20 -s3 ./content/assets/course_diagram.drawio"
diagrams["lecture07/assets/course_diagram.png"]="-p6 -b20 -s3 ./content/assets/course_diagram.drawio"
diagrams["lecture08/assets/course_diagram.png"]="-p7 -b20 -s3 ./content/assets/course_diagram.drawio"
# diagrams["lecture09/assets/course_diagram.png"]="-p8 -b20 -s3 ./content/assets/course_diagram.drawio"
# diagrams["lecture10/assets/course_diagram.png"]="-p9 -b20 -s3 ./content/assets/course_diagram.drawio"
# diagrams["lecture11/assets/course_diagram.png"]="-p10 -b20 -s3 ./content/assets/course_diagram.drawio"

diagrams["lecture07/assets/gradient_descent_small_step.png"]="-p0 -b0 -s1 ./content/lecture07/assets/gradient_descent.drawio"
diagrams["lecture07/assets/gradient_descent_large_step.png"]="-p1 -b0 -s1 ./content/lecture07/assets/gradient_descent.drawio"
diagrams["lecture07/assets/gradient_descent_too_large_step.png"]="-p2 -b0 -s1 ./content/lecture07/assets/gradient_descent.drawio"

diagrams["lecture08/assets/ann.png"]="-p0 -b20 -s3 ./content/lecture08/assets/ann.drawio"
diagrams["lecture08/assets/mlp.png"]="-p0 -b20 -s3 ./content/lecture08/assets/mlp.drawio"
diagrams["lecture08/assets/back_prop.png"]="-p0 -b20 -s3 ./content/lecture08/assets/back_prop.drawio"

diagrams["tutorial09/assets/ex9_1.png"]="-p0 -b20 -s3 ./content/tutorial09/assets/ex9_1.drawio"
diagrams["tutorial09/assets/ex9_3.png"]="-p0 -b20 -s3 ./content/tutorial09/assets/ex9_3.drawio"
diagrams["tutorial09/assets/ex9_3_1.png"]="-p1 -b20 -s3 ./content/tutorial09/assets/ex9_3.drawio"
diagrams["tutorial09/assets/example_mlp1.png"]="-p0 -b20 -s3 ./content/tutorial09/assets/example.drawio"
diagrams["tutorial09/assets/example_mlp2.png"]="-p1 -b20 -s3 ./content/tutorial09/assets/example.drawio"

for diag in "${!diagrams[@]}"; do
    echo "Generating ./content/$diag"
    if [ -f "./content/$diag" ]; then
        rm "./content/$diag"
    fi
    IFS=' ' read -r -a args <<< "${diagrams[$diag]}"
    drawio -x -f png -o "./content/$diag" "${args[@]}"
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