import { useNetworkStatus } from "../context/NetworkStatusContext";

export default function NetworkStatus() {
  const isOnline = useNetworkStatus();

  return (
    <div
      className={`network-status ${
        isOnline ? "network-online" : "network-offline"
      }`}
      role="status"
    >
      {isOnline ? "🟢 Online" : "🔴 Offline"}
    </div>
  );
}
