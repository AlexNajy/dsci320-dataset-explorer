# DSCI 320 Dataset Explorer

A searchable, filterable catalog of datasets for DSCI 320. A tool that lets students filter datasets by column type, search by topic using semantic embeddings, and see ML generated suitable results instead of browsing datasets by hand.

## Project structure

```
dsci320-dataset-explorer/
├── data/
│   ├── abstractions/          Answer Key for CSVs that include an abstraction (name must match the file in raw/)
│   ├── metadata/              Result of script including column classifications
│   ├── raw/                   Downloaded datasets as CSV files
│   ├── raw_test/              A test folder of sample data
│   └── tracked/               Includes a log of all processed data tables compared to potential abstractions
├── src/
│   ├── classifier.py              defines classify_column() that guesses a column's type
│   ├── build_classifications.py   runs the classifier across data/raw, writes column_classifications.csv
│   ├── build_tracker.py           compares classifications against data/abstractions, writes dataset_tracker.csv
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
*data/raw/X.csv* must match *data/abstractions/X.csv* exactly for scoring to work.

## Current Issues

- Columns **animeID** and **rank** are forced to categorical because their name contains "id" or "rank", even when they are quantitative.
- Temporal columns like **aired** and **premiered** don't contain an obvious date keyword so they fall through to categorical.
- A real quantitative column with few unique values (e.g. **duration**) gets miscaught as categorical.
- keyword matching isn't aware of word boundaries, so **related** matches the "lat" inside it and gets tagged geographic.

## Notes
For a future system that has to automatically intake and classify new datasets use AI to catch classification discrepencies 

