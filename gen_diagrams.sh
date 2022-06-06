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

gen_diag ./content/tutorial00/assets/dist_from_circle.png -f png -p0 -b20 -s3 ./content/tutorial00/assets/dist_from_circle.drawio

gen_diag ./content/lecture01/assets/data_vs_prior.png -f png -p0 -t -b20 -s3 ./content/lecture01/assets/data_vs_prior.drawio
gen_diag ./content/lecture01/assets/data_vs_prior_ml.png -f png -p1 -t -b20 -s3 ./content/lecture01/assets/data_vs_prior.drawio

gen_diag ./content/tutorial01/assets/random_process_0.png -f png -p0 -b20 -s3 ./content/tutorial01/assets/random_process.drawio
gen_diag ./content/tutorial01/assets/random_process_1.png -f png -p1 -b20 -s3 ./content/tutorial01/assets/random_process.drawio
gen_diag ./content/tutorial01/assets/random_process_2.png -f png -p2 -b20 -s3 ./content/tutorial01/assets/random_process.drawio
gen_diag ./content/tutorial01/assets/random_process_3.png -f png -p3 -b20 -s3 ./content/tutorial01/assets/random_process.drawio
gen_diag ./content/tutorial01/assets/random_process_4.png -f png -p4 -b20 -s3 ./content/tutorial01/assets/random_process.drawio
gen_diag ./content/tutorial01/assets/random_process_5.png -f png -p5 -b20 -s3 ./content/tutorial01/assets/random_process.drawio

gen_diag ./content/tutorial01/assets/ex_1_1_venn.png -f png -p2 -b20 -s3 ./content/tutorial01/assets/ex_1_1_venn.drawio

gen_diag ./content/lecture02/assets/course_diagram.png -f png -p1 -b20 -s3 ./content/assets/course_diagram.drawio
gen_diag ./content/lecture02/assets/models_diagram_non_parametric.png -f png -p1 -t -b20 -s3 ./content/lecture02/assets/models_diagram.drawio
gen_diag ./content/lecture02/assets/models_diagram.png -f png -p2 -t -b20 -s3 ./content/lecture02/assets/models_diagram.drawio

gen_diag ./content/lecture03/assets/course_diagram.png -f png -p2 -b20 -s3 ./content/assets/course_diagram.drawio
gen_diag ./content/lecture03/assets/models_diagram_approx_estim_decomp.png -f png -p3 -t -b20 -s3 ./content/lecture02/assets/models_diagram.drawio
gen_diag ./content/lecture03/assets/bias_variance_tradeoff.png -f png -p0 -t -b20 -s3 ./content/lecture03/assets/bias_variance_tradeoff.drawio
gen_diag ./content/lecture03/assets/overfitting.png -f png -p1 -t -b20 -s3 ./content/lecture03/assets/bias_variance_tradeoff.drawio
gen_diag ./content/lecture03/assets/approx_estim_tradeoff.png -f png -p2 -t -b20 -s3 ./content/lecture03/assets/bias_variance_tradeoff.drawio
gen_diag ./content/lecture03/assets/models_diagram_regularization.png -f png -p4 -t -b20 -s3 ./content/lecture02/assets/models_diagram.drawio

gen_diag ./content/tutorial03/assets/bias_variance_tradeoff_less_variance.png -f png -p3 -t -b20 -s3 ./content/lecture03/assets/bias_variance_tradeoff.drawio
gen_diag ./content/lecture03/assets/bias_and_variance.png -f png -p0 -t -b20 -s3 ./content/lecture03/assets/bias_and_variance.drawio
gen_diag ./content/tutorial03/assets/center_of_mass.png -f png -p0 -t -b20 -s3 ./content/tutorial03/assets/center_of_mass.drawio

