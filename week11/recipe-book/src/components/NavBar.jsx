import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function NavBar() {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();

  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    setLoggingOut(true);

    try {
      await logout();
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
      alert("Failed to log out. Please try again.");
    } finally {
      setLoggingOut(false);
    }
  }

  return (
    <nav className="nav">
      <NavLink to="/" end>Home</NavLink>
      <NavLink to="/recipes">Recipes</NavLink>
      <NavLink to="/dashboard">Dashboard</NavLink>
      <NavLink to="/add">Add recipe</NavLink>
      <NavLink to="/about">About</NavLink>

      {!loading && (
        user ? (
          <>
            <NavLink to="/profile">Profile</NavLink>
            <button
              type="button"
              className="nav-logout"
              onClick={handleLogout}
              disabled={loggingOut}
            >
              {loggingOut ? "Logging out..." : "Logout"}
            </button>
          </>
        ) : (
          <>
            <NavLink to="/login">Login</NavLink>
            <NavLink to="/signup">Sign up</NavLink>
          </>
        )
      )}
    </nav>
  );
}
