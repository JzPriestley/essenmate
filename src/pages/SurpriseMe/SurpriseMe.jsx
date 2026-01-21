import { useEffect, useMemo, useState } from "react";
import { getFromStorage , saveToStorage  } from "../../utils/storage";
import { useNavigate } from "react-router-dom";
import "./SurpriseMe.css";
import "../Cookbook/Cookbook.css"; // reuse card & drawer styles

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

export default function SurpriseMe() {
  const [recipes, setRecipes] = useState([]);
  const [category, setCategory] = useState("All");
  const [cuisine, setCuisine] = useState("All");
  const [surpriseRecipe, setSurpriseRecipe] = useState(null);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const navigate = useNavigate();


  useEffect(() => {
    setRecipes(getFromStorage("cookbook_recipes", []));
  }, []);

  const cuisines = useMemo(() => {
    const list = recipes.map(r => r.cuisine).filter(Boolean);
    return ["All", ...new Set(list)];
  }, [recipes]);

  const filteredRecipes = useMemo(() => {
    return recipes.filter(r => {
      const matchCategory =
        category === "All" || r.category === category;
      const matchCuisine =
        cuisine === "All" || r.cuisine === cuisine;

      return matchCategory && matchCuisine;
    });
  }, [recipes, category, cuisine]);

  const handleSurprise = () => {
    if (filteredRecipes.length === 0) {
      setSurpriseRecipe(null);
      return;
    }

    const randomIndex = Math.floor(
      Math.random() * filteredRecipes.length
    );
    setSurpriseRecipe(filteredRecipes[randomIndex]);
  };

  return (
    <div className="surprise-container">
      <h2>🎲 Surprise Me</h2>
      <p className="subtitle">
        Let EssenMate pick something delicious for you
      </p>

      {/* FILTERS */}
      <div className="card filters-card">
        <div className="form-row">
          <div className="form-group">
            <label>Category</label>
            <select
               style={{ width: "180px" }} 
              value={category}
              onChange={e => setCategory(e.target.value)}
            >
              {CATEGORIES.map(c => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Cuisine</label>
            <select
               style={{ width: "180px" }} 
              value={cuisine}
              onChange={e => setCuisine(e.target.value)}
            >
              {cuisines.map(c => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>

          <button
              className="reset-btn"
              onClick={() => {
                setCategory("All");
                setCuisine("All");
              }}
            >
              Reset filters
          </button>
        </div>   
      </div>

      {/* MAIN ACTION */}
      <button className="surprise-btn" onClick={handleSurprise}>
        🎉 Surprise Me!
      </button>

      {/* EMPTY STATES */}
      {recipes.length === 0 && (
        <p className="empty-state">
          You don’t have any recipes yet.  
          Add some in your Cookbook first 🍳
        </p>
      )}

      {recipes.length > 0 && filteredRecipes.length === 0 && (
        <p className="empty-state">
          No recipes match your filters.  
          Try resetting them 🙂
        </p>
      )}

      {/* RESULT */}
      {surpriseRecipe && (
        <div
          className="surprise-result card"
          onClick={() => setSelectedRecipe(surpriseRecipe)}
        >
          <div className="img-wrapper">
            <img
              src={surpriseRecipe.image || "/placeholder.jpg"}
              alt={surpriseRecipe.title}
            />
          </div>

          <div className="recipe-info">
            <h3>{surpriseRecipe.title}</h3>
            <p className="tags">
              {surpriseRecipe.category} · {surpriseRecipe.cuisine}
            </p>

            {surpriseRecipe.recipeIngredients?.length > 0 && (
              <p className="ingredients-preview">
                {surpriseRecipe.recipeIngredients
                  .slice(0, 3)
                  .map(i => i.name)
                  .join(", ")}
                {surpriseRecipe.recipeIngredients.length > 3 && "…"}
              </p>
            )}

            <div className="surprise-actions">
              <button
                className="add-btn"
                onClick={(e) => {
                  e.stopPropagation(); // ⛔ prevent opening drawer

                  saveToStorage("weekplan_prefill", {
                    recipeId: surpriseRecipe.id,
                    recipeTitle: surpriseRecipe.title
                  });

                  navigate("/week-plan");
                }}
              >
                Plan this meal
              </button>
            </div>

            <span className="hint">
              Click to view full recipe →
            </span>
          </div>
        </div>
      )}

      {selectedRecipe && (
        <RecipeDrawer
          recipe={selectedRecipe}
          onClose={() => setSelectedRecipe(null)}
        />
      )}
    </div>
  );
}

/* ───────────────────────────── */
/* Drawer (copied from Cookbook) */
/* ───────────────────────────── */

function RecipeDrawer({ recipe, onClose }) {
  if (!recipe) return null;

  return (
    <div className="drawer-overlay" onClick={onClose}>
      <div
        className="drawer card"
        onClick={e => e.stopPropagation()}
      >
        <button className="close-btn" onClick={onClose}>
          ✕
        </button>

        <img
          className="drawer-img"
          src={recipe.image || "/placeholder.jpg"}
          alt={recipe.title}
        />

        <h2>{recipe.title}</h2>
        <p>{recipe.category} · {recipe.cuisine}</p>

        {recipe.notes && (
          <p className="notes">{recipe.notes}</p>
        )}

        {recipe.recipeIngredients?.length > 0 && (
          <>
            <h4>Ingredients</h4>
            <ul className="ingredients-view">
              {recipe.recipeIngredients.map((ing, i) => (
                <li key={i}>
                  {ing.name} {ing.qty && `(${ing.qty})`}
                </li>
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
      </div>
    </div>
  );
}