gen_diag ./content/lecture04/assets/course_diagram.png -f png -p3 -b20 -s3 ./content/assets/course_diagram.drawio
gen_diag ./content/lecture04/assets/binary_tree.png -f png -p0 -t -b20 -s3 ./content/lecture04/assets/trees.drawio
gen_diag ./content/lecture04/assets/tree_fraud_detection.png -f png -p1 -t -b20 -s4 ./content/lecture04/assets/trees.drawio
gen_diag ./content/lecture04/assets/engineering_flowchart.png -f png -p2 -t -b20 -s3 ./content/lecture04/assets/trees.drawio

gen_diag ./content/lecture05/assets/course_diagram.png -f png -p4 -b20 -s3 ./content/assets/course_diagram.drawio
gen_diag ./content/lecture05/assets/models_bias_variance.png -f png -p0 -b20 -s3 ./content/lecture05/assets/models_bias_variance.drawio
gen_diag ./content/lecture05/assets/bootstrapping.png -f png -p0 -b20 -s3 ./content/lecture05/assets/bootstrapping.drawio
gen_diag ./content/lecture05/assets/bagging.png -f png -p0 -b20 -s3 ./content/lecture05/assets/bagging.drawio

gen_diag ./content/tutorial05/assets/ex_12_1.png -f png -p0 -b20 -s3 ./content/tutorial05/assets/ex_11_1.drawio
gen_diag ./content/tutorial05/assets/ex_12_1_b_0.png -f png -p0 -b20 -s3 ./content/tutorial05/assets/ex_11_1_b_0.drawio
gen_diag ./content/tutorial05/assets/ex_12_1_b_2.png -f png -p0 -b20 -s3 ./content/tutorial05/assets/ex_11_1_b_2.drawio
gen_diag ./content/tutorial05/assets/ex_12_1_b_4.png -f png -p0 -b20 -s3 ./content/tutorial05/assets/ex_11_1_b_4.drawio

gen_diag ./content/lecture06/assets/course_diagram.png -f png -p5 -b20 -s3 ./content/assets/course_diagram.drawio
gen_diag ./content/lecture06/assets/linear_separable.png -f png -p0 -b20 -s3 ./content/lecture06/assets/linear_separable.drawio
gen_diag ./content/lecture06/assets/multiple_separation_planes.png -f png -p0 -b20 -s3 ./content/lecture06/assets/multiple_separation_planes.drawio
gen_diag ./content/lecture06/assets/unit_linear.png -f png -p0 -b20 -s3 ./content/lecture06/assets/unit_linear.drawio
gen_diag ./content/lecture06/assets/linear.png -f png -p0 -b20 -s3 ./content/lecture06/assets/linear.drawio
gen_diag ./content/lecture06/assets/affine.png -f png -p0 -b20 -s3 ./content/lecture06/assets/affine.drawio
gen_diag ./content/lecture06/assets/plain_geometry.png -f png -p0 -b20 -s3 ./content/lecture06/assets/plain_geometry.drawio
gen_diag ./content/lecture06/assets/hard_svm.png -f png -p0 -b20 -s3 ./content/lecture06/assets/hard_svm.drawio
gen_diag ./content/lecture06/assets/signed_distance.png -f png -p0 -b20 -s3 ./content/lecture06/assets/signed_distance.drawio
gen_diag ./content/lecture06/assets/margin.png -f png -p0 -b20 -s3 ./content/lecture06/assets/svm_geometry.drawio
gen_diag ./content/lecture06/assets/svm_xi.png -f png -p1 -b20 -s3 ./content/lecture06/assets/svm_geometry.drawio

gen_diag ./content/tutorial06/assets/ex_10_1.png -f png -p0 -b20 -s3 ./content/tutorial06/assets/ex_10_1.drawio
gen_diag ./content/tutorial06/assets/ex_10_2.png -f png -p0 -b20 -s3 ./content/tutorial06/assets/ex_10_2.drawio
gen_diag ./content/tutorial06/assets/ex_10_2_2_sv.png -f png -p1 -b20 -s3 ./content/tutorial06/assets/ex_10_2.drawio
gen_diag ./content/tutorial06/assets/ex_10_2_3_sv.png -f png -p2 -b20 -s3 ./content/tutorial06/assets/ex_10_2.drawio

