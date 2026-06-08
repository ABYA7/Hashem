import json, re

TEXT_PATH = r'C:/HASHEM/diccionario_biblico.txt'
JSON_PATH = r'C:/HASHEM/rabi_dictionary.json'
OUTPUT_PATH = r'C:/HASHEM/rabi_dictionary_enhanced.json'

# Build mapping from placeholder ID to verse reference
id_to_ref = {}
pattern = re.compile(r'<(\d+)>\s*([^\s]+)')
with open(TEXT_PATH, encoding='utf-8') as f:
    for line in f:
        for match in pattern.finditer(line):
            vid, ref = match.groups()
            id_to_ref[vid] = ref.replace(' ', '+')  # prepare for URL

# Load existing JSON
with open(JSON_PATH, encoding='utf-8') as f:
    data = json.load(f)

# Enhance each entry
for entry in data:
    verses = entry.get('verses', [])
    enhanced = []
    for vid in verses:
        ref = id_to_ref.get(vid, '')
        if ref:
            url = f'https://www.biblegateway.com/passage/?search={ref}'
            enhanced.append({'id': vid, 'ref': ref.replace('+', ' '), 'url': url})
        else:
            enhanced.append({'id': vid, 'ref': None, 'url': None})
    entry['verses'] = enhanced

# Write enhanced JSON
with open(OUTPUT_PATH, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print('Enhanced JSON written to', OUTPUT_PATH)
