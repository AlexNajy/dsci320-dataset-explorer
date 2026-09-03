function Topbar({ filtersVisible, onToggleFilters }) {
    return (
      <header className="topbar">
        <div className="topbar-inner">
          <div className="topbar-title-row">
            <span className="topbar-title">Dataset Explorer</span>
          </div>
          <div className="search-row">
            <div className="search-bar" aria-disabled="true">
              <svg className="search-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <circle cx="7" cy="7" r="5.25" stroke="currentColor" strokeWidth="1.4" />
                <path d="M11 11L14 14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
              <input type="text" placeholder="Search datasets" disabled />
            </div>
            <button
              type="button"
              className="filter-toggle-btn"
              aria-pressed={filtersVisible}
              onClick={onToggleFilters}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M2 4H14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                <path d="M4.5 8H11.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                <path d="M7 12H9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
              Filters
            </button>
          </div>
        </div>
      </header>
    );
  }