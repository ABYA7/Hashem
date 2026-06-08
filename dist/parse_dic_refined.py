import json, re, os

INPUT_PATH = r'C:/HASHEM/diccionario_biblico.txt'
OUTPUT_PATH = r'C:/HASHEM/rabi_dictionary_refined.json'

entries = []
current_term = None
current_def_lines = []

# Heuristic for term lines:
# - Mostly uppercase (allow asterisk and spaces)
# - Length between 3 and 80 characters
# - Does not end with a period '.'
term_regex = re.compile(r'^[A-ZÁÉÍÓÚÑÜ\*\s]{3,80}$')

with open(INPUT_PATH, encoding='utf-8') as f:
    for raw_line in f:
        line = raw_line.rstrip('\n').strip()
        if not line:
            continue
        # Detect term headings
        if term_regex.match(line) and not line.endswith('.'):
            # Save previous entry
            if current_term:
                definition = ' '.join(current_def_lines).strip()
                verses = re.findall(r'<(\d{5,})>', definition)
                entries.append({
                    'term': current_term,
                    'definition': definition,
                    'verses': verses
                })
            # Start new term (remove leading asterisks)
            current_term = line.replace('*', '').strip()
            current_def_lines = []
        else:
            # Accumulate definition lines
            current_def_lines.append(line)

# Add last entry
if current_term:
    definition = ' '.join(current_def_lines).strip()
    verses = re.findall(r'<(\d{5,})>', definition)
    entries.append({
        'term': current_term,
        'definition': definition,
        'verses': verses
    })

# Write JSON (pretty printed)
with open(OUTPUT_PATH, 'w', encoding='utf-8') as out:
    json.dump(entries, out, ensure_ascii=False, indent=2)

print(f'Parsed {len(entries)} entries, output written to {OUTPUT_PATH}')
