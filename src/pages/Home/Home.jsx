import { Link } from "react-router-dom";
import { getFromStorage } from "../../utils/storage";
import "./Home.css";
import heroImg from "../../assets/images/hero-food.jpg";

export default function Home() {
  const recipes = getFromStorage("cookbook_recipes", []);
  const plans = getFromStorage("month_plan", {});

  const plannedDays = Object.keys(plans).length;

  return (
    <div className="home-container">
      {/* HERO */}
      <section
        className="hero"
        style={{ backgroundImage: `url(${heroImg})` }}
      >
        <div className="hero-overlay">
          <h1>🍜 EssenMate</h1>
          <p>
            Plan meals, save recipes, and generate groceries —
            all in one place.
          </p>

          <div className="hero-actions">
            <Link to="/cookbook" className="primary-btn">
              View Cookbook
            </Link>
            <Link to="/week-plan" className="secondary-btn">
              Plan This Month
            </Link>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="features">
        <FeatureCard
          title="📖 Cookbook"
          desc="Save and organize recipes with ingredients, notes & links."
          link="/cookbook"
        />

        <FeatureCard
          title="🗓 Meal Planner"
          desc="Plan meals visually on a monthly calendar."
          link="/week-plan"
        />

        <FeatureCard
          title="🛒 Groceries"
          desc="Automatically generate grocery lists from your plans."
          link="/groceries"
        />

        <FeatureCard
          title="🎲 Surprise Me"
          desc="Get inspired when you don’t know what to cook."
          link="/surprise"
        />
      </section>

      {/* STATS */}
      <section className="stats">
        <div className="stat card">
          <h3>{recipes.length}</h3>
          <p>Recipes Saved</p>
        </div>

        <div className="stat card">
          <h3>{plannedDays}</h3>
          <p>Planned Days</p>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ title, desc, link }) {
  return (
    <Link to={link} className="feature-card card">
      <h3>{title}</h3>
      <p>{desc}</p>
      <span>Open →</span>
    </Link>
  );
}
