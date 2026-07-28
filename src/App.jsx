import { useState } from 'react';
import PantryManager from './components/PantryManager';
import './App.css';

function App() {
  const [pantryCount, setPantryCount] = useState(0);

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-left">
          <span className="header-logo">🍽️</span>
          <span className="header-title">PantryChef AI</span>
        </div>
        <span className="header-tagline">Your personal cooking companion</span>
      </header>

      <main className="app-main">
        <PantryManager onPantryChange={setPantryCount} />
        <div className="chat-placeholder">
          <div className="placeholder-content">
            <span className="placeholder-icon">💬</span>
            <h3>Chat coming on Day 5</h3>
            <p>The AI chat interface will be built tomorrow.</p>
            <p>For now, manage your pantry on the left!</p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;