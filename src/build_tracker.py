import os
import pandas as pd

RAW_FOLDER = "../data/raw"
VERIFIED_FOLDER = "../data/verified"
CLASSIFICATIONS_PATH = "../data/metadata/column_classifications.csv"
OUTPUT_PATH = "../data/tracked/dataset_tracker.csv"
MANUAL_METADATA_PATH = "../dataset_tracker.csv"

def build_tracker():
    classifications = pd.read_csv(CLASSIFICATIONS_PATH)
    rows = []

    for filename in os.listdir(RAW_FOLDER):
        if not filename.endswith(".csv"):
            continue

        base_name = filename[:-4]
        filepath = os.path.join(RAW_FOLDER, filename)
        num_columns = len(pd.read_csv(filepath, nrows=0).columns)

        verified_path = os.path.join(VERIFIED_FOLDER, f"{base_name}.csv")
        is_verified = os.path.exists(verified_path)

        if is_verified:
            verified_data = pd.read_csv(verified_path)
            type_counts = verified_data["true_type"].value_counts()
        else:
            dataset_guesses = classifications[classifications["dataset"] == filename]
            type_counts = dataset_guesses["guessed_type"].value_counts()

        num_quantitative = int(type_counts.get("quantitative", 0))
        num_categorical = int(type_counts.get("categorical", 0))
        num_temporal = int(type_counts.get("temporal", 0))
        num_geographic = int(type_counts.get("geographic", 0))

        meets_minimum = (
            num_quantitative >= 12 and
            num_categorical >= 4 and
            num_temporal >= 2 and
            num_geographic >= 2
        )

        rows.append({
            "name": base_name,
            "filepath": filepath,
            "num_columns": num_columns,
            "num_quantitative": num_quantitative,
            "num_categorical": num_categorical,
            "num_temporal": num_temporal,
            "num_geographic": num_geographic,
            "is_verified": is_verified,
            "meets_minimum": meets_minimum
        })

    output = pd.DataFrame(rows)

    # source_url/description are hand-verified, never computed here — read-only merge.
    manual_metadata = pd.read_csv(MANUAL_METADATA_PATH)[["name", "source_url", "description"]]
    output = output.merge(manual_metadata, on="name", how="left")

    output.to_csv(OUTPUT_PATH, index=False)
    print(f"build_tracker: saved {len(output)} rows to {OUTPUT_PATH}")
    return output