def tag_ml_suitability(dataset_columns):
    tags = []
    reasons = {}

    num_quant = sum(1 for c in dataset_columns if c["guessed_type"] == "quantitative")
    num_temporal = sum(1 for c in dataset_columns if c["guessed_type"] == "temporal")

    # Classification: categorical column with 2-10 unique values = realistic target
    for c in dataset_columns:
        if c["guessed_type"] == "categorical" and 2 <= c["nunique"] <= 10:
            tags.append("classification")
            reasons["classification"] = (
                f"categorical column '{c['column']}' has {c['nunique']} unique values, "
                f"suitable as a classification target"
            )
            break  

    # Regression: enough quantitative columns to plausibly have a numeric target
    if num_quant >= 12:
        tags.append("regression")
        reasons["regression"] = f"{num_quant} quantitative columns available as potential targets/features"

    # Forecasting: has a real time axis
    if num_temporal >= 2:
        tags.append("forecasting")
        reasons["forecasting"] = f"{num_temporal} temporal columns present, allowing time-based analysis"

    # Clustering: rich numeric features, but no obvious target
    if num_quant >= 6 and "regression" not in tags:
        tags.append("clustering")
        reasons["clustering"] = f"{num_quant} quantitative columns present, no obvious target variable"

    if not tags:
        tags.append("exploratory only")
        reasons["exploratory only"] = "insufficient structural variety for an ML task"

    return tags, reasons