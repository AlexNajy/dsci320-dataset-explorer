import pandas as pd
import re

CATEGORICAL_UNIQUE_THRESHOLD = 10

geo_keywords = {
    "latitude", "longitude", "lat", "lon", "lng",
    "city", "state", "country", "nation",
    "zipcode", "zip", "postal_code",
    "region", "province", "district", "borough",
    "iso_code", "isocode", "noc", "fips",
    "location", "locationid", "address",
    "continent", "territory",
}

temporal_keywords = {
    "date", "time", "year", "month", "day", "timestamp", "datetime"
}

categorical_keywords = [
    "id", "code", "class", "category", "type",
    "group", "label", "status", "rank", "tier",
]

def to_snake(name):
    s1 = re.sub(r'(.)([A-Z][a-z]+)', r'\1_\2', name)
    s2 = re.sub(r'([a-z0-9])([A-Z])', r'\1_\2', s1)
    return s2.lower()

def contains_keyword(col_name, keywords):
    name = to_snake(col_name)
    return any(re.search(rf'(^|_){re.escape(kw)}($|_)', name) for kw in keywords)

def classify_column(series, col_name):
    if contains_keyword(col_name, geo_keywords):
        return "geographic"

    if pd.api.types.is_datetime64_any_dtype(series):
        return "temporal"

    if contains_keyword(col_name, temporal_keywords):
        return "temporal"

    if pd.api.types.is_numeric_dtype(series):
        if contains_keyword(col_name, categorical_keywords):
            return "categorical"
        if series.nunique() <= CATEGORICAL_UNIQUE_THRESHOLD:
            return "categorical"
        return "quantitative"

    return "categorical"