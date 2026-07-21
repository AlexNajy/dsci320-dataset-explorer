import os
import pandas as pd
from pandas.api.types import (
    is_numeric_dtype,
    is_datetime64_any_dtype
)

data_folder = "data/raw"

results = []

CATEGORICAL_UNIQUE_THRESHOLD = 10

geo_keywords = {
    "latitude", "longitude", "lat", "lon", "lng",
    "city", "state", "country",
    "zipcode", "zip", "postal_code"
}

temporal_keywords = {
    "date", "time", "year", "month", "day", "timestamp"
}

categorical_keywords = [
    "id",
    "code",
    "class",
    "category",
    "type",
    "group",
    "label",
    "status",
    "rank",
    "tier",
]


def classify_column(series, col_name):
    if any(kw in col_name.lower() for kw in geo_keywords):
        return "geographic"

    if pd.api.types.is_datetime64_any_dtype(series):
        return "temporal"

    if any(kw in col_name.lower() for kw in temporal_keywords):
        return "temporal"

    if pd.api.types.is_numeric_dtype(series):
        if any(kw in col_name.lower() for kw in categorical_keywords):
            return "categorical"
        if series.nunique() <= CATEGORICAL_UNIQUE_THRESHOLD:
            return "categorical"
        return "quantitative"

    return "categorical"

for filename in os.listdir(data_folder):
    if filename.endswith(".csv"):
        df = pd.read_csv(os.path.join(data_folder, filename))
        for col in df.columns:
            guess = classify_column(df[col], col)
            results.append({
                "dataset": filename,
                "column": col,
                "guessed_type": guess
            })

output = pd.DataFrame(results)
output.to_csv("data/metadata/column_classifications.csv", index=False)
print("Done. Saved to data/metadata/column_classifications.csv")