import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { addRecipe } from "../services/api";
import RecipeForm from "../components/RecipeForm";

export default function AddRecipePage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    mutateAsync,
    isPending,
    error,
  } = useMutation({
    mutationFn: addRecipe,

    onSuccess: async (created) => {
      await queryClient.invalidateQueries({
        queryKey: ["recipes"],
      });

      queryClient.setQueryData(
        ["recipe", created.id],
        created
      );
    },
  });

  async function handleSubmit(payload) {
    try {
      const created = await mutateAsync(payload);
      navigate(`/recipes/${created.id}`);
    } catch (err) {
    }
  }

  return (
    <section className="page">
      <h1>Add recipe</h1>

      <RecipeForm
        onSubmit={handleSubmit}
        submitting={isPending}
        submitError={error?.message ?? null}
      />
    </section>
  );
}
