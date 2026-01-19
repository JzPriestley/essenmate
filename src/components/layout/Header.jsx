import { Link,NavLink } from "react-router-dom";
import "./Header.css";

export default function Header() {
  return (
    <header className="app-header">
       {/* CLICKABLE TITLE */}
          <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
            <h1>🍜 EssenMate</h1>
          </Link>

      <nav>
        <NavLink to="/">Home</NavLink>
        <NavLink to="/cookbook">Cookbook</NavLink>
        <NavLink to="/week-plan">Week Plan</NavLink>
        <NavLink to="/groceries">Groceries</NavLink>
        <NavLink to="/surprise">Surprise Me</NavLink>
      </nav>
    </header>
  );
}
