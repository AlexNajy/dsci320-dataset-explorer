const ML_TAG_OPTIONS = ["Classification", "Regression", "Forecasting", "Clustering"];

function FilterBar() {
  return (
    <div className="filter-bar">
      <label className="filter-checkbox">
        <input type="checkbox" />
        <span>Meets minimum requirements</span>
      </label>

      <div className="filter-minimums">
        <div className="filter-field">
          <label htmlFor="min-quantitative">Min Quantitative</label>
          <input id="min-quantitative" type="number" min="0" placeholder="0" />
        </div>
        <div className="filter-field">
          <label htmlFor="min-categorical">Min Categorical</label>
          <input id="min-categorical" type="number" min="0" placeholder="0" />
        </div>
        <div className="filter-field">
          <label htmlFor="min-temporal">Min Temporal</label>
          <input id="min-temporal" type="number" min="0" placeholder="0" />
        </div>
        <div className="filter-field">
          <label htmlFor="min-geographic">Min Geographic</label>
          <input id="min-geographic" type="number" min="0" placeholder="0" />
        </div>
      </div>

      <div className="filter-tags">
        {ML_TAG_OPTIONS.map(tag => (
          <button type="button" className="filter-chip" key={tag}>{tag}</button>
        ))}
      </div>
    </div>
  );
}
