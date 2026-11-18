import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div className="page home">
      <section className="hero">
        <div>
          <h1>Cook something delicious today </h1>
          <p>
            Browse 100+ recipes, filter by cuisine, difficulty and cook time,
            and track your favorites.
          </p>
          <div className="hero-actions">
            <Link className="btn btn-primary" to="/recipes">Browse recipes</Link>
            <Link className="btn btn-ghost" to="/about">About this project</Link>
          </div>
        </div>
        <img
          className="hero-img"
          src="https://images.unsplash.com/photo-1556909212-d5b604d0c90d?w=800"
          alt="Cooking"
        />
      </section>
    </div>
  );
}