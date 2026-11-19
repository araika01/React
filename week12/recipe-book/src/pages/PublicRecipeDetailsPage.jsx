import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { fetchPublicRecipeById } from "../services/publicRecipes";
import { useNetworkStatus } from "../context/NetworkStatusContext";

export default function PublicRecipeDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isOnline = useNetworkStatus();

  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadRecipe() {
      setLoading(true);
      setError("");
      setRecipe(null);

      try {
        const data = await fetchPublicRecipeById(id);

        if (cancelled) return;

        if (!data) {
          setError("Recipe not found");
        } else {
          setRecipe(data);
        }
      } catch (err) {
        if (cancelled) return;

        let connectionAvailable = false;

        try {
          const controller = new AbortController();
          const timeout = setTimeout(() => controller.abort(), 3000);

          try {
            await fetch(
              "https://www.gstatic.com/generate_204",
              {
                mode: "no-cors",
                cache: "no-store",
                signal: controller.signal,
              }
            );

            connectionAvailable = true;
          } finally {
            clearTimeout(timeout);
          }
        } catch {
          connectionAvailable = false;
        }

        if (cancelled) return;

        if (!connectionAvailable) {
          navigate("/offline", { 
            replace: true,
            state: { 
                returnTo: `/public-recipes/${id}` },
          });
        } else {
          setError("Failed to load recipe. Please try again.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadRecipe();

    return () => {
      cancelled = true;
    };
  }, [id, navigate]);

  return (
    <div className="page">
      <Link to="/public-recipes">
        ← Back to Public Recipes
      </Link>

      {loading && <p>Loading recipe...</p>}

      {error && (
        <div role="alert">
          <p>{error}</p>
          <button
            className="btn btn-primary"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      )}

      {!loading && !error && recipe && (
        <>
            {!isOnline && (
            <p className="cached-notice" role="status">
                📦 Viewing cached data — you're offline
            </p>
            )}
          <h1>{recipe.strMeal}</h1>

          <img
            src={recipe.strMealThumb}
            alt={recipe.strMeal}
            style={{
              width: "100%",
              maxWidth: "450px",
              borderRadius: "12px",
            }}
          />

          <p>
            {recipe.strArea} · {recipe.strCategory}
          </p>

          <h2>Instructions</h2>
          <p style={{ whiteSpace: "pre-line" }}>
            {recipe.strInstructions}
          </p>
        </>
      )}
    </div>
  );
}
