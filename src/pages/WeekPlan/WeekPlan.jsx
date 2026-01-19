import { useEffect, useState } from "react";
import { getFromStorage, saveToStorage } from "../../utils/storage";
import "./WeekPlan.css";

// Helper Function
const today = new Date();
const todayStr = today.toISOString().split("T")[0];

function getMonthDays() {
  const year = today.getFullYear();
  const month = today.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  const days = [];

  for (let d = 1; d <= lastDay.getDate(); d++) {
    const date = new Date(year, month, d);
    days.push({
      date,
      dateStr: date.toISOString().split("T")[0],
      day: d
    });
  }

  return {
    year,
    month,
    firstDayIndex: firstDay.getDay(), // Sun=0
    days
  };
}

export default function WeekPlan() {
  const [plan, setPlan] = useState({});
  const [recipes, setRecipes] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);

  const { year, month, days, firstDayIndex } = getMonthDays();

  useEffect(() => {
    setPlan(getFromStorage("month_plan", {}));
    setRecipes(getFromStorage("cookbook_recipes", []));
  }, []);

  const savePlan = (dateStr, data) => {
    const updated = { ...plan, [dateStr]: data };
    setPlan(updated);
    saveToStorage("month_plan", updated);
  };

  return (
    <div className="week-container">
      <h2>
        {new Date(year, month).toLocaleString("default", {
          month: "long",
          year: "numeric"
        })}
      </h2>

      <div className="calendar-grid">
        {Array(firstDayIndex)
          .fill(null)
          .map((_, i) => (
            <div key={i} className="empty-cell" />
          ))}

        {days.map(({ date, dateStr, day }) => {
          // const isPast = dateStr < todayStr;
          // const isToday = dateStr === todayStr;
          const isPast = dateStr < todayStr;
          const isToday = dateStr === todayStr;
          const isSelected = dateStr === selectedDate;
          const hasPlan = !!plan[dateStr];


          return (
            <div
              key={dateStr}
              className={`calendar-cell 
                ${isPast ? "disabled" : ""}
                ${isToday ? "today" : ""}
                ${isSelected ? "selected" : ""}`}
              onClick={() =>
                !isPast && setSelectedDate(dateStr)
              }
            >
               {/* Planned indicator dot */}
              <span className="day-number">{day}</span>

              {hasPlan && <div className="dot" />}
              {/* Sticky note icon for note only */}
              {plan[dateStr]?.note && plan[dateStr].note.trim() !== "" && (
                <div className="note-indicator" title="Note added">📝</div>
              )}
              {/* Show recipe title if available */}
              {plan[dateStr]?.recipeTitle && (
                <p className="recipe-title">
                  {plan[dateStr].recipeTitle}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {selectedDate && (
        <PlanModal
          dateStr={selectedDate}
          data={plan[selectedDate]}
          recipes={recipes}
          onClose={() => setSelectedDate(null)}
          onSave={savePlan}
        />
      )}
    </div>
  );
}

//Modal Function
function PlanModal({ dateStr, data, recipes, onClose, onSave }) {
  const [recipeId, setRecipeId] = useState(data?.recipeId || "");
  const [note, setNote] = useState(data?.note || "");

  const submit = () => {
  let recipeTitle = "";
  if (recipeId) {
    const recipe = recipes.find(r => r.id === recipeId);
    recipeTitle = recipe?.title || "";
  }

  if (!recipeId && !note.trim()) {
    alert("Please select a recipe or enter notes to save.");
    return;
  }

  onSave(dateStr, {
    recipeId: recipeId || null,
    recipeTitle,
    note: note.trim()
  });

  onClose();
  };


  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>{dateStr}</h3>

        <select
          value={recipeId}
          onChange={e => setRecipeId(e.target.value)}
        >
          <option value="">Select recipe</option>
          {recipes.map(r => (
            <option key={r.id} value={r.id}>
              {r.title}
            </option>
          ))}
        </select>

        <textarea
          placeholder="Notes (optional)"
          value={note}
          onChange={e => setNote(e.target.value)}
        />

        <div className="modal-actions">
          <button onClick={onClose}>Cancel</button>
          <button onClick={submit}>Save</button>
        </div>
      </div>
    </div>
  );
}
