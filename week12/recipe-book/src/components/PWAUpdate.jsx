import { useRegisterSW } from "virtual:pwa-register/react";

export default function PWAUpdate() {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW();

  if (!needRefresh) return null;

  return (
    <div className="pwa-update">
      <p>A new version is available!</p>

      <button
        className="btn btn-primary"
        onClick={() => updateServiceWorker(true)}
      >
        Update
      </button>

      <button
        className="btn btn-ghost"
        onClick={() => setNeedRefresh(false)}
      >
        Later
      </button>
    </div>
  );
}
