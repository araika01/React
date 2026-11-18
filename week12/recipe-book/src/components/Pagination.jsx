export default function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;

  const pages = [];
  const start = Math.max(1, page - 2);
  const end = Math.min(totalPages, page + 2);
  for (let i = start; i <= end; i++) pages.push(i);

  return (
    <nav className="pagination" aria-label="Pagination">
      <button className="btn btn-ghost" disabled={page === 1} onClick={() => onChange(page - 1)}>←</button>
      {start > 1 && (
        <>
          <button className="btn btn-ghost" onClick={() => onChange(1)}>1</button>
          {start > 2 && <span className="dots">…</span>}
        </>
      )}
      {pages.map((p) => (
        <button
          key={p}
          className={`btn ${p === page ? "btn-primary" : "btn-ghost"}`}
          onClick={() => onChange(p)}
        >
          {p}
        </button>
      ))}
      {end < totalPages && (
        <>
          {end < totalPages - 1 && <span className="dots">…</span>}
          <button className="btn btn-ghost" onClick={() => onChange(totalPages)}>{totalPages}</button>
        </>
      )}
      <button className="btn btn-ghost" disabled={page === totalPages} onClick={() => onChange(page + 1)}>→</button>
    </nav>
  );
}