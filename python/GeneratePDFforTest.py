import json
import numpy as np
import matplotlib.pyplot as plt
from math import pi
from datetime import datetime
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from reportlab.lib.utils import ImageReader
from io import BytesIO

from reportlab.lib.units import inch


# def create_pdf_for_the_test(table_data, prediction, pacient_name, filePathToSave):
#
#
#     # dobimo podatke
#     parsed_table_data = json.loads(table_data)
#     labels = list(parsed_table_data.keys())
#     data = [float(value[0]) for value in parsed_table_data.values()]
#
#     number_labels = len(labels)
#     angles_for_labels = [n / float(number_labels) * 2 * pi for n in range(number_labels)]
#     angles_for_labels += angles_for_labels[:1]
#     data += data[:1]
#
#     fig = plt.figure(figsize=(8.27, 11.69))
#
#     if labels == ['ToT_e_m', 'ToT_m_m', 'ToT_d_m', 'Und_e_m', 'Und_m_m', 'Und_d_m', 'Over_e_m', 'Over_m_m', 'Over_d_m', 'AA_e_m', 'AA_m_m', 'AA_d_m']:
#         fig.text(0.5, 0.95, "Results from the Butterfly test", ha="center", va="center", size=16)
#     elif labels == ['HNRT_Aerr_l', 'HNRT_Cerr_l', 'HNRT_Verr_l', 'HNRT_Aerr_r', 'HNRT_Cerr_r', 'HNRT_Verr_r', 'HNRT_Aerr_f', 'HNRT_Cerr_f', 'HNRT_Verr_f', 'HNRT_Aerr_b', 'HNRT_Cerr_b', 'HNRT_Verr_b']:
#         fig.text(0.5, 0.95, "Results from the Head-Neck Relocation test", ha="center", va="center", size=16)
#
#     ax = plt.subplot2grid((6, 1), (1, 0), rowspan=3, polar=True)
#     ax.plot(angles_for_labels, data, linewidth=2, linestyle='dashed')
#
#     # Ce zelimo figuro obarvano not
#     # ax.fill(angles, data, 'b', alpha=0.1)
#     ax.set_title(pacient_name, size=20, color='grey', weight='bold')
#
#     plt.xticks(angles_for_labels[:-1], labels, color='grey', size=10)
#
#
#     min_value = min(data)
#     max_value = max(data)
#
#     if (min_value < 0):
#         step = (max_value - min_value) / 8
#         yticks = np.arange(min_value, max_value + step, step)
#     else:
#         step = max_value /8
#         yticks = np.arange(0, max_value + step, step)
#
#     #yticks = np.arange( 0 , max_value+ step, step)
#
#     ytick_labels = [str(int(y)) for y in yticks]
#
#     # kot za prikaz vrednosti (10,20,30,40,...)
#     ax.set_rlabel_position(16)
#
#     #plt.yticks([10, 20, 30, 40, 50, 60, 70, 80], ["10", "20", "30", "40", "50", "60", "70", "80"], color='grey', size=7)
#     plt.yticks(yticks, ytick_labels, color='grey', size=7)
#
#     # range of values
#     #plt.ylim(0, 80)
#     #plt.ylim(0, max_value+step)
#     plt.ylim(min_value - step, max_value + step)
#
#     for i in range(number_labels):
#         ax.plot(angles_for_labels[i], data[i], 'o', color='blue')
#
#     plt.subplot2grid((6, 1), (5, 0))
#     plt.axis('off')
#
#     if labels == ['ToT_e_m', 'ToT_m_m', 'ToT_d_m', 'Und_e_m', 'Und_m_m', 'Und_d_m', 'Over_e_m', 'Over_m_m', 'Over_d_m', 'AA_e_m', 'AA_m_m', 'AA_d_m']:
#         plt.text(0.5, 0.5, text_based_on_cluster_prediction_butterfly_model(prediction), ha='center', va='center', size=12, wrap=True)
#     elif labels == ['HNRT_Aerr_l', 'HNRT_Cerr_l', 'HNRT_Verr_l', 'HNRT_Aerr_r', 'HNRT_Cerr_r', 'HNRT_Verr_r', 'HNRT_Aerr_f', 'HNRT_Cerr_f', 'HNRT_Verr_f', 'HNRT_Aerr_b', 'HNRT_Cerr_b', 'HNRT_Verr_b']:
#         plt.text(0.5, 0.5, "VSTAVI TEKST GLEDE NAPOVED {}".format(prediction ), ha='center', va='center', size=12, wrap=True)
#
#     with PdfPages(filePathToSave) as pdf:
#         pdf.savefig(fig)


