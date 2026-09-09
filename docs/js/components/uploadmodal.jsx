const UPLOAD_SAMPLE_ROW_LIMIT = 8000;
const COLUMN_TYPE_OPTIONS = ["quantitative", "categorical", "temporal", "geographic"];

function parseCsvSample(file) {
  return new Promise((resolve, reject) => {
    const rows = [];
    let fields = null;
    let sampled = false;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      step: (results, parser) => {
        if (!fields) fields = results.meta.fields || [];
        rows.push(results.data);
        if (rows.length >= UPLOAD_SAMPLE_ROW_LIMIT) {
          sampled = true;
          parser.abort();
        }
      },
      complete: () => resolve({ fields: fields || [], rows, sampled }),
      error: err => reject(err),
    });
  });
}

function deriveUniqueName(fileName, existingNames) {
  const base = fileName.replace(/\.csv$/i, "");
  if (!existingNames.includes(base)) return base;
  let i = 2;
  while (existingNames.includes(`${base} (${i})`)) i++;
  return `${base} (${i})`;
}

function UploadModal({ onClose, onSubmit, existingNames }) {
  const [fileName, setFileName] = React.useState(null);
  const [isParsing, setIsParsing] = React.useState(false);
  const [parseError, setParseError] = React.useState(null);
  const [columns, setColumns] = React.useState(null);
  const [columnTypes, setColumnTypes] = React.useState({});
  const [columnUniqueCounts, setColumnUniqueCounts] = React.useState({});
  const [sampled, setSampled] = React.useState(false);
  const [description, setDescription] = React.useState("");

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

  const handleFileChange = async e => {
    const file = e.target.files[0];
    if (!file) return;

    setFileName(file.name);
    setParseError(null);
    setColumns(null);
    setColumnTypes({});
    setIsParsing(true);

    try {
      const { fields, rows, sampled: wasSampled } = await parseCsvSample(file);

      if (fields.length === 0 || rows.length === 0) {
        setParseError("No columns or rows found in this file. Is it a valid CSV?");
        setIsParsing(false);
        return;
      }

      const guesses = {};
      const uniqueCounts = {};
      fields.forEach(col => {
        const values = rows.map(r => r[col]);
        guesses[col] = classifyColumn(values, col);
        uniqueCounts[col] = countUnique(values);
      });

      setColumns(fields);
      setColumnTypes(guesses);
      setColumnUniqueCounts(uniqueCounts);
      setSampled(wasSampled);
      setIsParsing(false);
    } catch (err) {
      console.error(err);
      setParseError("Could not parse this file as CSV.");
      setIsParsing(false);
    }
  };

  const handleTypeChange = (col, type) => {
    setColumnTypes(prev => ({ ...prev, [col]: type }));
  };

  const canSubmit = columns && columns.length > 0 && description.trim().length > 0;

  const handleSubmit = () => {
    if (!canSubmit) return;

    const counts = { quantitative: 0, categorical: 0, temporal: 0, geographic: 0 };
    Object.values(columnTypes).forEach(type => {
      counts[type] = (counts[type] || 0) + 1;
    });

    const mlColumns = columns.map(col => ({
      column: col,
      type: columnTypes[col],
      nunique: columnUniqueCounts[col] || 0,
    }));
    const { tags, reasons } = tagMlSuitability(mlColumns);

    const dataset = {
      name: deriveUniqueName(fileName, existingNames),
      description: description.trim(),
      num_quantitative: counts.quantitative,
      num_categorical: counts.categorical,
      num_temporal: counts.temporal,
      num_geographic: counts.geographic,
      meets_minimum: meetsMinimumCounts(counts),
      ml_tags: tags.join(", "),
      ml_reasons: reasons,
      source_url: null,
    };

    onSubmit(dataset);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-panel"
        role="dialog"
        aria-modal="true"
        aria-label="Upload a dataset"
        onClick={e => e.stopPropagation()}
      >
        <div className="modal-header">
          <span className="modal-title">Upload a Dataset</span>
          <button type="button" className="modal-close-btn" onClick={onClose} aria-label="Close">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M3 3L13 13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              <path d="M13 3L3 13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="modal-section">
          <div className="modal-section-title">CSV file</div>
          <input type="file" accept=".csv" className="upload-file-input" onChange={handleFileChange} />
          {isParsing && <p className="upload-status-text">Reading file…</p>}
          {parseError && <p className="upload-error">{parseError}</p>}
        </div>

        {columns && !parseError && (
          <React.Fragment>
            <div className="modal-section">
              <div className="modal-section-title">Column types</div>
              {sampled && (
                <p className="upload-status-text">
                  Based on the first {UPLOAD_SAMPLE_ROW_LIMIT.toLocaleString()} rows of this file.
                </p>
              )}
              <div className="column-type-table">
                <div className="column-type-row column-type-header">
                  <span>Column</span>
                  <span>Type</span>
                </div>
                {columns.map(col => (
                  <div className="column-type-row" key={col}>
                    <span className="column-type-name">{col}</span>
                    <select
                      className="column-type-select"
                      value={columnTypes[col]}
                      onChange={e => handleTypeChange(col, e.target.value)}
                    >
                      {COLUMN_TYPE_OPTIONS.map(opt => (
                        <option value={opt} key={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            </div>

            <div className="modal-section">
              <div className="modal-section-title">Description (required)</div>
              <textarea
                className="upload-description-field"
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="What is this dataset about?"
                rows={3}
              />
            </div>

            <button
              type="button"
              className="btn-primary"
              disabled={!canSubmit}
              onClick={handleSubmit}
            >
              Add Dataset
            </button>
          </React.Fragment>
        )}
      </div>
    </div>
  );
}
