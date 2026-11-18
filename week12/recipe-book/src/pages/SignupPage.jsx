import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function SignupPage() {
  const { user, loading, signup } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSignup(e) {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setSubmitting(true);

    try {
      await signup(email.trim(), password);
      navigate("/profile", { replace: true });
    } catch (err) {
      switch (err.code) {
        case "auth/email-already-in-use":
          setError("This email is already registered.");
          break;
        case "auth/invalid-email":
          setError("Please enter a valid email.");
          break;
        case "auth/weak-password":
          setError("Please choose a stronger password.");
          break;
        default:
          setError("Registration failed. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return <p>Checking authentication...</p>;
  }

  if (user) {
    return <Navigate to="/profile" replace />;
  }

  return (
    <div className="page login">
      <h1>Create an account</h1>
      <p className="muted">
        Join Recipe Book and start exploring recipes!
      </p>

      <form className="form" onSubmit={handleSignup}>
        <label className="field">
          <span>Email</span>
          <input
            className="input"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>

        <label className="field">
          <span>Password</span>
          <input
            className="input"
            type="password"
            placeholder="At least 6 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={6}
            required
          />
        </label>

        <label className="field">
          <span>Confirm Password</span>
          <input
            className="input"
            type="password"
            placeholder="Repeat your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </label>

        {error && (
          <p className="error" role="alert">
            {error}
          </p>
        )}

        <button
          className="btn btn-primary"
          type="submit"
          disabled={submitting}
        >
          {submitting ? "Creating account..." : "Sign up"}
        </button>
      </form>

      <p className="signup-text">
        Already have an account? <Link to="/login">Sign in</Link>
      </p>
    </div>
  );
}
