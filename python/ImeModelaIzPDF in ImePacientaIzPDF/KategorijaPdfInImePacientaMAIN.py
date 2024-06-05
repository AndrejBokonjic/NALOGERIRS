
import sys
import json

from pdfNameExtraction import get_patient_name
from pdfKategorizacija import categorize_pdf

if __name__ == "__main__":
    try:
        file_path = sys.argv[1]
        category = categorize_pdf(file_path)
        ime_pacienta = get_patient_name(file_path)

        kategorija_in_imePacienta = {
            "category": category,
            "patient_name": ime_pacienta
        }

        print(json.dumps(kategorija_in_imePacienta))

    except Exception as e:
        error_message = {"error": str(e)}
        print(json.dumps(error_message))
        sys.exit(1)
