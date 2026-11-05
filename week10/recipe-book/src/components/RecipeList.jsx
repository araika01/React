import RecipeCard from "./RecipeCard";
import SkeletonCard from "./SkeletonCard";
import StateMessage from "./StateMessage";

export default function RecipeList({
  items,
  loading,
  error,
  pageSize,
  favorites,
  onToggleFavorite,
  onRetry,
  onReset,
}) {
  if (loading) {
    return (
      <div className="grid">
        {Array.from({ length: pageSize }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <StateMessage
        title="Something went wrong"
        message={error}
        actionLabel="Retry"
        onAction={onRetry}
      />
    );
  }

  if (!items.length) {
    return (
      <StateMessage
        title="No recipes found"
        message="Try adjusting filters or resetting them."
        actionLabel="Reset filters"
        onAction={onReset}
      />
    );
  }

  return (
    <div className="grid">
      {items.map((recipe) => (
        <RecipeCard
          key={recipe.id}
          recipe={recipe}
          isFavorite={favorites.has(recipe.id)}
          onToggleFavorite={() => onToggleFavorite(recipe.id)}
        />
      ))}
    </div>
  );
}