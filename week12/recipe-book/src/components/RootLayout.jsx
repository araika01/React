
import { Suspense } from "react";
import { Link, Outlet } from "react-router-dom";
import NavBar from "./NavBar";
import NetworkStatus from "./NetworkStatus";

export default function RootLayout() {
  return (
    <div className="app">
      <header className="header">
        <Link to="/" className="logo">🍳 Recipe Book</Link>

        <div className="header-actions">
          <NetworkStatus />
          <NavBar />
        </div>
      </header>

      <main className="main">
        <Suspense fallback={ 
          <div className="page">
              <p>Loading…</p>
            </div>
          }
        >
          <Outlet />
        </Suspense>
      </main>
    </div>
  );
}
