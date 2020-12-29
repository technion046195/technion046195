#!/bin/bash

set -e

gen_diag() {
    diagfilename=$1
    echo "Generating $diagfilename"
    mkdir -p  "$(dirname $diagfilename)"
    if [ -f "$diagfilename" ]; then
        rm "$diagfilename"
    fi
    drawio -x -o "$diagfilename" "${@:2}"
}

gen_gif() {
    giffilename=$1
    first=$2
    last=$3
    delay=$4

    echo "Generating $giffilename"
    if [ -d "/tmp/imgs" ]; then
        rm -r "/tmp/imgs"
    fi
    mkdir -p  /tmp/imgs
    mkdir -p  "$(dirname $giffilename)"

    for i in $(seq $first $last); do
        drawio -x -o "/tmp/imgs/img${i}.png" -f png "-p${i}" "${@:5}"
    done
    convert -delay "$delay" -loop 0 /tmp/imgs/*.png "$giffilename"
}

gen_diag ./content/assets/course_diagram.png -f png -p0 -b20 -s3 ./content/assets/course_diagram.drawio

gen_diag ./content/tutorial01/assets/dist_from_circle.png -f png -p0 -b20 -s3 ./content/assets/diagrams.drawio

gen_diag ./content/lecture01/assets/data_vs_prior.png -f png -p3 -t -b20 -s3 ./content/assets/diagrams.drawio
gen_diag ./content/lecture01/assets/data_vs_prior_ml.png -f png -p4 -t -b20 -s3 ./content/assets/diagrams.drawio

gen_diag ./content/tutorial02/assets/random_process.png -f png -p1 -b20 -s3 ./content/assets/diagrams.drawio

gen_diag ./content/tutorial02/assets/ex_2_1_venn.png -f png -p2 -b20 -s3 ./content/assets/diagrams.drawio

gen_diag ./content/lecture02/assets/course_diagram.png -f png -p1 -b20 -s3 ./content/assets/course_diagram.drawio
gen_diag ./content/lecture02/assets/models_diagram_non_parametric.png -f png -p6 -t -b20 -s3 ./content/assets/diagrams.drawio
gen_diag ./content/lecture02/assets/models_diagram.png -f png -p7 -t -b20 -s3 ./content/assets/diagrams.drawio

gen_diag ./content/lecture03/assets/models_diagram_approx_estim_decomp.png -f png -p8 -t -b20 -s3 ./content/assets/diagrams.drawio
gen_diag ./content/lecture03/assets/bias_variance_tradeoff.png -f png -p9 -t -b20 -s3 ./content/assets/diagrams.drawio
gen_diag ./content/lecture03/assets/course_diagram.png -f png -p2 -b20 -s3 ./content/assets/course_diagram.drawio
gen_diag ./content/lecture03/assets/bias_and_variance.png -f png -p12 -t -b20 -s3 ./content/assets/diagrams.drawio
gen_diag ./content/lecture03/assets/overfitting.png -f png -p13 -t -b20 -s3 ./content/assets/diagrams.drawio
gen_diag ./content/lecture03/assets/approx_estim_tradeoff.png -f png -p14 -t -b20 -s3 ./content/assets/diagrams.drawio
gen_diag ./content/lecture03/assets/models_diagram_regularization.png -f png -p15 -t -b20 -s3 ./content/assets/diagrams.drawio

gen_diag ./content/tutorial04/assets/bias_variance_tradeoff_less_variance.png -f png -p10 -t -b20 -s3 ./content/assets/diagrams.drawio
gen_diag ./content/tutorial04/assets/center_of_mass.png -f png -p11 -t -b20 -s3 ./content/assets/diagrams.drawio

gen_diag ./content/lecture04/assets/course_diagram.png -f png -p3 -b20 -s3 ./content/assets/course_diagram.drawio
gen_diag ./content/lecture04/assets/binary_tree.png -f png -p16 -t -b20 -s3 ./content/assets/diagrams.drawio
gen_diag ./content/lecture04/assets/tree_fraud_detection.png -f png -p17 -t -b20 -s4 ./content/assets/diagrams.drawio
gen_diag ./content/lecture04/assets/engineering_flowchart.png -f png -p18 -t -b20 -s3 ./content/assets/diagrams.drawio

gen_diag ./content/lecture05/assets/course_diagram.png -f png -p4 -b20 -s3 ./content/assets/course_diagram.drawio

gen_diag ./content/lecture06/assets/course_diagram.png -f png -p5 -b20 -s3 ./content/assets/course_diagram.drawio

gen_diag ./content/lecture07/assets/course_diagram.png -f png -p6 -b20 -s3 ./content/assets/course_diagram.drawio
gen_diag ./content/lecture07/assets/gradient_descent_small_step.png -f png -p0 -b0 -s1 ./content/lecture07/assets/gradient_descent.drawio
gen_diag ./content/lecture07/assets/gradient_descent_large_step.png -f png -p1 -b0 -s1 ./content/lecture07/assets/gradient_descent.drawio
gen_diag ./content/lecture07/assets/gradient_descent_too_large_step.png -f png -p2 -b0 -s1 ./content/lecture07/assets/gradient_descent.drawio

gen_diag ./content/lecture08/assets/course_diagram.png -f png -p7 -b20 -s3 ./content/assets/course_diagram.drawio
gen_diag ./content/lecture08/assets/neuron_model.png -f png -p0 -b20 -s3 ./content/lecture08/assets/neuron.drawio
gen_diag ./content/lecture08/assets/neuron_scheme.png -f png -p1 -b20 -s4 ./content/lecture08/assets/neuron.drawio
gen_diag ./content/lecture08/assets/neuron_scheme2.png -f png -p2 -b20 -s4 ./content/lecture08/assets/neuron.drawio
gen_diag ./content/lecture08/assets/ann.png -f png -p0 -b20 -s3 ./content/lecture08/assets/ann.drawio
gen_diag ./content/lecture08/assets/mlp.png -f png -p0 -b20 -s3 ./content/lecture08/assets/mlp.drawio
gen_diag ./content/lecture08/assets/back_prop_simple.png -f png -p0 -b20 -s4 ./content/lecture08/assets/back_prop_simple.drawio
gen_diag ./content/lecture08/assets/back_prop.png -f png -p0 -b20 -s4 ./content/lecture08/assets/back_prop.drawio

gen_diag ./content/tutorial09/assets/ex9_1.png -f png -p0 -b20 -s3 ./content/tutorial09/assets/ex9_1.drawio
gen_diag ./content/tutorial09/assets/ex9_3.png -f png -p0 -b20 -s3 ./content/tutorial09/assets/ex9_3.drawio
gen_diag ./content/tutorial09/assets/ex9_3_1.png -f png -p1 -b20 -s3 ./content/tutorial09/assets/ex9_3.drawio
gen_diag ./content/tutorial09/assets/example_mlp1.png -f png -p0 -b20 -s3 ./content/tutorial09/assets/example.drawio
gen_diag ./content/tutorial09/assets/example_mlp2.png -f png -p1 -b20 -s3 ./content/tutorial09/assets/example.drawio

gen_diag ./content/lecture09/assets/early_stopping.png -f png -p1 -b20 -s3 ./content/lecture09/assets/early_stopping.drawio
gen_diag ./content/lecture09/assets/conv.png -f png -p1 -b20 -s3 ./content/lecture09/assets/conv.drawio
gen_gif ./content/lecture09/assets/conv.gif 0 3 100 -b20 -s3 ./content/lecture09/assets/conv_anim.drawio
gen_gif ./content/lecture09/assets/conv_multi_input.gif 0 3 100 -b20 -s3 ./content/lecture09/assets/conv_multi_input_anim.drawio
gen_gif ./content/lecture09/assets/conv_multi_chan.gif 0 3 100 -b20 -s3 ./content/lecture09/assets/conv_multi_chan_anim.drawio
gen_gif ./content/lecture09/assets/padding.gif 0 5 100 -b20 -s3 ./content/lecture09/assets/padding.drawio
gen_gif ./content/lecture09/assets/stride.gif 0 2 100 -b20 -s3 ./content/lecture09/assets/stride.drawio
gen_gif ./content/lecture09/assets/dilation.gif 0 2 100 -b20 -s3 ./content/lecture09/assets/dilation.drawio
gen_gif ./content/lecture09/assets/max_pooling.gif 0 2 100 -b20 -s3 ./content/lecture09/assets/max_pooling.drawio
gen_diag ./content/lecture09/assets/vgg16.png -f png -p1 -b20 -s2 ./content/lecture09/assets/vgg16.drawio
gen_gif ./content/lecture09/assets/receptive_field.gif 0 3 100 -b20 -s3 ./content/lecture09/assets/receptive_field.drawio
gen_diag ./content/lecture09/assets/horizontal_filter.png -f png -p1 -b20 -s2 ./content/lecture09/assets/horizontal_filter.drawio
gen_diag ./content/lecture09/assets/conv_illustration.png -f png -p1 -b20 -s2 ./content/lecture09/assets/conv_illustration.drawio
gen_diag ./content/lecture09/assets/conv_illustration.png -f png -p1 -b20 -s2 ./content/lecture09/assets/conv_illustration.drawio
gen_diag ./content/lecture09/assets/batch_norm.png -f png -p1 -b20 -s2 ./content/lecture09/assets/batch_norm.drawio

gen_diag ./content/tutorial10/assets/init_network.png -f png -p1 -b20 -s3 ./content/tutorial10/assets/init_network.drawio
gen_diag ./content/tutorial10/assets/ex_10_1_network.png -f png -p1 -b20 -s3 ./content/tutorial10/assets/ex_10_1_network.drawio
gen_diag ./content/tutorial10/assets/ex_10_1_1_1.png -f png -p1 -b20 -s3 ./content/tutorial10/assets/ex_10_1_1_1.drawio
gen_diag ./content/tutorial10/assets/ex_10_1_1_2.png -f png -p1 -b20 -s3 ./content/tutorial10/assets/ex_10_1_1_2.drawio
gen_diag ./content/tutorial10/assets/lenet_arch2.png -f png -p1 -b20 -s3 ./content/tutorial10/assets/lenet.drawio

gen_diag ./content/lecture10/assets/course_diagram.png -f png -p9 -b20 -s3 ./content/assets/course_diagram.drawio
gen_diag ./content/lecture11/assets/course_diagram.png -f png -p10 -b20 -s3 ./content/assets/course_diagram.drawio



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