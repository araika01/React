
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import StateMessage from "../components/StateMessage";
import RecipeForm from "../components/RecipeForm";

import {
  fetchRecipeById,
  updateRecipe,
  deleteRecipe,
} from "../services/api";

export default function RecipeDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [editing, setEditing] = useState(false);

  // GET: Load recipe details
  const {
    data: recipe,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ["recipe", id],
    queryFn: () => fetchRecipeById(id),
    retry: false,
  });

  // UPDATE: Edit recipe
  const updateMutation = useMutation({
    mutationFn: (updates) => updateRecipe(id, updates),

    onSuccess: async (updatedRecipe) => {
      // Update the current recipe cache
      queryClient.setQueryData(
        ["recipe", id],
        updatedRecipe
      );

      // Invalidate cached recipe lists
      await queryClient.invalidateQueries({
        queryKey: ["recipes"],
      });

      setEditing(false);
    },
  });

  // DELETE: Remove recipe
  const deleteMutation = useMutation({
    mutationFn: () => deleteRecipe(id),

    onSuccess: async () => {
      // Cancel any ongoing details request
      await queryClient.cancelQueries({
        queryKey: ["recipe", id],
      });

      // Remove deleted recipe from cache
      queryClient.removeQueries({
        queryKey: ["recipe", id],
      });

      // Invalidate cached recipe lists
      await queryClient.invalidateQueries({
        queryKey: ["recipes"],
      });

      navigate("/recipes", { replace: true });
    },
  });

  // Open edit form
  function startEditing() {
    updateMutation.reset();
    setEditing(true);
  }

  // Save all edited fields
  async function handleUpdate(payload) {
    try {
      await updateMutation.mutateAsync(payload);
    } catch (err) {
      console.error("Update failed:", err);
    }
  }

  // Delete with confirmation
  async function handleDelete() {
    const confirmed = window.confirm(
      "Are you sure you want to delete this recipe?"
    );

    if (!confirmed) return;

    try {
      await deleteMutation.mutateAsync();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  }

  // Loading state
  if (isPending) {
    return (
      <div className="page details">
        <div className="details-actions">
          <Link className="btn btn-ghost" to="/recipes">
            ← All recipes
          </Link>
        </div>
        <p className="muted">Loading recipe...</p>
      </div>
    );
  }

  // Error state
  if (isError) {
    const isMissing = error?.message === "Recipe not found";

    return (
      <div className="page details">
        <div className="details-actions">
          <Link className="btn btn-ghost" to="/recipes">
            ← All recipes
          </Link>
        </div>

        <StateMessage
          title={isMissing ? "Recipe not found" : "Something went wrong"}
          message={
            isMissing
              ? `We couldn't find a recipe with id "${id}".`
              : error?.message
          }
        />
      </div>
    );
  }

  if (!recipe) return null;

  return (
    <div className="page details">

      {/* Navigation and actions */}
      <div className="details-actions">
        <Link className="btn btn-ghost" to="/recipes">
          ← All recipes
        </Link>

        {recipe.isUserAdded && (
          <>
            <button
              type="button"
              className="btn"
              onClick={startEditing}
              disabled={
                editing ||
                updateMutation.isPending ||
                deleteMutation.isPending
              }
            >
              Edit
            </button>

            <button
              type="button"
              className="btn btn-danger"
              onClick={handleDelete}
              disabled={
                updateMutation.isPending ||
                deleteMutation.isPending
              }
            >
              {deleteMutation.isPending
                ? "Deleting..."
                : "Delete"}
            </button>
          </>
        )}
      </div>

      {editing && (
        <div className="edit-section">
          <h2>Edit recipe</h2>

          <RecipeForm
            key={recipe.id}
            initialData={recipe}
            mode="edit"
            onSubmit={handleUpdate}
            submitting={updateMutation.isPending}
            submitError={updateMutation.error?.message}
          />

          <button
            type="button"
            className="btn btn-ghost"
            style={{ marginTop: "12px" }}
            onClick={() => {
              updateMutation.reset();
              setEditing(false);
            }}
            disabled={updateMutation.isPending}
          >
            Cancel
          </button>
        </div>
      )}

      {deleteMutation.isError && (
        <p className="error" role="alert">
          {deleteMutation.error.message}
        </p>
      )}

      <div className="details-grid">
        <img
          className="details-img"
          src={recipe.imageUrl}
          alt={recipe.title}
        />

        <div>
          <h1>{recipe.title}</h1>

          <ul className="details-meta">
            <li>
              <span>Cuisine: </span>
              <strong>{recipe.cuisine}</strong>
            </li>

            <li>
              <span>Difficulty: </span>
              <strong>{recipe.difficulty}</strong>
            </li>

            <li>
              <span>Cook time: </span>
              <strong>{recipe.cookTime} min</strong>
            </li>

            <li>
              <span>Servings: </span>
              <strong>{recipe.servings}</strong>
            </li>

            <li>
              <span>Rating: </span>
              <strong>★ {recipe.rating}</strong>
            </li>

            <li>
              <span>Ingredients: </span>
              <strong>{recipe.ingredients.length}</strong>
            </li>

            <li>
              <span>Steps: </span>
              <strong>{recipe.steps.length}</strong>
            </li>

            <li>
              <span>Source: </span>
              <strong>
                {recipe.isUserAdded ? "User" : "Seed"}
              </strong>
            </li>
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
            {recipe.steps.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}
