import { Suspense } from "react";
import { Link, Outlet } from "react-router-dom";
import NavBar from "./NavBar";

export default function RootLayout() {
  return (
    <div className="app">
      <header className="header">
        <Link to="/" className="logo">🍳 Recipe Book</Link>
        <NavBar />
      </header>
      <main className="main">
        <Suspense fallback={<div className="page"><p>Loading…</p></div>}>
          <Outlet />
        </Suspense>
      </main>
    </div>
  );
}