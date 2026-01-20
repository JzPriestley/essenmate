import { useEffect, useState } from "react";
import { getFromStorage, saveToStorage } from "../../utils/storage";
import "./Groceries.css";

const CATEGORIES = ["Vegetables", "Dairy", "Spices", "Other"];

export default function Groceries() {
  const [groceries, setGroceries] = useState([]);
  const [newItem, setNewItem] = useState(""); // always controlled string
  const [category, setCategory] = useState("Other");

  // 🔁 Sync groceries with WeekPlan & auto-import recipe ingredients
  useEffect(() => {
    const saved = getFromStorage("groceries_list", []);
    const monthPlan = getFromStorage("month_plan", {});
    const cookbook = getFromStorage("cookbook_recipes", []);

    // Keep manual items only
    const manualItems = saved.filter(item => !item.autoAdded);

    const autoItems = [];

    Object.values(monthPlan).forEach(day => {
      if (day.recipeId) {
        const recipe = cookbook.find(r => r.id === day.recipeId);

        recipe?.recipeIngredients?.forEach(ingredient => {
          if (!ingredient) return; // skip falsy

          // Check duplicates safely
          const exists =
            saved.some(i => typeof i.name === "string" && i.name.toLowerCase() === String(ingredient).toLowerCase()) ||
            autoItems.some(i => typeof i.name === "string" && i.name.toLowerCase() === String(ingredient).toLowerCase());

          if (!exists) {
            autoItems.push({
              id: crypto.randomUUID(),
              name: String(ingredient),
              category: "Other",
              checked: false,
              autoAdded: true
            });
          }
        });
      }
    });

    const updated = [...autoItems, ...manualItems];
    setGroceries(updated);
    saveToStorage("groceries_list", updated);
  }, []);

  // Save groceries to state + storage
  const saveList = (updated) => {
    setGroceries(updated);
    saveToStorage("groceries_list", updated);
  };

  // Add new manual item
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

  // Toggle checked state
  const toggleItem = (id) => {
    const updated = groceries.map(i => i.id === id ? { ...i, checked: !i.checked } : i);
    saveList(updated);
  };

  // Delete item
  const deleteItem = (id) => {
    const updated = groceries.filter(i => i.id !== id);
    saveList(updated);
  };

  // Group groceries by category
  const groupedGroceries = groceries.reduce((acc, item) => {
    const cat = item.category || "Other";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {});

  return (
    <div className="groceries-container">
      <h2>🛒 Groceries</h2>

      {/* Add new item */}
      <div className="add-item">
        <input
          type="text"
          placeholder="Add grocery item..."
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
        {Object.keys(groupedGroceries).length === 0 && <p>No groceries yet</p>}

        {Object.entries(groupedGroceries).map(([cat, items]) => (
          <div key={cat} className="grocery-group">
            <h3 className="group-title">{cat}</h3>

            {items.map(item => (
              <div key={item.id} className={`grocery-item ${item.checked ? "checked" : ""}`}>
                <label>
                  <input
                    type="checkbox"
                    checked={item.checked}
                    onChange={() => toggleItem(item.id)}
                  />
                  <span>
                    {item.name} {item.autoAdded && <small className="auto-tag">auto</small>}
                  </span>
                </label>
                <button onClick={() => deleteItem(item.id)}>✕</button>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
