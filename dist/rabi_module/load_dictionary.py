import json
import os
from typing import List, Dict

# Path to the JSON dictionary (relative to this script)
DATA_PATH = os.path.join(os.path.dirname(__file__), "data", "rabi_dictionary.json")

def load_dictionary() -> List[Dict]:
    """Load the RABI dictionary JSON file and return a list of entries."""
    with open(DATA_PATH, "r", encoding="utf-8") as f:
        return json.load(f)

def search_term(term: str) -> List[Dict]:
    """Search for entries where the term matches (case‑insensitive)."""
    entries = load_dictionary()
    term_lower = term.lower()
    return [e for e in entries if e.get("term", "").lower() == term_lower]

if __name__ == "__main__":
    # Simple CLI: print number of entries and optional search
    import argparse
    parser = argparse.ArgumentParser(description="Load and query the RABI dictionary.")
    parser.add_argument("-s", "--search", help="Term to search for.")
    args = parser.parse_args()
    data = load_dictionary()
    print(f"Total entries in dictionary: {len(data)}")
    if args.search:
        matches = search_term(args.search)
        if matches:
            for entry in matches:
                print("\nTerm:", entry.get("term"))
                print("Definition:", entry.get("definition"))
                print("Verses:", entry.get("verses"))
        else:
            print(f"No entry found for term: {args.search}")
