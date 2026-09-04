# data/raw

Raw dataset CSVs go here, one file per dataset.

These files are not tracked in Git because
some datasets exceed GitHub's 100MB file size limit.

To populate this folder:
1. Download the dataset from its source
2. Place the CSV directly in this folder and do not nest it in a subfolder
3. Filename must match the corresponding file in **data/verified/** exactly,
   if one exists, for the scoring pipeline to work