def create_graph(table_data):
    parsed_table_data = json.loads(table_data)
    labels = list(parsed_table_data.keys())
    data = [float(value[0]) for value in parsed_table_data.values()]

    number_labels = len(labels)
    angles_for_labels = [n / float(number_labels) * 2 * pi for n in range(number_labels)]
    angles_for_labels += angles_for_labels[:1]
    data += data[:1]

    # Create the graph with matplotlib
    fig = plt.figure(figsize=(6, 6), dpi=300)  # Increase dpi for higher resolution
    ax = plt.subplot(111, polar=True)
    ax.plot(angles_for_labels, data, linewidth=2, linestyle='dashed')
    # ax.set_title(pacient_name, size=20, color='grey', weight='bold')

    plt.xticks(angles_for_labels[:-1], labels, color='grey', size=10)

    min_value = min(data)
    max_value = max(data)

    if min_value < 0:
        step = (max_value - min_value) / 8
        yticks = np.arange(min_value, max_value + step, step)
    else:
        step = max_value / 8
        yticks = np.arange(0, max_value + step, step)

    ytick_labels = [str(int(y)) for y in yticks]
    ax.set_rlabel_position(16)
    plt.yticks(yticks, ytick_labels, color='grey', size=7)
    plt.ylim(min_value - step, max_value + step)

#     for i in range(number_labels):
#         ax.plot(angles_for_labels[i], data[i], 'o', color='blue')
    ax.plot(angles_for_labels[:-1], data[:-1], 'o', color='blue', label='Patient Data Points')

    # --- PRIKAZ MEDIAN ---
    if labels == ['ToT_e_m', 'ToT_m_m', 'ToT_d_m', 'Und_e_m', 'Und_m_m', 'Und_d_m', 'Over_e_m', 'Over_m_m', 'Over_d_m', 'AA_e_m', 'AA_m_m', 'AA_d_m']:
        median_data = [62.76, 28.97, 13.87, 26.895, 50.475, 65.64, 8.74, 19.71, 20.455, 2.02, 3.64, 5.38]
    elif labels == labels == ['HNRT_Aerr_l', 'HNRT_Cerr_l', 'HNRT_Verr_l', 'HNRT_Aerr_r', 'HNRT_Cerr_r', 'HNRT_Verr_r', 'HNRT_Aerr_f', 'HNRT_Cerr_f', 'HNRT_Verr_f', 'HNRT_Aerr_b', 'HNRT_Cerr_b', 'HNRT_Verr_b']:
        median_data = [2.81, -0.435, 1.985, 3.165, -1.265, 1.865, 2.655, 1.105, 1.865, 3.69, -1.995, 2.345]

    median_data += median_data[:1]
    ax.plot(angles_for_labels, median_data, linewidth=2, linestyle='dashed') # label='Median data'
    # for i in range(number_labels):
    #   ax.plot(angles_for_labels[i], median_data[i], 'o', color='red', label='')

    ax.plot(angles_for_labels[:-1], median_data[:-1], 'o', color='red', label='Median Data Points')

    # - - - - - - - - - -

    ax.legend(loc='lower right', bbox_to_anchor=(1.10, -0.16))

    buf = BytesIO()
    plt.savefig(buf, format='png', dpi=450)
    plt.close(fig)
    buf.seek(0)
    image = ImageReader(buf)

    return image, labels


