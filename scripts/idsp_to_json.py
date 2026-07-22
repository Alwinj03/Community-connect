"""
idsp_to_json.py
Converts manually prepared sample IDSP CSV data into JSON format for the UI.
"""
import csv
import json

def convert_csv_to_json(csv_path, json_path):
    data = []
    with open(csv_path, mode='r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            data.append(row)
            
    with open(json_path, mode='w', encoding='utf-8') as f:
        json.dump(data, f, indent=4)
        
    print(f"Converted {len(data)} rows from {csv_path} to {json_path}")

if __name__ == "__main__":
    convert_csv_to_json('../data/sample_idsp.csv', '../data/parsed_idsp.json')
