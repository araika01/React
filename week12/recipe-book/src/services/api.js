import { seedRecipes } from "./seed";

const DB_KEY = "recipes_db";
const DELAY = 500;

const delay = (ms) => new Promise((res) => setTimeout(res, ms));


async function readDb() {
  const raw = localStorage.getItem(DB_KEY);
  if (!raw) {
    const seeded = await seedRecipes(120); 
    localStorage.setItem(DB_KEY, JSON.stringify(seeded));
    return seeded;
  }
  return JSON.parse(raw);
}

function writeDb(items) {
  localStorage.setItem(DB_KEY, JSON.stringify(items));
}

async function fakeFetch(fn, failRate = 0.05) {
  await delay(DELAY);
  if (Math.random() < failRate) {
    throw new Error("Failed to load data. Please try again.");
  }
  return fn();
}


export async function fetchRecipes({
  page = 1,
  pageSize = 9,
  search = "",
  cuisine = "all",
  difficulty = "all",
  maxTime = 0,
  sort = "title-asc",
} = {}) {
  return fakeFetch(async () => {
    let items = await readDb(); 

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      items = items.filter((r) => r.title.toLowerCase().includes(q));
    }
    if (cuisine !== "all") items = items.filter((r) => r.cuisine === cuisine);
    if (difficulty !== "all") items = items.filter((r) => r.difficulty === difficulty);
    if (maxTime > 0) items = items.filter((r) => r.cookTime <= maxTime);

    items = [...items].sort((a, b) => {
      switch (sort) {
        case "title-asc": return a.title.localeCompare(b.title);
        case "time-asc": return a.cookTime - b.cookTime;
        case "time-desc": return b.cookTime - a.cookTime;
        case "rating-desc": return b.rating - a.rating;
        default: return 0;
      }
    });

    const total = items.length;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const safePage = Math.min(page, totalPages);
    const start = (safePage - 1) * pageSize;

    return {
      items: items.slice(start, start + pageSize),
      total,
      totalPages,
      page: safePage,
      pageSize,
    };
  });
}


export async function fetchRecipeById(id) {
  return fakeFetch(async () => {
    const db = await readDb(); 
    const found = db.find((r) => r.id === id);
    if (!found) throw new Error("Recipe not found");
    return found;
  }, 0.03);
}


export async function addRecipe(data) {
  return fakeFetch(async () => {
    const db = await readDb(); 
    const recipe = {
      ...data,
      id: `user-${Date.now()}`,
      rating: 0,
      isUserAdded: true,
    };
    writeDb([recipe, ...db]);
    return recipe;
  }, 0.05);
}

export async function fetchAllRecipes() {
  return fakeFetch(async () => readDb(), 0.03);
}

export async function updateRecipe(id, updates) {
  return fakeFetch(async () => {
    const db = await readDb();

    const index = db.findIndex((recipe) => recipe.id === id);

    if (index === -1) {
      throw new Error("Recipe not found");
    }

    if (!db[index].isUserAdded) {
      throw new Error("Only user-added recipes can be edited");
    }

    const updatedRecipe = {
      ...db[index],
      ...updates,
      id: db[index].id,
      isUserAdded: true,
    };

    const updatedDb = [...db];
    updatedDb[index] = updatedRecipe;

    writeDb(updatedDb);

    return updatedRecipe;
  }, 0.05);
}

export async function deleteRecipe(id) {
  return fakeFetch(async () => {
    const db = await readDb();

    const recipe = db.find((item) => item.id === id);

    if (!recipe) {
      throw new Error("Recipe not found");
    }

    if (!recipe.isUserAdded) {
      throw new Error("Only user-added recipes can be deleted");
    }

    const updatedDb = db.filter((item) => item.id !== id);

    writeDb(updatedDb);

    return { success: true, id };
  }, 0.05);
}
