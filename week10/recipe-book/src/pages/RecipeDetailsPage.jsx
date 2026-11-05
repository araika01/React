import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchRecipeById } from "../api/recipesApi";
import FavoriteButton from "../components/FavoriteButton";
import StateMessage from "../components/StateMessage";
import { useFavorites } from "../hooks/useFavorites";

export default function RecipeDetailsPage() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  const { favorites, toggleFavorite } = useFavorites();

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    setRecipe(null);

    fetchRecipeById(id)
      .then((r) => { if (!cancelled) setRecipe(r); })
      .catch((e) => { if (!cancelled) setError(e.message); })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [id, reloadKey]);

  if (loading) return <StateMessage title="Loading recipe..." />;
  if (error) return (
    <StateMessage
      title="Failed to load"
      message={error}
      actionLabel="Retry"
      onAction={() => setReloadKey((k) => k + 1)}
    />
  );

  return (
    <article className="details">
      <Link to="/" className="back">← Back to list</Link>

      <div className="details-head">
        <img className="details-img" src={recipe.imageUrl} alt={recipe.title} />
        <div>
          <div className="details-title-row">
            <h1>{recipe.title}</h1>
            <FavoriteButton
              isActive={favorites.has(recipe.id)}
              onToggle={() => toggleFavorite(recipe.id)}
            />
          </div>
          <p className="muted">
            {recipe.cuisine} · {recipe.difficulty} · {recipe.cookTime} min · ★ {recipe.rating}
          </p>
          <p className="muted">Servings: {recipe.servings}</p>
        </div>
      </div>

      <section className="details-section">
        <h2>Ingredients</h2>
        <ul className="ingredients">
          {recipe.ingredients.map((ing, i) => (
            <li key={`${ing.name}-${i}`}>
              <span>{ing.name}</span>
              <strong>{ing.amount}</strong>
            </li>
          ))}
        </ul>
      </section>

      <section className="details-section">
        <h2>Instructions</h2>
        <ol className="steps">
          {recipe.steps.map((step, i) => (
            <li key={i}>{step}</li>
          ))}
        </ol>
      </section>
    </article>
  );
}