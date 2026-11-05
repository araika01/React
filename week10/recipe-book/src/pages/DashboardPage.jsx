import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import StateMessage from "../components/StateMessage";
import { fetchAllRecipes } from "../services/api";

const avg = (nums) =>
  nums.length ? nums.reduce((a, b) => a + b, 0) / nums.length : 0;

function groupBy(items, fn) {
  const out = {};
  items.forEach((it) => {
    const k = fn(it);
    out[k] = (out[k] ?? 0) + 1;
  });
  return out;
}

export default function DashboardPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cuisine, setCuisine] = useState("all");


  useEffect(() => {
    let ignore = false;
    setLoading(true);
    setError(null);
    fetchAllRecipes()
      .then((data) => { if (!ignore) setItems(data); })
      .catch((err) => { if (!ignore) setError(err.message); })
      .finally(() => { if (!ignore) setLoading(false); });
    return () => { ignore = true; };
  }, []);

 
  const filtered = useMemo(
    () => (cuisine === "all" ? items : items.filter((r) => r.cuisine === cuisine)),
    [items, cuisine]
  );

  const cuisines = useMemo(
    () => [...new Set(items.map((r) => r.cuisine))].sort(),
    [items]
  );

  if (loading) {
    return (
      <div className="page">
        <h1>Dashboard</h1>
        <p className="muted">Loading statistics…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page">
        <h1>Dashboard</h1>
        <StateMessage title="Failed to load dashboard" message={error} />
      </div>
    );
  }


  const total         = filtered.length;
  const avgTime       = Math.round(avg(filtered.map((r) => r.cookTime)));
  const avgRating     = avg(filtered.map((r) => r.rating)).toFixed(2);
  const totalServings = filtered.reduce((s, r) => s + r.servings, 0);


  const byDifficulty = groupBy(filtered, (r) => r.difficulty);
  const byCuisine    = groupBy(filtered, (r) => r.cuisine);
  const byTime       = groupBy(filtered, (r) => {
    if (r.cookTime <= 15) return "≤15 min";
    if (r.cookTime <= 30) return "16–30 min";
    if (r.cookTime <= 60) return "31–60 min";
    return ">60 min";
  });

  return (
    <div className="page">
      <div className="page-head">
        <h1>Dashboard</h1>
        <label className="field inline">
          <span>Cuisine</span>
          <select
            className="input"
            value={cuisine}
            onChange={(e) => setCuisine(e.target.value)}
          >
            <option value="all">All</option>
            {cuisines.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </label>
      </div>

      <div className="stats">
        <StatCard label="Recipes"        value={total} />
        <StatCard label="Avg. cook time" value={`${avgTime} min`} />
        <StatCard label="Avg. rating"    value={`★ ${avgRating}`} />
        <StatCard label="Total servings" value={totalServings} />
      </div>

      <div className="breakdowns">
        <Breakdown title="By difficulty" data={byDifficulty} />
        <Breakdown title="By cuisine"    data={byCuisine} />
        <Breakdown title="By cook time"  data={byTime} />
      </div>

      <p className="links">
        <Link to="/recipes">See all recipes →</Link>
      </p>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="stat-card">
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}

function Breakdown({ title, data }) {
  const entries = Object.entries(data).sort((a, b) => b[1] - a[1]);
  const max = Math.max(...entries.map(([, n]) => n), 1);

  return (
    <div className="breakdown">
      <h3>{title}</h3>
      {entries.length === 0 && <p className="muted">No data</p>}
      {entries.map(([label, count]) => (
        <div className="bar" key={label}>
          <span className="bar-label">{label}</span>
          <div className="bar-track">
            <div
              className="bar-fill"
              style={{ width: `${(count / max) * 100}%` }}
            />
          </div>
          <span className="bar-count">{count}</span>
        </div>
      ))}
    </div>
  );
}