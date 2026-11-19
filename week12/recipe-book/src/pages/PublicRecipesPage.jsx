import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchPublicRecipes } from "../services/publicRecipes";
import { useNetworkStatus } from "../context/NetworkStatusContext";

export default function PublicRecipesPage() {
    const isOnline = useNetworkStatus();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadRecipes() {
      try {
        const data = await fetchPublicRecipes();

        if (!cancelled) {
          setRecipes(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadRecipes();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="page">
        {!loading && !error && recipes.length > 0 && !isOnline && (
        <p className="cached-notice" role="status">
            📦 Viewing cached data — you're offline
        </p>
        )}
      <h1>Public Recipes</h1>

      {loading && <p>Loading recipes...</p>}

      {error && <p role="alert">{error}</p>}

      {!loading && !error && recipes.length === 0 && (
        <p>No recipes found.</p>
      )}

      <div className="recipe-grid">
        {recipes.map((recipe) => (
          <Link
            to={`/public-recipes/${recipe.idMeal}`}
            className="card"
            key={recipe.idMeal}
            style={{
                display: "block",
                textDecoration: "none",
                color: "inherit",
            }}
            >
            <img
              src={recipe.strMealThumb}
              alt={recipe.strMeal}
              style={{ width: "100%", borderRadius: "12px" }}
            />

            <h3>{recipe.strMeal}</h3>
            <p>{recipe.strArea} · {recipe.strCategory}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
