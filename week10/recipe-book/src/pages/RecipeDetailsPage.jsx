import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import StateMessage from "../components/StateMessage";
import { fetchRecipeById } from "../services/api";

export default function RecipeDetailsPage() {
  const { id } = useParams();

  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false; 
    setLoading(true);
    setError(null);
    setRecipe(null);

    fetchRecipeById(id)
      .then((r) => { if (!ignore) setRecipe(r); })
      .catch((err) => { if (!ignore) setError(err.message); })
      .finally(() => { if (!ignore) setLoading(false); });

    return () => { ignore = true; };
  }, [id]);

  if (loading) {
    return (
      <div className="page details">
        <div className="details-actions">
          <Link className="btn btn-ghost" to="/recipes">← All recipes</Link>
        </div>
        <p className="muted">Loading recipe…</p>
      </div>
    );
  }


  const isMissing = error === "Recipe not found";

  if (error) {
    return (
      <div className="page details">
        <div className="details-actions">
          <Link className="btn btn-ghost" to="/recipes">← All recipes</Link>
        </div>
        <StateMessage
          title={isMissing ? "Recipe not found" : "Something went wrong"}
          message={
            isMissing
              ? `We couldn't find a recipe with id "${id}".`
              : error
          }
        />
      </div>
    );
  }

  if (!recipe) return null;

  return (
    <div className="page details">
      <div className="details-actions">
        <Link className="btn btn-ghost" to="/recipes">← All recipes</Link>
      </div>

      <div className="details-grid">
        <img
          className="details-img"
          src={recipe.imageUrl}
          alt={recipe.title}
        />

        <div>
          <h1>{recipe.title}</h1>

          <ul className="details-meta">
            <li><span>Cuisine: </span><strong>{recipe.cuisine}</strong></li>
            <li><span>Difficulty: </span><strong>{recipe.difficulty}</strong></li>
            <li><span>Cook time: </span><strong>{recipe.cookTime} min</strong></li>
            <li><span>Servings: </span><strong>{recipe.servings}</strong></li>
            <li><span>Rating: </span><strong>★ {recipe.rating}</strong></li>
            <li><span>Ingredients: </span><strong>{recipe.ingredients.length}</strong></li>
            <li><span>Steps: </span><strong>{recipe.steps.length}</strong></li>
            <li><span>Source</span><strong>{recipe.isUserAdded ? "User" : "Seed"}</strong></li>
          </ul>

          <h2>Ingredients</h2>
          <ul className="ingredients">
            {recipe.ingredients.map((ing, i) => (
              <li key={i}>
                {ing.name}
                {ing.amount ? ` — ${ing.amount}` : ""}
              </li>
            ))}
          </ul>

          <h2>Steps</h2>
          <ol className="steps">
            {recipe.steps.map((s, i) => <li key={i}>{s}</li>)}
          </ol>
        </div>
      </div>
    </div>
  );
}