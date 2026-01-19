import { useEffect, useState } from "react";
import { getFromStorage, saveToStorage } from "../../utils/storage";
import "./Groceries.css";

const CATEGORIES = ["Vegetables", "Dairy", "Spices", "Other"];

export default function Groceries() {
  const [groceries, setGroceries] = useState([]);
  const [newItem, setNewItem] = useState("");
  const [category, setCategory] = useState("Other");

  // Load groceries + auto-generate from planned recipes
  useEffect(() => {
    const saved = getFromStorage("groceries_list", []);
    setGroceries(saved);

    const monthPlan = getFromStorage("month_plan", {});
    const cookbook = getFromStorage("cookbook_recipes", []);
    const autoItems = [];

    Object.values(monthPlan).forEach(day => {
      if (day.recipeId) {
        const recipe = cookbook.find(r => r.id === day.recipeId);
        recipe?.recipeIngredients?.forEach(ingredient => {
          // Avoid duplicates
          const exists =
            saved.some(i => i.name.toLowerCase() === ingredient.toLowerCase()) ||
            autoItems.some(i => i.name.toLowerCase() === ingredient.toLowerCase());
          if (!exists) {
            autoItems.push({
              id: crypto.randomUUID(),
              name: ingredient,
              category: "Other",
              checked: false,
              autoAdded: true
            });
          }
        });
      }
    });

    if (autoItems.length > 0) {
      const updated = [...autoItems, ...saved];
      setGroceries(updated);
      saveToStorage("groceries_list", updated);
    }
  }, []);

  // Save groceries to state + storage
  const saveList = (updated) => {
    setGroceries(updated);
    saveToStorage("groceries_list", updated);
  };

  // Add manual item
  const addItem = () => {
    if (!newItem.trim()) return;
    const item = {
      id: crypto.randomUUID(),
      name: newItem.trim(),
      category,
      checked: false,
      autoAdded: false
    };
    saveList([item, ...groceries]);
    setNewItem("");
    setCategory("Other");
  };

  // Toggle checked
  const toggleItem = (id) => {
    const updated = groceries.map(i => i.id === id ? { ...i, checked: !i.checked } : i);
    saveList(updated);
  };

  // Delete item
  const deleteItem = (id) => {
    const updated = groceries.filter(i => i.id !== id);
    saveList(updated);
  };

  return (
    <div className="groceries-container">
      <h2>Groceries</h2>

      {/* Add new item */}
      <div className="add-item">
        <input
          type="text"
          placeholder="Add new item..."
          value={newItem}
          onChange={e => setNewItem(e.target.value)}
        />
        <select value={category} onChange={e => setCategory(e.target.value)}>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <button onClick={addItem}>Add</button>
      </div>

      {/* Grocery list */}
      <div className="groceries-list">
        {groceries.length === 0 && <p>No items yet</p>}

        {groceries.map(item => (
          <div
            key={item.id}
            className={`grocery-item ${item.checked ? "checked" : ""} ${item.autoAdded ? "auto" : ""}`}
          >
            <label>
              <input
                type="checkbox"
                checked={item.checked}
                onChange={() => toggleItem(item.id)}
              />
              <span>{item.name} <small>({item.category})</small></span>
            </label>
            <button onClick={() => deleteItem(item.id)}>✕</button>
          </div>
        ))}
      </div>
    </div>
  );
}
