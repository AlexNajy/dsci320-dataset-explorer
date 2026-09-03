function App() {
    const [datasets, setDatasets] = React.useState([]);
    const [error, setError] = React.useState(null);
    const [showFilters, setShowFilters] = React.useState(false);
    const [selectedDataset, setSelectedDataset] = React.useState(null);
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

    const filteredDatasets = datasets.filter(dataset => {
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
        <Topbar filtersVisible={showFilters} onToggleFilters={() => setShowFilters(v => !v)} />
        <main className="content">
          {showFilters && (
            <FilterBar filters={filters} onChange={updateFilter} onToggleTag={toggleTag} />
          )}
          <div className="dataset-grid">
            <UploadCard />
            {error && <p style={{ color: "#5F6368" }}>{error}</p>}
            {filteredDatasets.map(dataset => (
              <DatasetCard dataset={dataset} key={dataset.name} onSelect={setSelectedDataset} />
            ))}
          </div>
        </main>
        {selectedDataset && (
          <DatasetDetail dataset={selectedDataset} onClose={() => setSelectedDataset(null)} />
        )}
      </div>
    );
  }
  
  const root = ReactDOM.createRoot(document.getElementById("app"));
  root.render(<App />);