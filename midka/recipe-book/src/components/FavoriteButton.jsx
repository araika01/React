export default function FavoriteButton({ isActive, onToggle, label }) {
  return (
    <button
      type="button"
      className={`fav-btn ${isActive ? "active" : ""}`}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onToggle();
      }}
      aria-label={label ?? "Favorite"}
      title={isActive ? "Remove from favorites" : "Add to favorites"}
    >
      {isActive ? "♥" : "♡"}
    </button>
  );
}