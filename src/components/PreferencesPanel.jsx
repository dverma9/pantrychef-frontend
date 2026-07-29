import { useState, useEffect } from 'react';
import { getPreferences, updatePreferences } from '../api/preferencesApi';

const CUISINES = ['Indian', 'Chinese', 'Italian', 'Continental', 'Mexican', 'Thai', 'Middle Eastern'];
const SPICE_LEVELS = ['mild', 'medium', 'hot', 'very hot'];

function PreferencesPanel() {
  const [spiceLevel, setSpiceLevel] = useState('medium');
  const [selectedCuisines, setSelectedCuisines] = useState([]);
  const [dietaryNotes, setDietaryNotes] = useState('');
  const [dislikedIngredients, setDislikedIngredients] = useState('');
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      const data = await getPreferences();
      setSpiceLevel(data.spiceLevel || 'medium');
      setDietaryNotes(data.dietaryNotes || '');
      setDislikedIngredients(data.dislikedIngredients || '');
      if (data.preferredCuisines) {
        setSelectedCuisines(
          data.preferredCuisines.split(',').map((c) => c.trim()).filter(Boolean)
        );
      }
    } catch (err) {
      setError('Failed to load preferences. Is the backend running?');
    }
  };

  const toggleCuisine = (cuisine) => {
    setSelectedCuisines((prev) =>
      prev.includes(cuisine) ? prev.filter((c) => c !== cuisine) : [...prev, cuisine]
    );
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      await updatePreferences({
        spiceLevel,
        preferredCuisines: selectedCuisines.join(', '),
        dietaryNotes: dietaryNotes.trim(),
        dislikedIngredients: dislikedIngredients.trim(),
      });
      setToast('Preferences saved! ✓');
      setTimeout(() => setToast(''), 3000);
    } catch (err) {
      setError('Failed to save preferences. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="prefs-panel">
      <div className="prefs-scroll">
        <h2 className="panel-title" style={{ padding: '18px 20px 14px', borderBottom: '1px solid var(--color-grey-border)' }}>
          ⚙️ Your Preferences
        </h2>

        <div className="prefs-body">
          <div className="prefs-section">
            <label className="prefs-label">🌶️ Spice Level</label>
            <div className="spice-row">
              {SPICE_LEVELS.map((level) => (
                <button
                  key={level}
                  className={`spice-btn ${spiceLevel === level ? 'spice-btn--active' : ''}`}
                  onClick={() => setSpiceLevel(level)}
                  type="button"
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          <div className="prefs-section">
            <label className="prefs-label">🍜 Preferred Cuisines</label>
            <p className="prefs-hint">Select all that apply (leave empty for any)</p>
            <div className="cuisine-grid">
              {CUISINES.map((cuisine) => (
                <label key={cuisine} className="cuisine-checkbox">
                  <input
                    type="checkbox"
                    checked={selectedCuisines.includes(cuisine)}
                    onChange={() => toggleCuisine(cuisine)}
                  />
                  <span>{cuisine}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="prefs-section">
            <label className="prefs-label">🥗 Dietary Restrictions</label>
            <p className="prefs-hint">e.g. vegetarian, vegan, gluten-free, no dairy</p>
            <textarea
              className="prefs-textarea"
              rows={3}
              placeholder="Any dietary restrictions or requirements..."
              value={dietaryNotes}
              onChange={(e) => setDietaryNotes(e.target.value)}
              maxLength={500}
            />
          </div>

          <div className="prefs-section">
            <label className="prefs-label">🚫 Disliked Ingredients</label>
            <p className="prefs-hint">e.g. mushrooms, cilantro, olives</p>
            <textarea
              className="prefs-textarea"
              rows={3}
              placeholder="Ingredients you want to avoid..."
              value={dislikedIngredients}
              onChange={(e) => setDislikedIngredients(e.target.value)}
              maxLength={500}
            />
          </div>

          {error && <p className="error-msg">{error}</p>}
          {toast && <div className="toast">{toast}</div>}

          <button
            className="save-btn"
            onClick={handleSave}
            disabled={saving}
            type="button"
          >
            {saving ? 'Saving...' : '💾 Save Preferences'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default PreferencesPanel;