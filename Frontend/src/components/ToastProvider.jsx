import React, { useState, useCallback } from "react";
import { ToastCtx } from "../context/ToastContext.js";

export default function ToastProvider({ children }) {
  const [items, setItems] = useState([]);

  const dismiss = useCallback((id) => {
    setItems((s) => s.filter((t) => t.id !== id));
  }, []);

  const show = useCallback(
    (content, opts = {}) => {
      const id = Math.random().toString(36).slice(2);
      const item = { id, content, ...opts };
      setItems((s) => [...s, item]);
      if (opts.duration !== 0) {
        const ms = Number.isFinite(opts.duration) ? opts.duration : 3000;
        setTimeout(() => dismiss(id), ms);
      }
      return id;
    },
    [dismiss]
  );

  return (
    <ToastCtx.Provider value={{ show, dismiss }}>
      {children}
      <div className="fixed z-50 right-4 bottom-4 space-y-2">
        {items.map((t) => (
          <div
            key={t.id}
            className="bg-slate-900 text-white rounded-xl px-4 py-3 shadow-lg max-w-xs"
          >
            <div className="text-sm">
              {typeof t.content === "function"
                ? t.content({ dismiss })
                : t.content}
            </div>
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}
