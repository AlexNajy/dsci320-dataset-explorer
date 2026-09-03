const ML_TAG_OPTIONS = ["Classification", "Regression", "Forecasting", "Clustering"];

const MIN_FIELDS = [
  { key: "minQuantitative", dataKey: "num_quantitative", label: "Min Quantitative" },
  { key: "minCategorical", dataKey: "num_categorical", label: "Min Categorical" },
  { key: "minTemporal", dataKey: "num_temporal", label: "Min Temporal" },
  { key: "minGeographic", dataKey: "num_geographic", label: "Min Geographic" },
];

function FilterBar({ filters, onChange, onToggleTag }) {
  return (
    <div className="filter-bar">
      <label className="filter-checkbox">
        <input
          type="checkbox"
          checked={filters.meetsMinOnly}
          onChange={e => onChange("meetsMinOnly", e.target.checked)}
        />
        <span>Meets minimum requirements</span>
      </label>

      <div className="filter-minimums">
        {MIN_FIELDS.map(({ key, label }) => (
          <div className="filter-field" key={key}>
            <label htmlFor={key}>{label}</label>
            <input
              id={key}
              type="number"
              min="0"
              placeholder="0"
              value={filters[key]}
              onChange={e => onChange(key, e.target.value)}
            />
          </div>
        ))}
      </div>

      <div className="filter-tags">
        {ML_TAG_OPTIONS.map(tag => (
          <button
            type="button"
            className={`filter-chip${filters.tags.includes(tag) ? " active" : ""}`}
            key={tag}
            onClick={() => onToggleTag(tag)}
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
}
