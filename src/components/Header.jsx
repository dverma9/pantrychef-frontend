function Header({ activeTab, onPrefsClick }) {
  return (
    <header className="app-header" role="banner">
      <div className="header-left">
        <span className="header-logo" aria-hidden="true">🍽️</span>
        <div className="header-titles">
          <span className="header-title">PantryChef AI</span>
          <span className="header-tagline">Your personal cooking companion</span>
        </div>
      </div>
      <div className="header-right">
        {/* Desktop only — Preferences button */}
        <button
          className={`header-prefs-btn ${activeTab === 'prefs' ? 'header-prefs-btn--active' : ''}`}
          onClick={onPrefsClick}
          aria-pressed={activeTab === 'prefs'}
        >
          ⚙️ {activeTab === 'prefs' ? 'Back to Chat' : 'Preferences'}
        </button>
      </div>
    </header>
  );
}

export default Header;