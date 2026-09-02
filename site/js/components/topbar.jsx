function Topbar() {
    return (
      <header className="topbar">
        <div className="topbar-inner">
          <div className="topbar-title-row">
            <span className="topbar-title">Dataset Explorer</span>
          </div>
          <div className="search-bar" aria-disabled="true">
            <svg className="search-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <circle cx="7" cy="7" r="5.25" stroke="currentColor" strokeWidth="1.4" />
              <path d="M11 11L14 14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
            <input type="text" placeholder="Search datasets" disabled />
          </div>
        </div>
      </header>
    );
  }