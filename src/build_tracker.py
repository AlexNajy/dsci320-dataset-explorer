import os
import pandas as pd

RAW_FOLDER = "../data/raw"
ABSTRACTIONS_FOLDER = "../data/abstractions"
CLASSIFICATIONS_PATH = "../data/metadata/column_classifications.csv"
OUTPUT_PATH = "../data/tracked/dataset_tracker.csv"

def build_tracker():
    classifications = pd.read_csv(CLASSIFICATIONS_PATH)
    rows = []

    for filename in os.listdir(RAW_FOLDER):
        if not filename.endswith(".csv"):
            continue

        base_name = filename[:-4]
        filepath = os.path.join(RAW_FOLDER, filename)
        num_columns = len(pd.read_csv(filepath, nrows=0).columns)

        answer_key_path = os.path.join(ABSTRACTIONS_FOLDER, f"{base_name}.csv")
        has_abstraction = os.path.exists(answer_key_path)

        correct_guesses = None
        incorrect_guesses = None

        if has_abstraction:
            answer_key = pd.read_csv(answer_key_path)
            answer_dict = dict(zip(answer_key["column"], answer_key["true_type"]))
            dataset_guesses = classifications[classifications["dataset"] == filename]

            correct = incorrect = 0
            for _, row in dataset_guesses.iterrows():
                true_type = answer_dict.get(row["column"])
                if true_type is None:
                    continue
                if row["guessed_type"] == true_type:
                    correct += 1
                else:
                    incorrect += 1
            correct_guesses, incorrect_guesses = correct, incorrect

        rows.append({
            "name": base_name,
            "filepath": filepath,
            "num_columns": num_columns,
            "has_abstraction": has_abstraction,
            "correct_guesses": correct_guesses,
            "incorrect_guesses": incorrect_guesses,
        })

    output = pd.DataFrame(rows)
    output.to_csv(OUTPUT_PATH, index=False)
    print(f"build_tracker: saved {len(output)} rows to {OUTPUT_PATH}")
    return output