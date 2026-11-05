import { NavLink } from "react-router-dom";

export default function NavBar() {
  return (
    <nav className="nav">
      <NavLink to="/" end>Home</NavLink>
      <NavLink to="/recipes">Recipes</NavLink>
      <NavLink to="/dashboard">Dashboard</NavLink>
      <NavLink to="/add">Add recipe</NavLink>
      <NavLink to="/about">About</NavLink>
      <NavLink to="/login">Login</NavLink>
    </nav>
  );
}