import pandas as pd
import json
import os

SRC_DIR = os.path.dirname(os.path.abspath(__file__))
TRACKER_PATH = os.path.join(SRC_DIR, "..", "data", "tracked", "dataset_tracker.csv")
OUTPUT_PATH = os.path.join(SRC_DIR, "..", "docs", "data.json")

def build_site_data():
    df = pd.read_csv(TRACKER_PATH)
    df.to_json(OUTPUT_PATH, orient="records", indent=2)
    print(f"build_site_data: saved {len(df)} rows to {OUTPUT_PATH}")

if __name__ == "__main__":
    build_site_data()