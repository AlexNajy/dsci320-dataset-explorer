const CATEGORICAL_UNIQUE_THRESHOLD = 10;

const GEO_KEYWORDS = [
  "latitude", "longitude", "lat", "lon", "lng",
  "city", "state", "country", "nation",
  "zipcode", "zip", "postal_code",
  "region", "province", "district", "borough",
  "iso_code", "isocode", "noc", "fips",
  "location", "locationid", "address",
  "continent", "territory",
];

const TEMPORAL_KEYWORDS = [
  "date", "time", "year", "month", "day", "timestamp", "datetime",
];

const CATEGORICAL_KEYWORDS = [
  "id", "code", "class", "category", "type",
  "group", "label", "status", "rank", "tier",
];

const MEETS_MINIMUM_THRESHOLDS = {
  quantitative: 12,
  categorical: 4,
  temporal: 2,
  geographic: 2,
};

function toSnake(name) {
  const s1 = name.replace(/(.)([A-Z][a-z]+)/g, "$1_$2");
  const s2 = s1.replace(/([a-z0-9])([A-Z])/g, "$1_$2");
  return s2.toLowerCase();
}

function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function containsKeyword(colName, keywords) {
  const name = toSnake(colName);
  return keywords.some(kw => new RegExp(`(^|_)${escapeRegExp(kw)}($|_)`).test(name));
}

// pandas' read_csv() treats these literal strings as NaN by default, regardless of
// declared dtype — matching that so a column of "23, NA, 41, NA" is still recognized
// as numeric here the same way it is in the Python pipeline.
const PANDAS_NA_VALUES = new Set([
  "", "#n/a", "#n/a n/a", "#na", "-1.#ind", "-1.#qnan", "-nan",
  "1.#ind", "1.#qnan", "<na>", "n/a", "na", "null", "nan", "none",
]);

function isMissing(value) {
  if (value === null || value === undefined) return true;
  return PANDAS_NA_VALUES.has(String(value).trim().toLowerCase());
}

function isNumericValue(value) {
  return /^-?\d+(\.\d+)?([eE][-+]?\d+)?$/.test(String(value).trim());
}

function isNumericColumn(values) {
  const present = values.filter(v => !isMissing(v));
  if (present.length === 0) return false;
  return present.every(isNumericValue);
}

function countUnique(values) {
  return new Set(values.filter(v => !isMissing(v))).size;
}

// Python's classifier also checks pandas' datetime64 dtype before falling back to
// the temporal keyword match, but build_classifications.py never parses dates on
// read (no parse_dates=), so that branch never actually fires against real data —
// keyword matching is the only path exercised in the pipeline. This mirrors that
// observed behavior rather than porting the dead branch.
function classifyColumn(values, colName) {
  if (containsKeyword(colName, GEO_KEYWORDS)) return "geographic";
  if (containsKeyword(colName, TEMPORAL_KEYWORDS)) return "temporal";

  if (isNumericColumn(values)) {
    if (containsKeyword(colName, CATEGORICAL_KEYWORDS)) return "categorical";
    if (countUnique(values) <= CATEGORICAL_UNIQUE_THRESHOLD) return "categorical";
    return "quantitative";
  }

  return "categorical";
}

function meetsMinimumCounts(counts) {
  return Object.entries(MEETS_MINIMUM_THRESHOLDS).every(
    ([type, min]) => (counts[type] || 0) >= min
  );
}
