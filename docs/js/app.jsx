const SEMANTIC_TRUST_THRESHOLD = 0.25; // best score must clear this or we don't trust semantic mode at all
const SEMANTIC_RESULT_FLOOR = 0.15;    // once trusted, individual results only need to clear this

function dotProduct(a, b) {
  let sum = 0;
  for (let i = 0; i < a.length; i++) sum += a[i] * b[i];
  return sum;
}

function App() {
    const [datasets, setDatasets] = React.useState([]);
    const [error, setError] = React.useState(null);
    const [showFilters, setShowFilters] = React.useState(false);
    const [selectedDataset, setSelectedDataset] = React.useState(null);
    const [showUploadModal, setShowUploadModal] = React.useState(false);
    const [searchQuery, setSearchQuery] = React.useState("");
    const [debouncedQuery, setDebouncedQuery] = React.useState("");
    const [semanticScores, setSemanticScores] = React.useState(null);
    const [filters, setFilters] = React.useState({
      meetsMinOnly: false,
      ...Object.fromEntries(MIN_FIELDS.map(({ key }) => [key, ""])),
      tags: [],
    });

    const updateFilter = (key, value) =>
      setFilters(prev => ({ ...prev, [key]: value }));

    const toggleTag = tag =>
      setFilters(prev => ({
        ...prev,
        tags: prev.tags.includes(tag)
          ? prev.tags.filter(t => t !== tag)
          : [...prev.tags, tag],
      }));

    React.useEffect(() => {
      const timeout = setTimeout(() => setDebouncedQuery(searchQuery.trim()), 300);
      return () => clearTimeout(timeout);
    }, [searchQuery]);

    React.useEffect(() => {
      if (!debouncedQuery) {
        setSemanticScores(null);
        return;
      }
      let cancelled = false;
      (async () => {
        try {
          if (typeof window.embedQuery !== "function") throw new Error("model not ready");
          const queryVector = await window.embedQuery(debouncedQuery);
          if (cancelled) return;

          const scores = {};
          let maxScore = -Infinity;
          datasets.forEach(dataset => {
            if (!Array.isArray(dataset.description_embedding)) return;
            const score = dotProduct(queryVector, dataset.description_embedding);
            scores[dataset.name] = score;
            if (score > maxScore) maxScore = score;
          });

          setSemanticScores(maxScore >= SEMANTIC_TRUST_THRESHOLD ? scores : null);
        } catch (err) {
          if (!cancelled) setSemanticScores(null);
        }
      })();
      return () => { cancelled = true; };
    }, [debouncedQuery, datasets]);

    const structurallyFiltered = datasets.filter(dataset => {
      if (filters.meetsMinOnly && dataset.meets_minimum !== true) return false;
      if (MIN_FIELDS.some(({ key, dataKey }) => filters[key] && Number(dataset[dataKey]) < Number(filters[key]))) {
        return false;
      }
      if (filters.tags.length > 0) {
        const datasetTags = parseTags(dataset.ml_tags).map(t => t.toLowerCase());
        if (!filters.tags.every(tag => datasetTags.includes(tag.toLowerCase()))) return false;
      }
      return true;
    });

    let filteredDatasets = structurallyFiltered;
    if (debouncedQuery) {
      if (semanticScores) {
        filteredDatasets = structurallyFiltered
          .filter(dataset => (semanticScores[dataset.name] ?? -Infinity) >= SEMANTIC_RESULT_FLOOR)
          .sort((a, b) => (semanticScores[b.name] ?? -Infinity) - (semanticScores[a.name] ?? -Infinity));
      } else {
        const query = debouncedQuery.toLowerCase();
        filteredDatasets = structurallyFiltered.filter(dataset => {
          const name = (dataset.name || "").toLowerCase();
          const description = (dataset.description || "").toLowerCase();
          const tags = (dataset.ml_tags || "").toLowerCase();
          return name.includes(query) || description.includes(query) || tags.includes(query);
        });
      }
    }

    const handleUploadSubmit = newDataset => {
      setDatasets(prev => [...prev, newDataset]);
      setShowUploadModal(false);
    };

    React.useEffect(() => {
      fetch("data.json")
        .then(res => res.json())
        .then(setDatasets)
        .catch(err => {
          console.error(err);
          setError("Could not load dataset data.");
        });
    }, []);
  
    return (
      <div>
        <Topbar
          filtersVisible={showFilters}
          onToggleFilters={() => setShowFilters(v => !v)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
        <main className="content">
          {showFilters && (
            <FilterBar filters={filters} onChange={updateFilter} onToggleTag={toggleTag} />
          )}
          <div className="dataset-grid">
            <UploadCard onClick={() => setShowUploadModal(true)} />
            {error && <p style={{ color: "#5F6368" }}>{error}</p>}
            {filteredDatasets.map(dataset => (
              <DatasetCard dataset={dataset} key={dataset.name} onSelect={setSelectedDataset} />
            ))}
          </div>
        </main>
        {selectedDataset && (
          <DatasetDetail dataset={selectedDataset} onClose={() => setSelectedDataset(null)} />
        )}
        {showUploadModal && (
          <UploadModal
            existingNames={datasets.map(d => d.name)}
            onClose={() => setShowUploadModal(false)}
            onSubmit={handleUploadSubmit}
          />
        )}
      </div>
    );
  }
  
  const root = ReactDOM.createRoot(document.getElementById("app"));
  root.render(<App />);