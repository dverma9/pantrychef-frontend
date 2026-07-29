import { useState, useEffect } from 'react';
import { getIngredients, addIngredient, deleteIngredient } from '../api/pantryApi';
import IngredientItem from './IngredientItem';

function PantryManager({ onPantryChange }) {
  const [ingredients, setIngredients] = useState([]);
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('');
  const [error, setError] = useState('');
  const [adding, setAdding] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchIngredients(true);
  }, []);

  const fetchIngredients = async (isInitial = false) => {
    try {
      const data = await getIngredients();
      setIngredients(data);
      if (onPantryChange) onPantryChange(data.length);
    } catch (err) {
      setError('Failed to load pantry. Is the backend running?');
    } finally {
      if (isInitial) setInitialLoading(false);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Ingredient name is required.');
      return;
    }
    setError('');
    setAdding(true);
    try {
      await addIngredient({
        name: name.trim(),
        quantity: quantity.trim(),
        unit: unit.trim(),
      });
      setName('');
      setQuantity('');
      setUnit('');
      await fetchIngredients();
    } catch (err) {
      setError('Failed to add ingredient. Please try again.');
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await deleteIngredient(id);
      await fetchIngredients();
    } catch (err) {
      setError('Failed to remove ingredient. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="pantry-panel">
      <h2 className="panel-title">
        🧺 Your Pantry
        {ingredients.length > 0 && (
          <span className="ingredient-count">{ingredients.length}</span>
        )}
      </h2>

      <form className="add-form" onSubmit={handleAdd} noValidate>
        <input
          className="input-name"
          type="text"
          placeholder="Ingredient name *"
          value={name}
          onChange={(e) => { setName(e.target.value); setError(''); }}
          maxLength={100}
          aria-label="Ingredient name"
          aria-required="true"
        />
        <div className="input-row">
          <input
            className="input-qty"
            type="text"
            placeholder="Qty"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            maxLength={50}
            aria-label="Quantity"
          />
          <input
            className="input-unit"
            type="text"
            placeholder="Unit (e.g. kg, cups)"
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            maxLength={30}
            aria-label="Unit"
          />
        </div>

        {error && (
          <div className="error-msg error-msg--dismissible" role="alert">
            <span>{error}</span>
            <button
              type="button"
              className="error-dismiss"
              onClick={() => setError('')}
              aria-label="Dismiss error"
            >
              ×
            </button>
          </div>
        )}

        <button className="add-btn" type="submit" disabled={adding}>
          {adding ? (
            <span className="btn-loading">
              <span className="btn-spinner" />
              Adding...
            </span>
          ) : (
            '+ Add to Pantry'
          )}
        </button>
      </form>

      <div className="ingredient-list" aria-label="Pantry ingredients">
        {initialLoading ? (
          <div className="skeleton-list">
            {[1, 2, 3].map((n) => (
              <div key={n} className="skeleton-item">
                <div className="skeleton-name" />
                <div className="skeleton-qty" />
              </div>
            ))}
          </div>
        ) : ingredients.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">🥘</span>
            <p><strong>Your pantry is empty!</strong></p>
            <p>Add your first ingredient above to get personalised cooking suggestions from PantryChef AI.</p>
          </div>
        ) : (
          ingredients.map((ingredient) => (
            <IngredientItem
              key={ingredient.id}
              ingredient={ingredient}
              onDelete={handleDelete}
              isDeleting={deletingId === ingredient.id}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default PantryManager;