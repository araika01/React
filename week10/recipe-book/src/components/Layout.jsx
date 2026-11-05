import { Link, NavLink, Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div className="app">
      <header className="header">
        <Link to="/" className="logo">🍳 Recipe Book</Link>
        <nav className="nav">
          <NavLink to="/" end>Recipes</NavLink>
          <NavLink to="/add">Add recipe</NavLink>
        </nav>
      </header>
      <main className="main">
        <Outlet />
      </main>
    </div>
  );
}