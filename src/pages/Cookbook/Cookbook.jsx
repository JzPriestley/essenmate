import { useEffect, useMemo, useState } from "react";
import { getFromStorage, saveToStorage } from "../../utils/storage";
import "./Cookbook.css";

const CATEGORIES = [
  "All",
  "Breakfast",
  "Lunch",
  "Dinner",
  "Snack",
  "Dessert",
  "Baking",
  "Drinks",
  "General"
];
// MAIN PAGE COMPONENT
export default function Cookbook() {
  const [recipes, setRecipes] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [cuisine, setCuisine] = useState("All");
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [editingRecipe, setEditingRecipe] = useState(null);


  useEffect(() => {
    setRecipes(getFromStorage("cookbook_recipes", []));
  }, []);

  // const addRecipe = (recipe) => {
  //   const updated = [recipe, ...recipes];
  //   setRecipes(updated);
  //   saveToStorage("cookbook_recipes", updated);
  // };

  const saveRecipe = (recipe) => {
  let updated;

  if (recipes.some(r => r.id === recipe.id)) {
    // edit
    updated = recipes.map(r =>
      r.id === recipe.id ? recipe : r
    );
  } else {
    // add
    updated = [recipe, ...recipes];
  }

  setRecipes(updated);
  saveToStorage("cookbook_recipes", updated);
  setEditingRecipe(null);
};

  const cuisines = useMemo(() => {
    const list = recipes.map(r => r.cuisine).filter(Boolean);
    return ["All", ...new Set(list)];
  }, [recipes]);

  const filteredRecipes = recipes.filter((r) => {
    // const matchSearch = r.title
    const matchSearch = (r.title || r.name || "")
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchCategory =
      category === "All" || r.category === category;

    const matchCuisine =
      cuisine === "All" || r.cuisine === cuisine;

    return matchSearch && matchCategory && matchCuisine;
  });

  return (
    <div className="cookbook-container">
      <div className="cookbook-header">
        <h2>My Cookbook</h2>
        <button
          onClick={() => {
            setEditingRecipe(null); // ensure modal opens in add mode
            setShowForm(true);
          }}
          className="add-btn"
        >
          + Add Recipe
        </button>

      </div>

      {/* FILTER BAR */}
      <div className="filter-bar">
        <input
          type="text"
          placeholder="Search recipes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select value={cuisine} onChange={(e) => setCuisine(e.target.value)}>
          {cuisines.map(c => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* CATEGORY CHIPS */}
      <div className="category-chips">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            className={category === cat ? "chip active" : "chip"}
            onClick={() => setCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <RecipeGrid recipes={filteredRecipes} onSelect={setSelectedRecipe}/>

      {showForm && (
      <AddRecipeModal
        onClose={() => {
          setShowForm(false);
          setEditingRecipe(null);
        }}
        onSave={saveRecipe}       // ✅ this is the single function handling both Add/Edit
        initialData={editingRecipe}
      />
    )}

      {selectedRecipe && (
      <RecipeDrawer
        recipe={selectedRecipe}
        onClose={() => setSelectedRecipe(null)}
        onDelete={(id) => {
          const updated = recipes.filter(r => r.id !== id);
          setRecipes(updated);
          saveToStorage("cookbook_recipes", updated);
          setSelectedRecipe(null);
        }}
        onEdit={(recipe) => {
          setEditingRecipe(recipe);
          setShowForm(true);
        }}
      />
      )}

    </div>
  );
}

// HELPER COMPONENTS
function RecipeGrid({ recipes, onSelect }) {
  if (recipes.length === 0)
    return <p>No recipes yet — add your first one! 🍳</p>;

  return (
    <div className="recipe-grid">
      {recipes.map((r) => (
        <RecipeCard key={r.id} recipe={r} onClick={() => onSelect(r)} />
      ))}
    </div>
  );
}

// function RecipeCard({ recipe }) {
//   return (
//     <div className="recipe-card">
//       <div className="img-wrapper">
//         <img src={recipe.image} alt={recipe.title} />
//       </div>

//       <div className="recipe-info">
//         <h3>{recipe.title}</h3>

//         <p className="tags">
//           {recipe.category} · {recipe.cuisine}
//         </p>

//         {recipe.sourceUrl && (
//           <a
//             href={recipe.sourceUrl}
//             target="_blank"
//             rel="noopener noreferrer"
//             className="view-link"
//           >
//             View Source →
//           </a>
//         )}
//       </div>
//     </div>
//   );
// }

function RecipeCard({ recipe, onClick }) {
  return (
    <div className="recipe-card card" onClick={onClick}>
      <div className="img-wrapper">
        <img
          src={recipe.image || "/placeholder.jpg"}
          alt={recipe.title}
        />
      </div>

      <div className="recipe-info">
        <h3>{recipe.title}</h3>

        <p className="tags">
          {recipe.category} · {recipe.cuisine}
        </p>
      </div>
    </div>
  );
}

function AddRecipeModal({ onClose, onSave, initialData }) {
  const [form, setForm] = useState(
    initialData || {
    title: "",
    image: "",
    sourceUrl: "",
    sourceType: "manual",
    category: "General",
    cuisine: "Other",
    notes: "",
    recipeIngredients: []
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const [ingredientInput, setIngredientInput] = useState("");
  const submit = () => {
    if (!form.title) return alert("Recipe name is required");

    // onSave({
    //   ...form,
    //   id: crypto.randomUUID(),
    //   createdAt: new Date().toISOString()
    // });

    onSave({
  ...form,
  id: initialData?.id || crypto.randomUUID(),
  createdAt: initialData?.createdAt || new Date().toISOString(),
  updatedAt: new Date().toISOString()
});

    onClose();
  };

  const addIngredient = () => {
  if (!ingredientInput.trim()) return;

  setForm({
    ...form,
    recipeIngredients: [...(form.recipeIngredients || []), ingredientInput.trim()]
  });

  setIngredientInput("");
  };

  const removeIngredient = (index) => {
    const updated = [...form.recipeIngredients];
    updated.splice(index, 1);
    setForm({ ...form, recipeIngredients: updated });
  };

  return (
    <div className="modal-overlay">
      <div className="modal card">
        <h3>{initialData ? "Edit Recipe" : "Add Recipe"}</h3>

        <input name="title" placeholder="Recipe name" onChange={handleChange} />

        <input
          name="image"
          placeholder="Image URL"
          onChange={handleChange}
        />

        <input
          name="sourceUrl"
          placeholder="YouTube / Instagram / Website URL (optional)"
          onChange={handleChange}
        />

        <input
          name="category"
          placeholder="Category (Breakfast, Dessert...)"
          onChange={handleChange}
        />

        <input
          name="cuisine"
          placeholder="Cuisine (Indian, German...)"
          onChange={handleChange}
        />

        <textarea
          name="notes"
          placeholder="Notes"
          onChange={handleChange}
        />
        {/* INGREDIENTS */}
        <div className="ingredients-section">
          <label>Ingredients</label>

          <div className="ingredient-input">
            <input
              type="text"
              placeholder="Add ingredient (e.g. Milk)"
              value={ingredientInput}
              onChange={(e) => setIngredientInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addIngredient()}
            />
            <button type="button" onClick={addIngredient}>+</button>
          </div>

          <div className="ingredient-list">
            {form.recipeIngredients?.map((ing, i) => (
              <span key={i} className="ingredient-chip">
                {ing}
                <button type="button" onClick={() => removeIngredient(i)}>×</button>
              </span>
            ))}
          </div>
        </div>

        <div className="modal-actions">
          <button onClick={onClose}>Cancel</button>
          <button onClick={submit} className="add-btn">
            {initialData ? "Update" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

function RecipeDrawer({ recipe, onClose, onDelete, onEdit }) {
  if (!recipe) return null;

  return (
    <div className="drawer-overlay" onClick={onClose}>
      <div className="drawer card" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>✕</button>

        <img
          className="drawer-img"
          src={recipe.image || "/placeholder.jpg"}
        />

        <h2>{recipe.title}</h2>
        <p>{recipe.category} · {recipe.cuisine}</p>

        {recipe.notes && <p className="notes">{recipe.notes}</p>}

        {recipe.recipeIngredients?.length > 0 && (
        <>
          <h4>Ingredients</h4>
          <ul className="ingredients-view">
            {recipe.recipeIngredients.map((ing, i) => (
              <li key={i}>{ing}</li>
            ))}
          </ul>
        </>
        )}

        {recipe.sourceUrl && (
          <a
            href={recipe.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            View Source →
          </a>
        )}

        <div className="drawer-actions">
          <button onClick={() => onEdit(recipe)}>Edit</button>
          <button className="danger" onClick={() => onDelete(recipe.id)}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

