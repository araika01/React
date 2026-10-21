export default function StateMessage({ title, message, actionLabel, onAction }) {
  return (
    <div className="state-message">
      <h3>{title}</h3>
      {message && <p>{message}</p>}
      {onAction && (
        <button className="btn" onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  );
}