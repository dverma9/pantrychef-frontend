import { useState } from 'react';
import Header from './components/Header';
import PantryManager from './components/PantryManager';
import ChatWindow from './components/ChatWindow';
import PreferencesPanel from './components/PreferencesPanel';
import './App.css';

function App() {
  const [pantryCount, setPantryCount] = useState(0);
  const [activeTab, setActiveTab] = useState('chat');

  return (
    <div className="app">
      <Header
        activeTab={activeTab}
        onPrefsClick={() => setActiveTab(activeTab === 'prefs' ? 'chat' : 'prefs')}
      />

      {/* Mobile tab navigation */}
      <nav className="tab-nav" role="tablist" aria-label="Main navigation">
        <button
          className={`tab-btn ${activeTab === 'chat' ? 'tab-btn--active' : ''}`}
          onClick={() => setActiveTab('chat')}
          role="tab"
          aria-selected={activeTab === 'chat'}
        >
          💬 Chat
        </button>
        <button
          className={`tab-btn ${activeTab === 'pantry' ? 'tab-btn--active' : ''}`}
          onClick={() => setActiveTab('pantry')}
          role="tab"
          aria-selected={activeTab === 'pantry'}
        >
          🧺 Pantry{pantryCount > 0 && <span className="tab-badge">{pantryCount}</span>}
        </button>
        <button
          className={`tab-btn ${activeTab === 'prefs' ? 'tab-btn--active' : ''}`}
          onClick={() => setActiveTab('prefs')}
          role="tab"
          aria-selected={activeTab === 'prefs'}
        >
          ⚙️ Prefs
        </button>
      </nav>

      <main className="app-main">
        {/* Mobile: single panel */}
        <div className="mobile-view">
          {activeTab === 'chat' && <ChatWindow />}
          {activeTab === 'pantry' && <PantryManager onPantryChange={setPantryCount} />}
          {activeTab === 'prefs' && <PreferencesPanel />}
        </div>

        {/* Desktop: split layout or full-width prefs */}
        <div className="desktop-view">
          {activeTab === 'prefs' ? (
            <div className="desktop-prefs-layout">
              <PreferencesPanel />
            </div>
          ) : (
            <div className="desktop-split-layout">
              <PantryManager onPantryChange={setPantryCount} />
              <ChatWindow />
            </div>
          )}
        </div>
      </main>

      <footer className="app-footer">
        Built with Claude as part of the &nbsp;
        <a
          href="https://www.youtube.com/@ABTalks"
          target="_blank"
          rel="noopener noreferrer"
        >
          AB Talks
        </a>&nbsp;
        60-Day Claude AI Challenge
      </footer>
    </div>
  );
}

export default App;