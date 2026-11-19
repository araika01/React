import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const NetworkStatusContext = createContext(null);

export function NetworkStatusProvider({ children }) {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    let active = true;

    const checkConnection = async () => {
      if (!navigator.onLine) {
        if (active) setIsOnline(false);
        return;
      }

      try {
        const response = await fetch(
          "https://www.gstatic.com/generate_204",
          {
            method: "GET",
            mode: "no-cors",
            cache: "no-store",
            signal: AbortSignal.timeout(3000),
          }
        );

        if (active) {
          setIsOnline(response.type === "opaque" || response.ok);
        }
      } catch {
        if (active) setIsOnline(false);
      }
    };

    checkConnection();

    const interval = setInterval(checkConnection, 10000);

    window.addEventListener("online", checkConnection);
    window.addEventListener("offline", checkConnection);

    return () => {
      active = false;
      clearInterval(interval);
      window.removeEventListener("online", checkConnection);
      window.removeEventListener("offline", checkConnection);
    };
  }, []);

  return (
    <NetworkStatusContext.Provider value={isOnline}>
      {children}
    </NetworkStatusContext.Provider>
  );
}

export function useNetworkStatus() {
  const context = useContext(NetworkStatusContext);

  if (context === null) {
    console.trace("NetworkStatus context is missing");
    throw new Error(
        "useNetworkStatus must be used inside NetworkStatusProvider"
    );
    }

  return context;
}
