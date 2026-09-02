function App() {
    const [datasets, setDatasets] = React.useState([]);
    const [error, setError] = React.useState(null);
  
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
        <Topbar />
        <main className="content">
          <div className="dataset-grid">
            <UploadCard />
            {error && <p style={{ color: "#5F6368" }}>{error}</p>}
            {datasets.map(dataset => (
              <DatasetCard dataset={dataset} key={dataset.name} />
            ))}
          </div>
        </main>
      </div>
    );
  }
  
  const root = ReactDOM.createRoot(document.getElementById("app"));
  root.render(<App />);