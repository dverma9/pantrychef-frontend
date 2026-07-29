function IngredientItem({ ingredient, onDelete, isDeleting }) {
  return (
    <div className={`ingredient-item ${isDeleting ? 'ingredient-item--deleting' : ''}`}>
      <div className="ingredient-info">
        <span className="ingredient-name">{ingredient.name}</span>
        {(ingredient.quantity || ingredient.unit) && (
          <span className="ingredient-qty">
            {ingredient.quantity} {ingredient.unit || ''}
          </span>
        )}
      </div>
      <button
        className="delete-btn"
        onClick={() => onDelete(ingredient.id)}
        disabled={isDeleting}
        title={isDeleting ? 'Removing...' : 'Remove ingredient'}
        aria-label={`Remove ${ingredient.name}`}
      >
        {isDeleting ? '...' : '×'}
      </button>
    </div>
  );
}

export default IngredientItem;