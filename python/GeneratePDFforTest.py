import json
import numpy as np
import matplotlib.pyplot as plt
from math import pi
from matplotlib.backends.backend_pdf import PdfPages




def create_pdf_for_the_test(table_data, prediction, pacient_name, filePathToSave):


    # dobimo podatke
    parsed_table_data = json.loads(table_data)
    labels = list(parsed_table_data.keys())
    data = [float(value[0]) for value in parsed_table_data.values()]

    number_labels = len(labels)
    angles_for_labels = [n / float(number_labels) * 2 * pi for n in range(number_labels)]
    angles_for_labels += angles_for_labels[:1]
    data += data[:1]

    fig = plt.figure(figsize=(8.27, 11.69))

    if labels == ['ToT_e_m', 'ToT_m_m', 'ToT_d_m', 'Und_e_m', 'Und_m_m', 'Und_d_m', 'Over_e_m', 'Over_m_m', 'Over_d_m', 'AA_e_m', 'AA_m_m', 'AA_d_m']:
        fig.text(0.5, 0.95, "Results from the Butterfly test", ha="center", va="center", size=16)
    elif labels == ['HNRT_Aerr_l', 'HNRT_Cerr_l', 'HNRT_Verr_l', 'HNRT_Aerr_r', 'HNRT_Cerr_r', 'HNRT_Verr_r', 'HNRT_Aerr_f', 'HNRT_Cerr_f', 'HNRT_Verr_f', 'HNRT_Aerr_b', 'HNRT_Cerr_b', 'HNRT_Verr_b']:
        fig.text(0.5, 0.95, "Results from the Head-Neck Relocation test", ha="center", va="center", size=16)

    ax = plt.subplot2grid((6, 1), (1, 0), rowspan=3, polar=True)
    ax.plot(angles_for_labels, data, linewidth=2, linestyle='dashed')

    # Ce zelimo figuro obarvano not
    # ax.fill(angles, data, 'b', alpha=0.1)
    ax.set_title(pacient_name, size=20, color='grey', weight='bold')

    plt.xticks(angles_for_labels[:-1], labels, color='grey', size=10)


    min_value = min(data)
    max_value = max(data)

    if (min_value < 0):
        step = (max_value - min_value) / 8
        yticks = np.arange(min_value, max_value + step, step)
    else:
        step = max_value /8
        yticks = np.arange(0, max_value + step, step)

    #yticks = np.arange( 0 , max_value+ step, step)

    ytick_labels = [str(int(y)) for y in yticks]

    # kot za prikaz vrednosti (10,20,30,40,...)
    ax.set_rlabel_position(16)

    #plt.yticks([10, 20, 30, 40, 50, 60, 70, 80], ["10", "20", "30", "40", "50", "60", "70", "80"], color='grey', size=7)
    plt.yticks(yticks, ytick_labels, color='grey', size=7)

    # range of values
    #plt.ylim(0, 80)
    #plt.ylim(0, max_value+step)
    plt.ylim(min_value - step, max_value + step)

    for i in range(number_labels):
        ax.plot(angles_for_labels[i], data[i], 'o', color='blue')

    plt.subplot2grid((6, 1), (5, 0))
    plt.axis('off')

    if labels == ['ToT_e_m', 'ToT_m_m', 'ToT_d_m', 'Und_e_m', 'Und_m_m', 'Und_d_m', 'Over_e_m', 'Over_m_m', 'Over_d_m', 'AA_e_m', 'AA_m_m', 'AA_d_m']:
        plt.text(0.5, 0.5, text_based_on_cluster_prediction_butterfly_model(prediction), ha='center', va='center', size=12, wrap=True)
    elif labels == ['HNRT_Aerr_l', 'HNRT_Cerr_l', 'HNRT_Verr_l', 'HNRT_Aerr_r', 'HNRT_Cerr_r', 'HNRT_Verr_r', 'HNRT_Aerr_f', 'HNRT_Cerr_f', 'HNRT_Verr_f', 'HNRT_Aerr_b', 'HNRT_Cerr_b', 'HNRT_Verr_b']:
        plt.text(0.5, 0.5, "VSTAVI TEKST GLEDE NAPOVED {}".format(prediction ), ha='center', va='center', size=12, wrap=True)

    with PdfPages(filePathToSave) as pdf:
        pdf.savefig(fig)


def text_based_on_cluster_prediction_butterfly_model(prediction):

    switcher = {
        # cluster 1
        0: "Level 3 - Larger movement deficits; Stays less time and further away from the target, with high undershoot, most prominent feature is high overshoot; presents with mild to moderate pain levels",
        1: "Level 4 - Largest movement deficits; stays least time and furthest away from the target, with highest undershoot (all difficulty levels, with significantly affected performance already at easy level) and overshoot; presents with moderate to severe pain levels",
        2: "Level 2 - Smaller movement deficits; stays considerable amount of time and close to the target, has high undershoot at medium and difficult level and smallest overshoot at all difficulty levels; presents with mild to moderate pain levels",
        3: "Level 1 - Smallest movement deficits; stays most time and closest to the target, with lowest overshoot and low undershoot; presents with mild to moderate pain levels",
    }
    return switcher.get(prediction, "error")
