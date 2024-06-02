import pdfplumber
import re


def extract_text_near_keyword(text, keyword):
    pattern = re.compile(rf"{keyword}\s*:\s*(.*)")
    match = pattern.search(text)
    if match:
        return match.group(1).strip()
    return None


def extract_text_below_keyword(text, keyword):
    lines = text.split('\n')
    for i, line in enumerate(lines):
        if keyword in line:
            if i + 1 < len(lines):
                next_line = lines[i + 1].strip()
                words = next_line.split()
                if len(words) > 1:
                    cleaned_text = ' '.join(words[1:])
                    if cleaned_text and not any(char.isdigit() for char in cleaned_text):
                        return cleaned_text
    return None


def clean_name(name):
    name_parts = re.split(r',|\sDate/Time:', name)
    return name_parts[1].strip() + ' ' + name_parts[0].strip()


def extract_near_keywords_from_pdf(file_path):
    extracted_texts = []
    with pdfplumber.open(file_path) as pdf:
        for page in pdf.pages:
            text = page.extract_text()
            if text:
                patient_text = extract_text_near_keyword(text, "Patient")
                if patient_text:
                    cleaned_patient_text = clean_name(patient_text)
                    extracted_texts.append({"Keyword": "Patient", "Text": cleaned_patient_text})
                client_text = extract_text_below_keyword(text, "Client")
                if client_text:
                    extracted_texts.append({"Keyword": "Client", "Text": client_text})
    return extracted_texts

def get_patient_name (pdf_path):
    try:
        extracted_texts = extract_near_keywords_from_pdf(pdf_path)
        if extracted_texts:
            for text_info in extracted_texts:
                return text_info['Text']
                #print(f"{text_info['Keyword']}: {text_info['Text']}")
        else:
            print("No relevant text found.")
    except Exception as e:
        print(f"Error: {str(e)}")



