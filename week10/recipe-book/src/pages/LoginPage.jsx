export default function LoginPage() {
  return (
    <div className="page login">
      <h1>Sign in</h1>
      <p className="muted">Authentication will be added in a future iteration.</p>
      <form className="form" onSubmit={(e) => e.preventDefault()}>
        <label className="field">
          <span>Email</span>
          <input className="input" type="email" placeholder="you@example.com" disabled />
        </label>
        <label className="field">
          <span>Password</span>
          <input className="input" type="password" placeholder="••••••••" disabled />
        </label>
        <button className="btn btn-primary" disabled>Sign in (coming soon)</button>
      </form>
    </div>
  );
}