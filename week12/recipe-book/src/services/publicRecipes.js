
const BASE_URL = "https://www.themealdb.com/api/json/v1/1";

async function request(endpoint) {
  const response = await fetch(`${BASE_URL}/${endpoint}`);

  if (!response.ok) {
    throw new Error("Failed to load public recipes");
  }

  return response.json();
}

export async function fetchPublicRecipes() {
  const data = await request("search.php?f=a");
  return data.meals || [];
}

export async function fetchPublicRecipeById(id) {
  const data = await request(
    `lookup.php?i=${encodeURIComponent(id)}`
  );

  return data.meals?.[0] || null;
}
