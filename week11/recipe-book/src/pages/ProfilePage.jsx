import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setError("");
    setLoading(true);

    try {
      await logout();
      navigate("/login", { replace: true });
    } catch (err) {
      setError("Failed to log out. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page login">
      <h1>My Profile</h1>
      <p className="muted">Welcome to your Recipe Book account!</p>

      <div className="form">
        <label className="field">
          <span>Email</span>
          <input
            className="input"
            type="text"
            value={user?.email || ""}
            readOnly
          />
        </label>

        <label className="field">
          <span>User ID (UID)</span>
          <input
            className="input"
            type="text"
            value={user?.uid || ""}
            readOnly
          />
        </label>

        {error && <p className="error" role="alert">{error}</p>}

        <button
          className="btn btn-primary"
          onClick={handleLogout}
          disabled={loading}
        >
          {loading ? "Logging out..." : "Logout"}
        </button>
      </div>
    </div>
  );
}
