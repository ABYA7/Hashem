import os
from pdfminer.high_level import extract_text

pdf_path = r'C:/HASHEM/DICCIONARIO BIBLICO.pdf'
txt_path = r'C:/HASHEM/diccionario_raw.txt'
json_path = r'C:/HASHEM/data/diccionario_rabi.json'

# Extract PDF to plain text
text = extract_text(pdf_path)
with open(txt_path, 'w', encoding='utf-8') as f:
    f.write(text)

# Simple parsing: assume entries separated by two newlines, first line is term, rest is definition
entries = []
for block in text.split('\n\n'):
    lines = block.strip().split('\n')
    if len(lines) >= 2:
        term = lines[0].strip()
        definition = '\n'.join(lines[1:]).strip()
        if term and definition:
            entries.append({
                "termino": term,
                "definicion": definition,
                "referencias": []
            })

import json
with open(json_path, 'w', encoding='utf-8') as f:
    json.dump(entries, f, ensure_ascii=False, indent=2)

print('Extracted', len(entries), 'entries to', json_path)
