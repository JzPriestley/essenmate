// src/data/demoData.js
export const demoRecipes = [
  {
    id: "r1",
    title: "Classic Pancakes",
    image: "/images/pancakes.jpg",
    category: "Breakfast",
    cuisine: "General",
    notes: "Fluffy and soft, serve with maple syrup.",
    recipeIngredients: [
      { name: "Flour", qty: "1 cup" },
      { name: "Milk", qty: "1 cup" },
      { name: "Egg", qty: "1" },
      { name: "Baking Powder", qty: "1 tsp" }
    ],
    sourceUrl: "https://www.allrecipes.com/recipe/21014/good-old-fashioned-pancakes/"
  },
  {
    id: "r2",
    title: "Spaghetti Carbonara",
    image: "/images/spaghetti.jpg",
    category: "Lunch",
    cuisine: "Italian",
    notes: "Use pancetta for authentic flavor.",
    recipeIngredients: [
      { name: "Spaghetti", qty: "200g" },
      { name: "Pancetta", qty: "100g" },
      { name: "Eggs", qty: "2" },
      { name: "Parmesan Cheese", qty: "50g" }
    ],
    sourceUrl: "https://www.allrecipes.com/recipe/11973/spaghetti-carbonara-ii/"
  },
  {
    id: "r3",
    title: "Grilled Chicken Salad",
    image: "/images/chicken-salad.jpg",
    category: "Lunch",
    cuisine: "General",
    notes: "Add avocado for extra creaminess.",
    recipeIngredients: [
      { name: "Chicken Breast", qty: "200g" },
      { name: "Lettuce", qty: "100g" },
      { name: "Cherry Tomatoes", qty: "50g" },
      { name: "Olive Oil", qty: "1 tbsp" }
    ],
    sourceUrl: "https://www.allrecipes.com/recipe/229156/grilled-chicken-salad-with-avocado/"
  },
  {
    id: "r4",
    title: "Chocolate Brownies",
    image: "/images/brownies.jpg",
    category: "Dessert",
    cuisine: "General",
    notes: "Use dark chocolate for richer flavor.",
    recipeIngredients: [
      { name: "Dark Chocolate", qty: "200g" },
      { name: "Butter", qty: "100g" },
      { name: "Sugar", qty: "150g" },
      { name: "Flour", qty: "100g" }
    ],
    sourceUrl: "https://www.allrecipes.com/recipe/10549/chocolate-brownies/"
  },
  {
    id: "r5",
    title: "Vegetable Stir Fry",
    image: "/images/stir-fry.jpg",
    category: "Dinner",
    cuisine: "Chinese",
    notes: "Add tofu for protein boost.",
    recipeIngredients: [
      { name: "Broccoli", qty: "100g" },
      { name: "Carrots", qty: "50g" },
      { name: "Bell Peppers", qty: "50g" },
      { name: "Soy Sauce", qty: "2 tbsp" }
    ],
    sourceUrl: "https://www.allrecipes.com/recipe/229960/vegetable-stir-fry/"
  },
  {
    id: "r6",
    title: "French Toast",
    image: "/images/french-toast.jpg",
    category: "Breakfast",
    cuisine: "French",
    notes: "Top with fresh berries and maple syrup.",
    recipeIngredients: [
      { name: "Bread Slices", qty: "2" },
      { name: "Eggs", qty: "2" },
      { name: "Milk", qty: "1/4 cup" },
      { name: "Cinnamon", qty: "1 tsp" }
    ],
    sourceUrl: "https://www.allrecipes.com/recipe/7016/french-toast-i/"
  },
  {
    id: "r7",
    title: "Margarita Pizza",
    image: "/images/pizza.jpg",
    category: "Dinner",
    cuisine: "Italian",
    notes: "Bake at high temperature for a crispy crust.",
    recipeIngredients: [
      { name: "Pizza Dough", qty: "200g" },
      { name: "Tomato Sauce", qty: "50g" },
      { name: "Mozzarella", qty: "100g" },
      { name: "Basil Leaves", qty: "5" }
    ],
    sourceUrl: "https://www.allrecipes.com/recipe/220751/margherita-pizza/"
  }
];


// Randomly assign 1-2 planned days for demo
export const demoPlan = {
  [new Date().toISOString().split("T")[0]]: {
    meals: {
      breakfast: { recipeId: "r1", recipeTitle: "Classic Pancakes" },
      lunch: null,
      dinner: null,
      dessert: null
    },
    note: "Breakfast ready!"
  },
  [new Date(new Date().setDate(new Date().getDate() + 2))
    .toISOString().split("T")[0]]: {
    meals: {
      breakfast: null,
      lunch: null,
      dinner: null,
      dessert: { recipeId: "r4", recipeTitle: "Chocolate Brownies" }
    },
    note: "Dessert after dinner"
  }
};
