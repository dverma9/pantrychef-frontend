import { useState } from 'react';
import PantryManager from './components/PantryManager';
import ChatWindow from './components/ChatWindow';
import PreferencesPanel from './components/PreferencesPanel';
import './App.css';

function App() {
  const [pantryCount, setPantryCount] = useState(0);
  const [activeTab, setActiveTab] = useState('chat');

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-left">
          <span className="header-logo">🍽️</span>
          <span className="header-title">PantryChef AI</span>
        </div>
        <div className="header-right">
          <button
            className={`header-prefs-btn ${activeTab === 'prefs' ? 'header-prefs-btn--active' : ''}`}
            onClick={() => setActiveTab(activeTab === 'prefs' ? 'chat' : 'prefs')}
            title="Preferences"
          >
            ⚙️ {activeTab === 'prefs' ? 'Back to Chat' : 'Preferences'}
          </button>
          <span className="header-tagline">Your personal cooking companion</span>
        </div>
      </header>

      <nav className="tab-nav">
        <button
          className={`tab-btn ${activeTab === 'chat' ? 'tab-btn--active' : ''}`}
          onClick={() => setActiveTab('chat')}
        >
          💬 Chat
        </button>
        <button
          className={`tab-btn ${activeTab === 'pantry' ? 'tab-btn--active' : ''}`}
          onClick={() => setActiveTab('pantry')}
        >
          🧺 Pantry {pantryCount > 0 && <span className="tab-badge">{pantryCount}</span>}
        </button>
        <button
          className={`tab-btn ${activeTab === 'prefs' ? 'tab-btn--active' : ''}`}
          onClick={() => setActiveTab('prefs')}
        >
          ⚙️ Preferences
        </button>
      </nav>

      <main className="app-main">
        <div className="mobile-view">
          {activeTab === 'chat' && <ChatWindow />}
          {activeTab === 'pantry' && <PantryManager onPantryChange={setPantryCount} />}
          {activeTab === 'prefs' && <PreferencesPanel />}
        </div>

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
        <a href="https://www.youtube.com/@ABTalks" target="_blank" rel="noopener noreferrer">
          AB Talks
        </a>&nbsp; 
        60-Day Claude AI Challenge
      </footer>
    </div>
  );
}

export default App;