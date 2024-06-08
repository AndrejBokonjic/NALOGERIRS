import os
from openpyxl import Workbook
from tkinter import messagebox

def create_excel_file(filename):
    wb = Workbook()
    ws = wb.active
    ws.title = "Sheet 1"

    headers = [
        'Priimek', 'Ime', 'Cluster Butterfly test', 'ToT_e_m', 'ToT_m_m', 'ToT_d_m',
        'Und_e_m', 'Und_m_m', 'Und_d_m', 'Over_e_m', 'Over_m_m', 'Over_d_m', 'AA_e_m', 'AA_m_m',
        'AA_d_m', 'Cluster_HNRT', 'HNRT_Aerr_l', 'HNRT_Cerr_l', 'HNRT_Verr_l', 'HNRT_Aerr_r',
        'HNRT_Cerr_r', 'HNRT_Verr_r', 'HNRT_Aerr_f', 'HNRT_Cerr_f', 'HNRT_Verr_f',
        'Sagital_f', 'Transverse_f', 'Frontal_f',
        'Sagital_E', 'Transverse_E', 'Frontal_E',
        'Sagital_Rot', 'Transverse_Rot', 'Frontal_Rot'
    ]

    ws.append(headers)
    wb.save(filename)

if __name__ == "__main__":
    desktop = os.path.join(os.path.join(os.environ['USERPROFILE']), 'Desktop') 
    file_path = os.path.join(desktop, "DataBase.xlsx")
    create_excel_file(file_path)
    messagebox.showinfo("Info", f"Excel file created successfully at {file_path}")