gen_diag ./content/lecture07/assets/course_diagram.png -f png -p6 -b20 -s3 ./content/assets/course_diagram.drawio

gen_diag ./content/lecture08/assets/course_diagram.png -f png -p7 -b20 -s3 ./content/assets/course_diagram.drawio

gen_diag ./content/lecture09/assets/course_diagram.png -f png -p8 -b20 -s3 ./content/assets/course_diagram.drawio
gen_diag ./content/lecture09/assets/gradient_descent_small_step.png -f png -p0 -b0 -s1 ./content/lecture09/assets/gradient_descent.drawio
gen_diag ./content/lecture09/assets/gradient_descent_large_step.png -f png -p1 -b0 -s1 ./content/lecture09/assets/gradient_descent.drawio
gen_diag ./content/lecture09/assets/gradient_descent_too_large_step.png -f png -p2 -b0 -s1 ./content/lecture09/assets/gradient_descent.drawio

gen_diag ./content/lecture10/assets/course_diagram.png -f png -p9 -b20 -s3 ./content/assets/course_diagram.drawio
gen_diag ./content/lecture10/assets/neuron_model.png -f png -p0 -b20 -s3 ./content/lecture10/assets/neuron.drawio
gen_diag ./content/lecture10/assets/neuron_scheme.png -f png -p1 -b20 -s4 ./content/lecture10/assets/neuron.drawio
gen_diag ./content/lecture10/assets/neuron_scheme2.png -f png -p2 -b20 -s4 ./content/lecture10/assets/neuron.drawio
gen_diag ./content/lecture10/assets/ann.png -f png -p0 -b20 -s3 ./content/lecture10/assets/ann.drawio
gen_diag ./content/lecture10/assets/mlp.png -f png -p0 -b20 -s3 ./content/lecture10/assets/mlp.drawio
gen_diag ./content/lecture10/assets/back_prop_simple.png -f png -p0 -b20 -s4 ./content/lecture10/assets/back_prop_simple.drawio
gen_diag ./content/lecture10/assets/back_prop.png -f png -p0 -b20 -s4 ./content/lecture10/assets/back_prop.drawio
gen_diag ./content/lecture10/assets/back_prop_mlp.png -f png -p0 -b20 -s4 ./content/lecture10/assets/back_prop_mlp.drawio

gen_diag ./content/tutorial10/assets/ex9_1.png -f png -p0 -b20 -s3 ./content/tutorial10/assets/ex8_1.drawio
gen_diag ./content/tutorial10/assets/ex9_3.png -f png -p0 -b20 -s3 ./content/tutorial10/assets/ex8_3.drawio
gen_diag ./content/tutorial10/assets/ex9_3_1.png -f png -p1 -b20 -s3 ./content/tutorial10/assets/ex8_3.drawio
gen_diag ./content/tutorial10/assets/example_mlp1.png -f png -p0 -b20 -s3 ./content/tutorial10/assets/example.drawio
gen_diag ./content/tutorial10/assets/example_mlp2.png -f png -p1 -b20 -s3 ./content/tutorial10/assets/example.drawio

