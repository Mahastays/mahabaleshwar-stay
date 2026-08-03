"use client";

import { useState, useEffect } from "react";
import { Share, Heart, Check, Copy } from "lucide-react";

interface PropertyActionsProps {
  propertyId: string;
  title: string;
}

export default function PropertyActions({ propertyId, title }: PropertyActionsProps) {
  const [isSaved, setIsSaved] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<"share" | "save" | null>(null);

  useEffect(() => {
    try {
      const favorites = JSON.parse(localStorage.getItem("mahastays_favorites") || "[]");
      setIsSaved(favorites.includes(propertyId));
    } catch (e) {
      console.error("Error checking saved state:", e);
    }
  }, [propertyId]);

  const showToast = (msg: string, type: "share" | "save") => {
    setToastMessage(msg);
    setToastType(type);
    const timer = setTimeout(() => {
      setToastMessage(null);
      setToastType(null);
    }, 3000);
    return () => clearTimeout(timer);
  };

  const handleSave = () => {
    try {
      const favorites: string[] = JSON.parse(localStorage.getItem("mahastays_favorites") || "[]");
      let newFavorites: string[];
      if (isSaved) {
        newFavorites = favorites.filter(id => id !== propertyId);
        showToast("Removed from your saved properties", "save");
      } else {
        newFavorites = [...favorites, propertyId];
        showToast("Added to your saved properties!", "save");
      }
      localStorage.setItem("mahastays_favorites", JSON.stringify(newFavorites));
      setIsSaved(!isSaved);
    } catch (e) {
      console.error("Error toggling favorite:", e);
      setIsSaved(!isSaved);
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: `${title} | Mahastays`,
      text: `Check out ${title} on Mahastays!`,
      url: window.location.href,
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        // User cancelled or unsupported, fallback to copying link
        copyToClipboard();
      }
    } else {
      copyToClipboard();
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      showToast("Link copied to clipboard!", "share");
    }).catch(() => {
      showToast("Failed to copy link", "share");
    });
  };

  return (
    <div className="flex items-center gap-2 sm:gap-4 text-sm font-medium relative">
      <button 
        onClick={handleShare}
        className="flex items-center gap-2 hover:bg-gray-100/80 active:scale-95 px-3.5 py-2 rounded-xl transition-all cursor-pointer border border-transparent hover:border-gray-200"
        title="Share property link"
      >
        <Share className="w-4 h-4 text-gray-700" /> 
        <span>Share</span>
      </button>

      <button 
        onClick={handleSave}
        className="flex items-center gap-2 hover:bg-gray-100/80 active:scale-95 px-3.5 py-2 rounded-xl transition-all cursor-pointer border border-transparent hover:border-gray-200 group"
        title={isSaved ? "Remove from saved" : "Save property"}
      >
        <Heart 
          className={`w-4 h-4 transition-all duration-300 transform group-hover:scale-110 ${
            isSaved ? "fill-brand-red text-brand-red scale-110" : "text-gray-700 hover:text-brand-red"
          }`} 
        /> 
        <span>{isSaved ? "Saved" : "Save"}</span>
      </button>

      {/* Interactive Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-gray-900/95 text-white text-sm px-5 py-3.5 rounded-2xl shadow-2xl shadow-black/30 backdrop-blur-md border border-white/10 transition-all duration-300 animate-in fade-in slide-in-from-bottom-5">
          {toastType === "share" ? (
            <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 shrink-0">
              <Check className="w-4 h-4 stroke-[2.5]" />
            </div>
          ) : (
            <Heart className={`w-5 h-5 shrink-0 ${isSaved ? "fill-brand-red text-brand-red" : "text-gray-400"}`} />
          )}
          <span className="font-medium pr-1">{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
