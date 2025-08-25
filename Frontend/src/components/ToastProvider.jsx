import React, { useState, useCallback } from "react";
import { CheckCircle, XCircle, AlertTriangle, Info, X } from "lucide-react";
import { ToastCtx } from "../context/ToastContext.js";

export default function ToastProvider({ children }) {
  const [items, setItems] = useState([]);

  const dismiss = useCallback((id) => {
    setItems((s) => s.filter((t) => t.id !== id));
  }, []);

  const show = useCallback(
    (content, opts = {}) => {
      const id = Math.random().toString(36).slice(2);
      const item = {
        id,
        content,
        type: opts.type || "default", // success, error, warning, info, default
        ...opts,
      };
      setItems((s) => [...s, item]);

      if (opts.duration !== 0) {
        const ms = Number.isFinite(opts.duration) ? opts.duration : 4000;
        setTimeout(() => dismiss(id), ms);
      }
      return id;
    },
    [dismiss]
  );

  const getToastStyles = (type) => {
    const styles = {
      success: {
        bg: "bg-gradient-to-r from-emerald-500 to-green-600",
        border: "border-emerald-200",
        icon: <CheckCircle className="w-5 h-5 text-white" />,
      },
      error: {
        bg: "bg-gradient-to-r from-red-500 to-red-600",
        border: "border-red-200",
        icon: <XCircle className="w-5 h-5 text-white" />,
      },
      warning: {
        bg: "bg-gradient-to-r from-amber-500 to-orange-500",
        border: "border-amber-200",
        icon: <AlertTriangle className="w-5 h-5 text-white" />,
      },
      info: {
        bg: "bg-gradient-to-r from-blue-500 to-blue-600",
        border: "border-blue-200",
        icon: <Info className="w-5 h-5 text-white" />,
      },
      default: {
        bg: "bg-gradient-to-r from-slate-800 to-slate-900",
        border: "border-slate-200",
        icon: <CheckCircle className="w-5 h-5 text-white" />,
      },
    };
    return styles[type] || styles.default;
  };

  return (
    <ToastCtx.Provider value={{ show, dismiss }}>
      {children}
      <div className="fixed z-50 bottom-4 right-4 space-y-3 max-w-sm">
        {items.map((toast) => {
          const styles = getToastStyles(toast.type);
          return (
            <div
              key={toast.id}
              className={`${styles.bg}  text-white rounded-2xl shadow-2xl max-w-sm border backdrop-blur-sm transform transition-all duration-500 ease-out animate-in slide-in-from-right-full fade-in-0`}
            >
              <div className="flex items-start gap-3 p-4">
                <div className="flex-shrink-0 mt-0.5">{styles.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium leading-relaxed">
                    {typeof toast.content === "function"
                      ? toast.content({ dismiss })
                      : toast.content}
                  </div>
                </div>
                <button
                  onClick={() => dismiss(toast.id)}
                  className="flex-shrink-0 text-white/80 hover:text-white transition-colors duration-200 rounded-lg p-1 hover:bg-white/10"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </ToastCtx.Provider>
  );
}
