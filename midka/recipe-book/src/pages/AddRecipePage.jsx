import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addRecipe } from "../api/recipesApi";
import RecipeForm from "../components/RecipeForm";

export default function AddRecipePage() {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  async function handleSubmit(payload) {
    setSubmitting(true);
    setError(null);
    try {
      const created = await addRecipe(payload);
      navigate(`/recipes/${created.id}`);
    } catch (e) {
      setError(e.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="page">
      <h1>Add recipe</h1>
      <RecipeForm onSubmit={handleSubmit} submitting={submitting} submitError={error} />
    </section>
  );
}