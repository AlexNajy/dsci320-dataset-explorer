import pandas as pd

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
    "id", "code", "class", "category", "type",
    "group", "label", "status", "rank", "tier",
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