import json, re, os

INPUT_PATH = r'C:/HASHEM/diccionario_biblico.txt'
OUTPUT_PATH = r'C:/HASHEM/rabi_dictionary.json'

entries = []
current_term = None
current_def_lines = []

# Helper to detect term lines: uppercase words possibly with spaces, no punctuation, length reasonable
term_pattern = re.compile(r'^[A-ZÁÉÍÓÚÑÜ\s]{2,40}$')

with open(INPUT_PATH, encoding='utf-8') as f:
    for line in f:
        line = line.rstrip('\n')
        if term_pattern.match(line.strip()):
            # Save previous entry
            if current_term:
                definition = ' '.join(current_def_lines).strip()
                # Extract verse references like <number> (e.g., <400123>)
                verses = re.findall(r'<(\d{5,})>', definition)
                entries.append({
                    'term': current_term,
                    'definition': definition,
                    'verses': verses
                })
            # Start new entry
            current_term = line.strip()
            current_def_lines = []
        else:
            if line.strip():
                current_def_lines.append(line.strip())

# Add last entry
if current_term:
    definition = ' '.join(current_def_lines).strip()
    verses = re.findall(r'<(\d{5,})>', definition)
    entries.append({
        'term': current_term,
        'definition': definition,
        'verses': verses
    })

# Write JSON
with open(OUTPUT_PATH, 'w', encoding='utf-8') as out:
    json.dump(entries, out, ensure_ascii=False, indent=2)

print(f'Parsed {len(entries)} entries, output written to {OUTPUT_PATH}')
