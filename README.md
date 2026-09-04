# DSCI 320 Dataset Explorer

A searchable, filterable catalog of datasets for DSCI 320. A tool that lets students filter datasets by column type, search by topic using semantic embeddings, and see ML generated suitable results instead of browsing datasets by hand.

## Project structure

```
dsci320-dataset-explorer/
├── data/
│   ├── verified/               Verified answer key CSVs, confirming true column types (name must match the file in raw/)
│   ├── metadata/              Result of script including column classifications
│   ├── raw/                   Locally downloaded datasets as CSV files
│   ├── raw_test/              A test folder of sample data
│   └── tracked/               Includes a log of all processed data tables compared to the verified answer keys
├── src/
│   ├── classifier.py              defines classify_column() that guesses a column's type
│   ├── build_classifications.py   runs the classifier across data/raw, writes column_classifications.csv
│   ├── build_tracker.py           compares classifications against data/verified, writes dataset_tracker.csv
│   └── main.py                    runs the full pipeline in order
├── site/                      the actual website
└── docs/                      write-up and supporting documentation
```

## Setup

```
# from project root
python3 -m venv venv
source venv/bin/activate
pip install pandas
```

Every new session, re-activate the environment before running with:
```
source venv/bin/activate
```

## Running the pipeline

From the project folder:
```
cd src
python main.py
```

This runs both steps in order

## Naming rule
*data/raw/X.csv* must match *data/verified/X.csv* exactly for scoring to work.

