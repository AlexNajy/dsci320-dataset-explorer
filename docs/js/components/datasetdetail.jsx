function parseMlReasons(reasonsString) {
  if (!reasonsString) return {};

  const reasons = {};
  const pairPattern = /'([^']+)':\s*(?:"((?:[^"\\]|\\.)*)"|'((?:[^'\\]|\\.)*)')/g;
  let match;

  while ((match = pairPattern.exec(reasonsString)) !== null) {
    const [, tag, doubleQuoted, singleQuoted] = match;
    reasons[tag] = doubleQuoted !== undefined ? doubleQuoted : singleQuoted;
  }

  return reasons;
}

function DatasetDetail({ dataset, onClose }) {
  React.useEffect(() => {
    const handleKeyDown = e => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const tags = parseTags(dataset.ml_tags);
  const reasons = parseMlReasons(dataset.ml_reasons);
  const passes = dataset.meets_minimum === true;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-panel"
        role="dialog"
        aria-modal="true"
        aria-label={dataset.name}
        onClick={e => e.stopPropagation()}
      >
        <div className="modal-header">
          <span className="modal-title">{dataset.name}</span>
          <button type="button" className="modal-close-btn" onClick={onClose} aria-label="Close">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M3 3L13 13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              <path d="M13 3L3 13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <span className={`status-badge ${passes ? "pass" : "fail"}`}>
          {passes ? "Meets minimum" : "Below minimum"}
        </span>

        <div className="modal-section">
          <div className="modal-section-title">Description</div>
          <p className="modal-description">
            {dataset.description || "No description available yet for this dataset."}
          </p>
        </div>

        <div className="modal-section">
          <div className="modal-section-title">Column breakdown</div>
          <div className="stat-grid">
            <StatItem label="Quantitative" value={dataset.num_quantitative} />
            <StatItem label="Categorical" value={dataset.num_categorical} />
            <StatItem label="Temporal" value={dataset.num_temporal} />
            <StatItem label="Geographic" value={dataset.num_geographic} />
          </div>
        </div>

        {tags.length > 0 && (
          <div className="modal-section">
            <div className="modal-section-title">ML suitability</div>
            <ul className="reason-list">
              {tags.map(tag => (
                <li className="reason-item" key={tag}>
                  <span className="tag-chip">{tag}</span>
                  <span className="reason-text">
                    {reasons[tag.toLowerCase()] || "No justification recorded."}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="modal-section">
          <div className="modal-section-title">Source</div>
          {dataset.source_url ? (
            <a
              className="modal-source-link"
              href={dataset.source_url}
              target="_blank"
              rel="noopener noreferrer"
            >
              View original dataset ↗
            </a>
          ) : (
            <span className="modal-source-missing">Source link not yet available.</span>
          )}
        </div>
      </div>
    </div>
  );
}
