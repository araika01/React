import { Link } from "react-router-dom";
import FavoriteButton from "./FavoriteButton";

export default function RecipeCard({ recipe, isFavorite, onToggleFavorite }) {
  return (
    <article className="card">
      <Link to={`/recipes/${recipe.id}`} className="card-link">
        <div className="card-img-wrap">
          <img src={recipe.imageUrl} alt={recipe.title} loading="lazy" />
          <span className={`badge badge-${recipe.difficulty}`}>
            {recipe.difficulty}
          </span>
        </div>
        <div className="card-body">
          <h3 className="card-title">{recipe.title}</h3>
          <p className="card-meta">
            {recipe.cuisine} · {recipe.cookTime} min · ★ {recipe.rating}
          </p>
        </div>
      </Link>
      <div className="card-fav">
        <FavoriteButton isActive={isFavorite} onToggle={onToggleFavorite} />
      </div>
    </article>
  );
}