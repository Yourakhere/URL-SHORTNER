import React from "react";
import { Sparkles } from "lucide-react";

function InstallPrompt({ onInstall, onClose }) {
  return (
    <div className="fixed top-0 left-0 right-0 bg-gradient-to-r from-purple-600 to-pink-600 text-white p-3 shadow-lg z-50 animate-slideDown">
      <div className="max-w-4xl mx-auto flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5" />
          <span className="text-sm font-medium">Install app for quick access!</span>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={onInstall}
            className="bg-white text-purple-600 px-4 py-1 rounded-full text-sm font-semibold hover:bg-purple-50 transition"
          >
            Install
          </button>
          <button 
            onClick={onClose}
            className="text-white hover:text-purple-100 text-sm px-2"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}

export default InstallPrompt;
