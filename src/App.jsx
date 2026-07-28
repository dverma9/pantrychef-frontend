import { useState } from 'react';
import PantryManager from './components/PantryManager';
import ChatWindow from './components/ChatWindow';
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
        <span className="header-tagline">Your personal cooking companion</span>
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
      </nav>

      <main className="app-main">
        <div className={`panel-wrapper ${activeTab === 'pantry' ? 'panel-wrapper--show-pantry' : ''}`}>
          <PantryManager onPantryChange={setPantryCount} />
          <ChatWindow />
        </div>
      </main>
    </div>
  );
}

export default App;