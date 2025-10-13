import React, { useState, useEffect } from "react";
import Home from "./components/Home.jsx";
import InstallPrompt from "./components/InstallPrompt.jsx";

function App() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallPrompt(true);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") setShowInstallPrompt(false);
    setDeferredPrompt(null);
  };

  return (
    <>
      {showInstallPrompt && (
        <InstallPrompt
          onInstall={handleInstall}
          onClose={() => setShowInstallPrompt(false)}
        />
      )}
      <Home />
    </>
  );
}

export default App;
