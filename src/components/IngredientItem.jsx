function IngredientItem({ ingredient, onDelete }) {
  return (
    <div className="ingredient-item">
      <div className="ingredient-info">
        <span className="ingredient-name">{ingredient.name}</span>
        {ingredient.quantity && (
          <span className="ingredient-qty">
            {ingredient.quantity} {ingredient.unit || ''}
          </span>
        )}
      </div>
      <button
        className="delete-btn"
        onClick={() => onDelete(ingredient.id)}
        title="Remove ingredient"
      >
        ×
      </button>
    </div>
  );
}

export default IngredientItem;