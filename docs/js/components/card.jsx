const MEETS_MIN_TOOLTIP = "Course requirements: 12+ quantitative, 4+ categorical, 2+ temporal, 2+ geographic columns";

function parseTags(tagsString) {
    return (tagsString || "")
      .split(",")
      .map(t => t.trim())
      .filter(Boolean);
  }

  function StatItem({ label, value }) {
    return (
      <div className="stat-item">
        <span className="stat-label">{label}</span>
        <span className="stat-value">{value}</span>
      </div>
    );
  }
  
  function TagRow({ tagsString, reasonsString }) {
    const tags = parseTags(tagsString);
    const reasons = parseMlReasons(reasonsString);

    if (tags.length === 0) return null;

    return (
      <div className="tag-row">
        {tags.map(tag => (
          <span className="tag-chip" key={tag} title={reasons[tag.toLowerCase()] || "No justification recorded."}>
            {tag}
          </span>
        ))}
      </div>
    );
  }
  
  function DatasetCard({ dataset, onSelect }) {
    const passes = dataset.meets_minimum === true;

    return (
      <div
        className="dataset-card dataset-card-clickable"
        role="button"
        tabIndex={0}
        onClick={() => onSelect(dataset)}
        onKeyDown={e => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onSelect(dataset);
          }
        }}
      >
        <div className="card-body">
          <div className="card-name">{dataset.name}</div>
          <div className="stat-grid">
            <StatItem label="Quantitative" value={dataset.num_quantitative} />
            <StatItem label="Categorical" value={dataset.num_categorical} />
            <StatItem label="Temporal" value={dataset.num_temporal} />
            <StatItem label="Geographic" value={dataset.num_geographic} />
          </div>
          <TagRow tagsString={dataset.ml_tags} reasonsString={dataset.ml_reasons} />
          <span className={`status-badge ${passes ? "pass" : "fail"}`} title={MEETS_MIN_TOOLTIP}>
            {passes ? "Meets course requirements" : "Below course requirements"}
          </span>
        </div>
      </div>
    );
  }
  
  function UploadCard({ onClick }) {
    return (
      <div
        className="dataset-card upload-card"
        role="button"
        tabIndex={0}
        onClick={onClick}
        onKeyDown={e => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onClick();
          }
        }}
      >
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
          <path d="M12 5V19" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          <path d="M5 12H19" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
        <span className="upload-label">Upload a Dataset</span>
      </div>
    );
  }