gen_diag ./content/lecture11/assets/early_stopping.png -f png -p1 -b20 -s3 ./content/lecture11/assets/early_stopping.drawio
gen_diag ./content/lecture11/assets/conv.png -f png -p1 -b20 -s3 ./content/lecture11/assets/conv.drawio
gen_gif ./content/lecture11/assets/conv.gif 0 3 100 -b20 -s3 ./content/lecture11/assets/conv_anim.drawio
gen_gif ./content/lecture11/assets/conv_multi_input.gif 0 3 100 -b20 -s3 ./content/lecture11/assets/conv_multi_input_anim.drawio
gen_gif ./content/lecture11/assets/conv_multi_chan.gif 0 3 100 -b20 -s3 ./content/lecture11/assets/conv_multi_chan_anim.drawio
gen_gif ./content/lecture11/assets/padding.gif 0 5 100 -b20 -s3 ./content/lecture11/assets/padding.drawio
gen_gif ./content/lecture11/assets/stride.gif 0 2 100 -b20 -s3 ./content/lecture11/assets/stride.drawio
gen_gif ./content/lecture11/assets/dilation.gif 0 2 100 -b20 -s3 ./content/lecture11/assets/dilation.drawio
gen_gif ./content/lecture11/assets/max_pooling.gif 0 2 100 -b20 -s3 ./content/lecture11/assets/max_pooling.drawio
gen_diag ./content/lecture11/assets/vgg16.png -f png -p1 -b20 -s2 ./content/lecture11/assets/vgg16.drawio
gen_gif ./content/lecture11/assets/receptive_field.gif 0 3 100 -b20 -s3 ./content/lecture11/assets/receptive_field.drawio
gen_diag ./content/lecture11/assets/horizontal_filter.png -f png -p1 -b20 -s2 ./content/lecture11/assets/horizontal_filter.drawio
gen_diag ./content/lecture11/assets/conv_illustration.png -f png -p1 -b20 -s2 ./content/lecture11/assets/conv_illustration.drawio
gen_diag ./content/lecture11/assets/conv_illustration.png -f png -p1 -b20 -s2 ./content/lecture11/assets/conv_illustration.drawio
gen_diag ./content/lecture11/assets/batch_norm.png -f png -p1 -b20 -s2 ./content/lecture11/assets/batch_norm.drawio

gen_diag ./content/tutorial11/assets/init_network.png -f png -p1 -b20 -s3 ./content/tutorial11/assets/init_network.drawio
gen_diag ./content/tutorial11/assets/ex_09_1_network.png -f png -p1 -b20 -s3 ./content/tutorial11/assets/ex_09_1_network.drawio
gen_diag ./content/tutorial11/assets/ex_09_1_1_1.png -f png -p1 -b20 -s3 ./content/tutorial11/assets/ex_09_1_1_1.drawio
gen_diag ./content/tutorial11/assets/ex_09_1_1_2.png -f png -p1 -b20 -s3 ./content/tutorial11/assets/ex_09_1_1_2.drawio
gen_diag ./content/tutorial11/assets/lenet_arch2.png -f png -p1 -b20 -s3 ./content/tutorial11/assets/lenet.drawio

gen_diag ./content/lecture12/assets/course_diagram.png -f png -p10 -b20 -s3 ./content/assets/course_diagram.drawio
gen_diag ./content/lecture12/assets/encoder_decoder.png -f png -p0 -b20 -s3 ./content/lecture12/assets/encoder_decoder.drawio
gen_diag ./content/lecture12/assets/pca_remove_mean.png -f png -p0 -b20 -s3 ./content/lecture12/assets/pca_remove_mean.drawio
gen_diag ./content/lecture12/assets/pca_project.png -f png -p0 -b20 -s3 ./content/lecture12/assets/pca_project.drawio
gen_diag ./content/lecture12/assets/pca_transform.png -f png -p0 -b20 -s3 ./content/lecture12/assets/pca_transform.drawio
gen_diag ./content/lecture12/assets/pca_recon_error.png -f png -p0 -b20 -s3 ./content/lecture12/assets/pca_recon_error.drawio
gen_diag ./content/lecture12/assets/pca.png -f png -p0 -b20 -s3 ./content/lecture12/assets/pca.drawio

gen_diag ./content/lecture13/assets/workflow.png -f png -p10 -b20 -s3 -t ./content/lecture13/assets/workflow.drawio