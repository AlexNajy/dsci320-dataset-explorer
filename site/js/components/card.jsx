function StatItem({ label, value }) {
    return (
      <div className="stat-item">
        <span className="stat-label">{label}</span>
        <span className="stat-value">{value}</span>
      </div>
    );
  }
  
  function TagRow({ tagsString }) {
    const tags = (tagsString || "")
      .split(",")
      .map(t => t.trim())
      .filter(Boolean);
  
    if (tags.length === 0) return null;
  
    return (
      <div className="tag-row">
        {tags.map(tag => (
          <span className="tag-chip" key={tag}>{tag}</span>
        ))}
      </div>
    );
  }
  
  function DatasetCard({ dataset }) {
    const meetsMinimum =
      dataset.meets_minimum === true ||
      dataset.meets_minimum === "True" ||
      dataset.meets_minimum === "true";
  
    return (
      <div className="dataset-card">
        <div className="card-body">
          <div className="card-name">{dataset.name}</div>
          <div className="stat-grid">
            <StatItem label="Quantitative" value={dataset.num_quantitative} />
            <StatItem label="Categorical" value={dataset.num_categorical} />
            <StatItem label="Temporal" value={dataset.num_temporal} />
            <StatItem label="Geographic" value={dataset.num_geographic} />
          </div>
          <TagRow tagsString={dataset.ml_tags} />
          <span className={`status-badge ${meetsMinimum ? "pass" : "fail"}`}>
            {meetsMinimum ? "Meets minimum" : "Below minimum"}
          </span>
        </div>
      </div>
    );
  }
  
  function UploadCard() {
    return (
      <div className="dataset-card upload-card">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
          <path d="M12 5V19" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          <path d="M5 12H19" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
        <span className="upload-label">Upload a Dataset</span>
      </div>
    );
  }