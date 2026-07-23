import os
import pandas as pd
from classifier import classify_column

RAW_FOLDER = "../data/raw"
OUTPUT_PATH = "../data/metadata/column_classifications.csv"

def build_classifications():
    results = []
    for filename in os.listdir(RAW_FOLDER):
        if not filename.endswith(".csv"):
            continue
        df = pd.read_csv(os.path.join(RAW_FOLDER, filename), low_memory=False)
        df.columns = df.columns.str.strip()
        for col in df.columns:
            guess = classify_column(df[col], col)
            results.append({"dataset": filename, "column": col, "guessed_type": guess})
        print(f"Classified: {filename}")

    output = pd.DataFrame(results)
    output.to_csv(OUTPUT_PATH, index=False)
    print(f"build_classifications: saved {len(output)} rows to {OUTPUT_PATH}")
    return output

    