import pdfplumber
import sys

def categorize_pdf(file_path):
    with pdfplumber.open(file_path) as pdf:
        for page in pdf.pages:
            text = page.extract_text()


            if "The Butterfly Test" in text or "Butterfly-method" in text:
                return "Butterfly test"
            elif "Head-Neck Relocation Test" in text or "Joint position error" in text:   # IF USLOVI
                return "Head neck relocation test"
            elif "Range of motion" in text or "Range Of Motion" in text:
                return "Range of motion"

    return "Unknown"

if __name__ == "__main__":
    file_path = sys.argv[1]
    category = categorize_pdf(file_path)
    print(category)
