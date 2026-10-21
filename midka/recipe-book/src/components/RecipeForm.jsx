import { useState } from "react";

const INITIAL = {
  title: "",
  cuisine: "italian",
  difficulty: "easy",
  cookTime: "",
  servings: "",
  imageUrl: "",
  ingredients: "",
  steps: "",
};

const CUISINES = ["italian", "asian", "mexican", "french", "indian", "american", "mediterranean", "thai"];

export default function RecipeForm({ onSubmit, submitting, submitError }) {
  const [form, setForm] = useState(INITIAL);
  const [errors, setErrors] = useState({});

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  }

  function validate() {
    const e = {};
    if (form.title.trim().length < 3) e.title = "At least 3 characters";
    if (!form.cookTime || Number(form.cookTime) <= 0) e.cookTime = "Enter cook time in minutes";
    if (!form.servings || Number(form.servings) <= 0) e.servings = "Enter servings";
    if (!form.ingredients.trim()) e.ingredients = "Add at least one ingredient";
    if (!form.steps.trim()) e.steps = "Add at least one step";
    return e;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const eObj = validate();
    setErrors(eObj);
    if (Object.keys(eObj).length > 0) return;

    onSubmit({
      title: form.title.trim(),
      cuisine: form.cuisine,
      difficulty: form.difficulty,
      cookTime: Number(form.cookTime),
      servings: Number(form.servings),
      imageUrl: form.imageUrl.trim() || `https://picsum.photos/seed/${Date.now()}/400/300`,
      ingredients: form.ingredients.split("\n").map((s) => s.trim()).filter(Boolean).map((line) => {
        const [name, amount] = line.split("—").map((s) => s.trim());
        return { name: name || line, amount: amount || "" };
      }),
      steps: form.steps.split("\n").map((s) => s.trim()).filter(Boolean),
    });
  }

  return (
    <form className="form" onSubmit={handleSubmit} noValidate>
      <label className="field">
        <span>Title</span>
        <input className="input" name="title" value={form.title} onChange={handleChange} />
        {errors.title && <em className="error">{errors.title}</em>}
      </label>

      <div className="row">
        <label className="field">
          <span>Cuisine</span>
          <select className="input" name="cuisine" value={form.cuisine} onChange={handleChange}>
            {CUISINES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </label>
        <label className="field">
          <span>Difficulty</span>
          <select className="input" name="difficulty" value={form.difficulty} onChange={handleChange}>
            <option value="easy">easy</option>
            <option value="medium">medium</option>
            <option value="hard">hard</option>
          </select>
        </label>
      </div>

      <div className="row">
        <label className="field">
          <span>Cook time (min)</span>
          <input className="input" name="cookTime" type="number" min="1" value={form.cookTime} onChange={handleChange} />
          {errors.cookTime && <em className="error">{errors.cookTime}</em>}
        </label>
        <label className="field">
          <span>Servings</span>
          <input className="input" name="servings" type="number" min="1" value={form.servings} onChange={handleChange} />
          {errors.servings && <em className="error">{errors.servings}</em>}
        </label>
      </div>

      <label className="field">
        <span>Image URL (optional)</span>
        <input className="input" name="imageUrl" value={form.imageUrl} onChange={handleChange} placeholder="https://..." />
      </label>

      <label className="field">
        <span>Ingredients (one per line, format "Name — amount")</span>
        <textarea className="input" name="ingredients" rows={5} value={form.ingredients} onChange={handleChange} />
        {errors.ingredients && <em className="error">{errors.ingredients}</em>}
      </label>

      <label className="field">
        <span>Steps (one per line)</span>
        <textarea className="input" name="steps" rows={5} value={form.steps} onChange={handleChange} />
        {errors.steps && <em className="error">{errors.steps}</em>}
      </label>

      {submitError && <p className="error">{submitError}</p>}

      <button className="btn btn-primary" type="submit" disabled={submitting}>
        {submitting ? "Saving..." : "Add recipe"}
      </button>
    </form>
  );
}