import React from "react";
import { X } from "lucide-react";

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  width = "max-w-lg",
  showCloseButton = true,
  closeOnOverlayClick = true,
}) {
  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={handleOverlayClick}
    >
      <div
        className={`
          w-full ${width} 
          bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 
          rounded-2xl shadow-2xl 
          border border-gray-700/50
          animate-in zoom-in-95 duration-200
        `}
      >
        {/* Header */}
        <div className="relative flex items-center justify-between px-6 py-4 border-b border-gray-700/50">
          <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-purple-500 to-pink-500 rounded-l-2xl" />

          <h2 className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            {title}
          </h2>

          {showCloseButton && (
            <button
              onClick={onClose}
              className="group relative p-1 text-gray-400 transition-all duration-200 hover:text-white focus:outline-none"
              aria-label="Close modal"
            >
              <div className="absolute inset-0 rounded-full bg-white/0 transition-all duration-200 group-hover:bg-white/10" />
              <X size={20} className="relative z-10" />
            </button>
          )}
        </div>

        {/* Body */}
        <div className="p-6 text-gray-300">{children}</div>

        {/* Optional: Subtle glow effect */}
        <div className="absolute -inset-px rounded-2xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 blur-xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>
    </div>
  );
}
