//https://akurl.onrender.com
//https://akurl.vercel.app
//https://url-shortner-le4b.onrender.com


 

  
import React, { useState, useEffect } from "react";
import { Link2, Copy, Check, ExternalLink, TrendingUp, Sparkles } from "lucide-react";

function Home() {
  const [url, setUrl] = useState("");
  const [shortId, setShortId] = useState("");
  const [error, setError] = useState("");
  const [totalVisits, setTotalVisits] = useState(0);
  const [localLinks, setLocalLinks] = useState([]);
  const [copiedId, setCopiedId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallPrompt(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowInstallPrompt(false);
    }
    setDeferredPrompt(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setShortId("");
    setIsLoading(true);
    
    try {
      const cleanUrl = url.trim();
      const response = await fetch("https://akurl.onrender.com/url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: cleanUrl }),
      });

      const data = await response.json();

      if (response.ok) {
        setShortId(data.id);
        const newLink = { id: data.id, originalUrl: cleanUrl, visits: 0, createdAt: Date.now() };
        const storedLinks = [...localLinks, newLink];
        setLocalLinks(storedLinks);
        setUrl("");
      } else {
        setError(data.error || "Something went wrong");
      }
    } catch {
      setError("Failed to connect to server");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (link, id) => {
    const cleanLink = link.trim();
    navigator.clipboard.writeText(cleanLink).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  useEffect(() => {
    const fetchTotalVisits = async () => {
      try {
        const res = await fetch("https://akurl.onrender.com/url/total-visits");
        const data = await res.json();
        setTotalVisits(data.total);
      } catch {}
    };
    fetchTotalVisits();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {showInstallPrompt && (
        <div className="fixed top-0 left-0 right-0 bg-gradient-to-r from-purple-600 to-pink-600 text-white p-3 shadow-lg z-50 animate-slideDown">
          <div className="max-w-4xl mx-auto flex items-center justify-between px-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              <span className="text-sm font-medium">Install app for quick access!</span>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={handleInstall}
                className="bg-white text-purple-600 px-4 py-1 rounded-full text-sm font-semibold hover:bg-purple-50 transition"
              >
                Install
              </button>
              <button 
                onClick={() => setShowInstallPrompt(false)}
                className="text-white hover:text-purple-100 text-sm px-2"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
        <div className="text-center mb-8 md:mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl mb-4 shadow-lg">
            <Link2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
            URL Shortener
          </h1>
          <p className="text-gray-600 text-sm md:text-base">Transform long URLs into short, shareable links</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8 mb-6">
          <div className="mb-6">
            <div className="relative">
              <input
                type="url"
                placeholder="Paste your long URL here..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit(e)}
                required
                className="w-full px-4 md:px-6 py-4 md:py-5 pr-32 border-2 border-gray-200 rounded-2xl focus:border-purple-500 focus:outline-none transition text-sm md:text-base"
              />
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 md:px-8 py-2.5 md:py-3 rounded-xl font-semibold hover:shadow-lg transition disabled:opacity-50 text-sm md:text-base"
              >
                {isLoading ? "..." : "Shorten"}
              </button>
            </div>
          </div>

          {shortId && (
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-4 md:p-6 mb-6 animate-fadeIn">
              <p className="text-sm text-gray-600 mb-2 font-medium">Your shortened URL:</p>
              <div className="flex items-center gap-2 md:gap-3 bg-white rounded-xl p-3 md:p-4">
                <a
                  href={`https://akurl.onrender.com/${shortId}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 text-purple-600 hover:text-purple-700 font-semibold truncate text-sm md:text-base"
                >
                  akurl.onrender.com/{shortId}
                </a>
                <button
                  onClick={() => handleCopy(`https://akurl.onrender.com/${shortId}`, shortId)}
                  className="p-2 hover:bg-purple-50 rounded-lg transition shrink-0"
                  title="Copy to clipboard"
                >
                  {copiedId === shortId ? (
                    <Check className="w-5 h-5 text-green-600" />
                  ) : (
                    <Copy className="w-5 h-5 text-gray-600" />
                  )}
                </button>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm mb-6">
              {error}
            </div>
          )}

          <div className="flex items-center justify-center gap-2 text-gray-600 bg-gray-50 rounded-xl p-4">
            <TrendingUp className="w-5 h-5 text-purple-600" />
            <span className="font-semibold text-purple-600">{totalVisits.toLocaleString()}</span>
            <span className="text-sm">Total Visits</span>
          </div>
        </div>

        {localLinks.length > 0 && (
          <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-6">Recent Links</h2>
            <div className="space-y-3">
              {localLinks.slice().reverse().map((link, index) => (
                <div
                  key={index}
                  className="bg-gray-50 hover:bg-gray-100 rounded-xl p-4 transition group"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <a
                          href={`https://akurl.onrender.com/${link.id}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-purple-600 hover:text-purple-700 font-semibold text-sm md:text-base truncate flex items-center gap-1"
                        >
                          akurl.onrender.com/{link.id}
                          <ExternalLink className="w-3 h-3 shrink-0" />
                        </a>
                      </div>
                      <p className="text-xs md:text-sm text-gray-500 truncate">{link.originalUrl}</p>
                    </div>
                    <button
                      onClick={() => handleCopy(`https://akurl.onrender.com/${link.id}`, link.id)}
                      className="p-2 hover:bg-white rounded-lg transition shrink-0"
                    >
                      {copiedId === link.id ? (
                        <Check className="w-4 h-4 text-green-600" />
                      ) : (
                        <Copy className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes slideDown {
          from {
            transform: translateY(-100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}


export default Home;
