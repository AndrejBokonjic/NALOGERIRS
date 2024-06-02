
import sys
import json

from pdfNameExtraction import get_patient_name
from pdfKategorizacija import categorize_pdf

if __name__ == "__main__":
    file_path = sys.argv[1]
    category = categorize_pdf(file_path)

    ime_pacienta = get_patient_name(file_path)

    kategorija_in_imePacienta = {
        "category": category,
        "patient_name": ime_pacienta
    }

    print(json.dumps(kategorija_in_imePacienta))
