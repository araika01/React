export default function FilterBar({ filters, onChange, onReset, cuisines }) {
  return (
    <div className="filter-bar">
      <input
        className="input"
        type="search"
        placeholder="Search by title..."
        value={filters.search}
        onChange={(e) => onChange({ search: e.target.value })}
      />

      <select
        className="input"
        value={filters.cuisine}
        onChange={(e) => onChange({ cuisine: e.target.value })}
      >
        <option value="all">All cuisines</option>
        {cuisines.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>

      <select
        className="input"
        value={filters.difficulty}
        onChange={(e) => onChange({ difficulty: e.target.value })}
      >
        <option value="all">Any difficulty</option>
        <option value="easy">easy</option>
        <option value="medium">medium</option>
        <option value="hard">hard</option>
      </select>

      <select
        className="input"
        value={filters.maxTime}
        onChange={(e) => onChange({ maxTime: Number(e.target.value) })}
      >
        <option value={0}>Any time</option>
        <option value={15}>under 15 min</option>
        <option value={30}>under 30 min</option>
        <option value={60}>under 60 min</option>
      </select>

      <select
        className="input"
        value={filters.sort}
        onChange={(e) => onChange({ sort: e.target.value })}
      >
        <option value="title-asc">Title A–Z</option>
        <option value="time-asc">Time ↑</option>
        <option value="time-desc">Time ↓</option>
        <option value="rating-desc">Top rated</option>
      </select>

      <button className="btn btn-ghost" onClick={onReset}>
        Reset
      </button>
    </div>
  );
}