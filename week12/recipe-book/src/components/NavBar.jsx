import { useState } from "react";
import {
  NavLink,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function NavBar() {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [loggingOut, setLoggingOut] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  async function handleLogout() {
    setLoggingOut(true);

    try {
      await logout();
      setMenuOpen(false);
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
      alert("Failed to log out. Please try again.");
    } finally {
      setLoggingOut(false);
    }
  }

  return (
    <div className="nav-container">
      <button
        type="button"
        className="menu-toggle"
        aria-label={menuOpen ? "Close menu" : "Open menu"}
        aria-expanded={menuOpen}
        aria-controls="main-navigation"
        onClick={() => setMenuOpen((prev) => !prev)}
      >
        {menuOpen ? "✕" : "☰"}
      </button>

      <nav
        id="main-navigation"
        className={`nav ${menuOpen ? "nav-open" : ""}`}
        key={location.pathname}
      >
        <NavLink to="/" end onClick={() => setMenuOpen(false)}>
          Home
        </NavLink>

        <NavLink to="/recipes" onClick={() => setMenuOpen(false)}>
          Recipes
        </NavLink>

        <NavLink to="/public-recipes" onClick={() => setMenuOpen(false)}>
          Public Recipes
        </NavLink>

        <NavLink to="/dashboard" onClick={() => setMenuOpen(false)}>
          Dashboard
        </NavLink>

        <NavLink to="/add" onClick={() => setMenuOpen(false)}>
          Add recipe
        </NavLink>

        <NavLink to="/about" onClick={() => setMenuOpen(false)}>
          About
        </NavLink>

        {!loading &&
          (user ? (
            <>
              <NavLink
                to="/profile"
                onClick={() => setMenuOpen(false)}
              >
                Profile
              </NavLink>

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
              <NavLink
                to="/login"
                onClick={() => setMenuOpen(false)}
              >
                Login
              </NavLink>

              <NavLink
                to="/signup"
                onClick={() => setMenuOpen(false)}
              >
                Sign up
              </NavLink>
            </>
          ))}
      </nav>
    </div>
  );
}
