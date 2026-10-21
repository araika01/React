const TITLES = {
  italian: ["Pasta Carbonara", "Margherita Pizza", "Mushroom Risotto", "Lasagna", "Tiramisu", "Panna Cotta", "Minestrone", "Ravioli", "Bruschetta", "Carpaccio"],
  asian: ["Ramen", "Pad Thai", "Salmon Sushi", "Kimchi Stew", "Tom Yum", "Dim Sum", "Chicken Udon", "Fried Rice", "Miso Soup", "Spring Rolls"],
  mexican: ["Beef Tacos", "Quesadilla", "Burrito", "Guacamole", "Enchilada", "Chili con Carne", "Nachos", "Fajitas", "Tamales", "Salsa Verde"],
  french: ["Croissant", "French Onion Soup", "Ratatouille", "Beef Bourguignon", "Creme Brulee", "Quiche Lorraine", "Baguette", "Escargot", "Madeleines", "Tarte Tatin"],
  indian: ["Chicken Biryani", "Chicken Curry", "Palak Paneer", "Samosa", "Dal Tadka", "Tandoori Chicken", "Naan Bread", "Masala Chai", "Pakora", "Raita"],
  american: ["Classic Burger", "BBQ Ribs", "Buffalo Wings", "Mac and Cheese", "Cornbread", "Club Sandwich", "Pancakes", "Brownies", "Cheesecake", "Mashed Potatoes"],
  mediterranean: ["Greek Salad", "Hummus", "Shakshuka", "Falafel", "Tabbouleh", "Dolmades", "Lamb Pita", "Baba Ganoush", "Grilled Fish", "Lemon Tart"],
  thai: ["Green Curry", "Massaman Curry", "Mango Sticky Rice", "Som Tam", "Pad See Ew", "Thai Basil Chicken", "Coconut Soup", "Larb Gai", "Satay Skewers", "Khao Pad"],
};

const CUISINES = ["italian", "asian", "mexican", "french", "indian", "american", "mediterranean", "thai"];
const DIFFICULTIES = ["easy", "medium", "hard"];

const INGREDIENTS = [
  "Salt", "Black pepper", "Olive oil", "Garlic", "Onion", "Tomatoes", "Cheese", "Chicken",
  "Beef", "Salmon", "Rice", "Pasta", "Potatoes", "Carrots", "Cream", "Flour", "Eggs",
  "Sugar", "Lemon", "Parsley",
];

const STEPS = [
  "Prepare all ingredients and heat a pan over medium heat.",
  "Saute onion and garlic until golden brown.",
  "Add main ingredients and simmer for 10 minutes.",
  "Season with salt and pepper to taste.",
  "Serve hot, garnished with fresh herbs.",
];

function pick(arr, i) {
  return arr[i % arr.length];
}

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function makeIngredients(seed) {
  const count = 3 + (seed % 4);
  const result = [];
  for (let i = 0; i < count; i++) {
    result.push({
      name: pick(INGREDIENTS, seed + i),
      amount: `${rand(1, 5) * 50} g`,
    });
  }
  return result;
}

async function getRealFoodImage() {
  try {

    const res = await fetch("https://www.themealdb.com/api/json/v1/1/random.php");
    const data = await res.json();
    if (data.meals && data.meals.length > 0) {
      return data.meals[0].strMealThumb; 
    }
  } catch (e) {
    console.warn("Could not fetch real image, using placeholder.");
  }
  
  return ""; 
}

export async function seedRecipes(count = 120) {
  const recipes = [];
  const imagePool = [];
  const fetchCount = 15; 
  
  for (let k = 0; k < fetchCount; k++) {
    const img = await getRealFoodImage();
    if (img) imagePool.push(img);
  }

  for (let i = 0; i < count; i++) {
    const cuisine = pick(CUISINES, i);
    const baseTitle = pick(TITLES[cuisine], Math.floor(i / CUISINES.length));
    const suffix = i >= CUISINES.length * 10 ? ` ${Math.floor(i / 80) + 1}` : "";
    const finalTitle = `${baseTitle}${suffix}`;

    recipes.push({
      id: `r-${String(i + 1).padStart(3, "0")}`,
      title: finalTitle,
      cuisine,
      difficulty: pick(DIFFICULTIES, i),
      cookTime: 10 + ((i * 7) % 90),
      servings: 2 + (i % 6),
      rating: Math.round((3 + ((i * 13) % 20) / 10) * 10) / 10,
      
      imageUrl: imagePool.length > 0 ? imagePool[i % imagePool.length] : "",
      ingredients: makeIngredients(i),
      steps: STEPS.slice(0, 3 + (i % 3)),
      isUserAdded: false,
    });
  }
  return recipes;
}