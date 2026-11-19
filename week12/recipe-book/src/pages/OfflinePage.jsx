import { useState } from "react";
import { useNetworkStatus } from "../context/NetworkStatusContext";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function OfflinePage() {
  const isOnline = useNetworkStatus();
  const navigate = useNavigate();
  const location = useLocation();

  const [message, setMessage] = useState("");

  const returnTo = location.state?.returnTo || "/";

  const handleRetry = () => {
    if (isOnline) {
      setMessage("");
      navigate(returnTo, { replace: true });
    } else {
      setMessage("Still offline. Please check your connection.");
    }
  };

  return (
    <div className="offline-page">
      <div className="offline-content">
        <div className="offline-icon">📡</div>

        <h1>You're Offline</h1>

        <p>
          It looks like you're not connected to the internet.
          Please check your connection and try again.
        </p>

        <p className="offline-status">
          Status: {isOnline ? "Online" : "Offline"}
        </p>

        {message && (
          <p role="status">{message}</p>
        )}

        <button
          type="button"
          className="btn btn-primary"
          onClick={handleRetry}
        >
          Retry
        </button>

        <Link to="/" className="btn btn-ghost">
          Back to Home
        </Link>
      </div>
    </div>
  );
}
