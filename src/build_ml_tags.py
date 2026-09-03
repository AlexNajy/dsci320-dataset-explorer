import pandas as pd
import os
from ml_tagger import tag_ml_suitability

SRC_DIR = os.path.dirname(os.path.abspath(__file__))
RAW_FOLDER = os.path.join(SRC_DIR, "..", "data", "raw")
CLASSIFICATIONS_PATH = os.path.join(SRC_DIR, "..", "data", "metadata", "column_classifications.csv")
TRACKER_PATH = os.path.join(SRC_DIR, "..", "data", "tracked", "dataset_tracker.csv")

def build_ml_tags():
    classifications = pd.read_csv(CLASSIFICATIONS_PATH)
    tracker = pd.read_csv(TRACKER_PATH)

    ml_tags_list = []
    ml_reasons_list = []

    for _, tracker_row in tracker.iterrows():
        filename = os.path.basename(tracker_row["filepath"])
        raw_path = os.path.join(RAW_FOLDER, filename)

        dataset_classifications = classifications[classifications["dataset"] == filename]

        if not os.path.exists(raw_path) or dataset_classifications.empty:
            ml_tags_list.append("")
            ml_reasons_list.append({})
            continue

        df = pd.read_csv(raw_path, low_memory=False)

        dataset_columns = []
        for _, row in dataset_classifications.iterrows():
            col = row["column"]
            gtype = row["guessed_type"]
            nunique = df[col].nunique() if col in df.columns else 0
            dataset_columns.append({"column": col, "guessed_type": gtype, "nunique": nunique})

        tags, reasons = tag_ml_suitability(dataset_columns)
        ml_tags_list.append(", ".join(tags))
        ml_reasons_list.append(reasons)

    tracker["ml_tags"] = ml_tags_list
    tracker["ml_reasons"] = ml_reasons_list

    tracker.to_csv(TRACKER_PATH, index=False)
    print(f"build_ml_tags: added ML tags to {len(tracker)} rows in {TRACKER_PATH}")

if __name__ == "__main__":
    build_ml_tags()