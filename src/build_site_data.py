import pandas as pd
import json
import os
from sentence_transformers import SentenceTransformer

SRC_DIR = os.path.dirname(os.path.abspath(__file__))
TRACKER_PATH = os.path.join(SRC_DIR, "..", "data", "tracked", "dataset_tracker.csv")
OUTPUT_PATH = os.path.join(SRC_DIR, "..", "docs", "data.json")

# Must match client-side Xenova/all-MiniLM-L6-v2 or vectors aren't comparable.
EMBEDDING_MODEL = "all-MiniLM-L6-v2"

def build_site_data():
    df = pd.read_csv(TRACKER_PATH)

    model = SentenceTransformer(EMBEDDING_MODEL)
    descriptions = df["description"].fillna("").tolist()
    embeddings = model.encode(descriptions, normalize_embeddings=True)  # unit vectors -> dot product = cosine sim
    df["description_embedding"] = embeddings.tolist()

    df.to_json(OUTPUT_PATH, orient="records", indent=2)
    print(f"build_site_data: saved {len(df)} rows to {OUTPUT_PATH}")

if __name__ == "__main__":
    build_site_data()