def create_pdf_for_the_test(table_data, prediction, pacient_name, filePathToSave):

    image, labels = create_graph(table_data)

    # reportlab-kreiranje pdf
    c = canvas.Canvas(filePathToSave, pagesize=A4)
    width, height = A4

    # 1 Stran
    if labels == ['ToT_e_m', 'ToT_m_m', 'ToT_d_m', 'Und_e_m', 'Und_m_m', 'Und_d_m', 'Over_e_m', 'Over_m_m', 'Over_d_m',
                  'AA_e_m', 'AA_m_m', 'AA_d_m']:
        c.setFont("Helvetica-Bold", 25)
        c.drawCentredString(width / 2, height - 300, "Results from the Butterfly Test")
    elif labels == ['HNRT_Aerr_l', 'HNRT_Cerr_l', 'HNRT_Verr_l', 'HNRT_Aerr_r', 'HNRT_Cerr_r', 'HNRT_Verr_r',
                    'HNRT_Aerr_f', 'HNRT_Cerr_f', 'HNRT_Verr_f', 'HNRT_Aerr_b', 'HNRT_Cerr_b', 'HNRT_Verr_b']:
        c.setFont("Helvetica-Bold", 25)
        c.drawCentredString(width / 2, height - 300, "Results from the Head-Neck Relocation Test")

    c.setFont("Helvetica", 12)
    c.drawCentredString(width / 2, 120, f"Date: {datetime.now().strftime('%d-%m-%Y')}")
    c.drawCentredString(width / 2, 100, f"Patient Name: {pacient_name}")
    # height - 450

    c.showPage()

    # 2 Stran
    c.setFont("Helvetica-Bold", 18)
    c.drawCentredString(width / 2, height - 50, "Results")

    # Embed the graph image
    image_width = 6 * inch
    image_height = 6 * inch

    # Calculate the x-coordinate for centering the image horizontally
    x_coordinate = (width - image_width) / 2

    c.drawImage(image, x_coordinate, height / 2 - image_height / 2 + 150, image_width, image_height,
                preserveAspectRatio=True)

    # Izpisemo text iz napoved
    c.setFont("Helvetica", 12)
    text = ""
    if labels == ['ToT_e_m', 'ToT_m_m', 'ToT_d_m', 'Und_e_m', 'Und_m_m', 'Und_d_m', 'Over_e_m', 'Over_m_m', 'Over_d_m',
                  'AA_e_m', 'AA_m_m', 'AA_d_m']:
        text = text_based_on_cluster_prediction_butterfly_model(prediction)
    elif labels == ['HNRT_Aerr_l', 'HNRT_Cerr_l', 'HNRT_Verr_l', 'HNRT_Aerr_r', 'HNRT_Cerr_r', 'HNRT_Verr_r',
                    'HNRT_Aerr_f', 'HNRT_Cerr_f', 'HNRT_Verr_f', 'HNRT_Aerr_b', 'HNRT_Cerr_b', 'HNRT_Verr_b']:
        text = text_based_on_cluster_prediction_headNeckRelocation_model(prediction) #f"VSTAVI TEKST GLEDE NAPOVED {prediction}"

    margin = 70
    max_width = width - 2 * margin
    text_lines = split_text_in_multiple_lines(text, max_width, c)

    y_position = 280
    for line in text_lines:
        c.drawString(margin, y_position, line)
        y_position -= 15

    # SIGNATURE
    signature_text_width = c.stringWidth("Signature", "Helvetica-Bold", 12)
    c.setFont("Helvetica-Bold", 12)
    c.drawRightString(width - 200, 100, "Signature")

    line_length = 100
    line_start_x = width - 200 - signature_text_width - 10  # Adjusted for spacing
    line_end_x = width - 100
    c.line(line_start_x, 50, line_end_x, 50)

    c.showPage()
    c.save()


def split_text_in_multiple_lines(text, max_width, canvas):
    words = text.split()
    lines = []
    current_line = ""
    for word in words:
        test_line = f"{current_line} {word}".strip()
        if canvas.stringWidth(test_line, "Helvetica", 12) <= max_width:
            current_line = test_line
        else:
            lines.append(current_line)
            current_line = word
    if current_line:
        lines.append(current_line)
    return lines


def text_based_on_cluster_prediction_butterfly_model(prediction):
    switcher = {
        # cluster 1
        0: "Level 3 - Larger movement deficits; Stays less time and further away from the target, with high undershoot, most prominent feature is high overshoot; presents with mild to moderate pain levels.",
        1: "Level 4 - Largest movement deficits; stays least time and furthest away from the target, with highest undershoot (all difficulty levels, with significantly affected performance already at easy level) and overshoot; presents with moderate to severe pain levels.",
        2: "Level 2 - Smaller movement deficits; stays considerable amount of time and close to the target, has high undershoot at medium and difficult level and smallest overshoot at all difficulty levels; presents with mild to moderate pain levels.",
        3: "Level 1 - Smallest movement deficits; stays most time and closest to the target, with lowest overshoot and low undershoot; presents with mild to moderate pain levels.",
    }
    return switcher.get(prediction, "error")

def text_based_on_cluster_prediction_headNeckRelocation_model (prediction):
    switcher = {
        0: "More severe impairment.",
        1: "Less severe impairment.",
    }
    return switcher.get(prediction, "error")