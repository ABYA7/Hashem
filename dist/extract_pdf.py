import sys
from pdfminer.high_level import extract_text
pdf_path = r'C:/HASHEM/DICCIONARIO BIBLICO.pdf'
output_path = r'C:/HASHEM/diccionario_biblico.txt'
text = extract_text(pdf_path)
with open(output_path, 'w', encoding='utf-8') as f:
    f.write(text)
print('Extraction completed, output written to', output_path)
