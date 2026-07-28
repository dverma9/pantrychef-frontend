import { useState, useEffect } from 'react';
import { getIngredients, addIngredient, deleteIngredient } from '../api/pantryApi';
import IngredientItem from './IngredientItem';

function PantryManager({ onPantryChange }) {
  const [ingredients, setIngredients] = useState([]);
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchIngredients();
  }, []);

  const fetchIngredients = async () => {
    try {
      const data = await getIngredients();
      setIngredients(data);
      if (onPantryChange) onPantryChange(data.length);
    } catch (err) {
      setError('Failed to load pantry. Is the backend running?');
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Ingredient name is required.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await addIngredient({ name: name.trim(), quantity: quantity.trim(), unit: unit.trim() });
      setName('');
      setQuantity('');
      setUnit('');
      await fetchIngredients();
    } catch (err) {
      setError('Failed to add ingredient. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteIngredient(id);
      await fetchIngredients();
    } catch (err) {
      setError('Failed to remove ingredient. Please try again.');
    }
  };

  return (
    <div className="pantry-panel">
      <h2 className="panel-title">
        🧺 Your Pantry
        <span className="ingredient-count">{ingredients.length}</span>
      </h2>

      <form className="add-form" onSubmit={handleAdd}>
        <input
          className="input-name"
          type="text"
          placeholder="Ingredient name *"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={100}
        />
        <div className="input-row">
          <input
            className="input-qty"
            type="text"
            placeholder="Qty"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            maxLength={50}
          />
          <input
            className="input-unit"
            type="text"
            placeholder="Unit"
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            maxLength={30}
          />
        </div>
        {error && <p className="error-msg">{error}</p>}
        <button className="add-btn" type="submit" disabled={loading}>
          {loading ? 'Adding...' : '+ Add to Pantry'}
        </button>
      </form>

      <div className="ingredient-list">
        {ingredients.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">🥘</span>
            <p>Your pantry is empty.</p>
            <p>Add some ingredients to get started!</p>
          </div>
        ) : (
          ingredients.map((ingredient) => (
            <IngredientItem
              key={ingredient.id}
              ingredient={ingredient}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default PantryManager;