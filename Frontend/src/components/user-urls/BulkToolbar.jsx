import React from "react";
import MovePicker from "./MovePicker.jsx";

export default function BulkToolbar({
  count,
  hasSelection,
  mutateBatch,
  clearSel,
  folders,
  onPickMove,
  showDelete = true,
}) {
  return (
    <div className="sticky top-0 z-10 mb-3">
      <div className="m-3 rounded-2xl bg-white/90 backdrop-blur-sm border border-slate-200/70 p-3 flex flex-col sm:flex-row sm:items-center gap-2 shadow-md">
        <span className="text-sm text-slate-700">
          <span className="font-semibold">{count}</span> selected
        </span>
        <div className="sm:ml-auto flex flex-wrap gap-2">
          <button
            onClick={() => mutateBatch("pause")}
            disabled={!hasSelection}
            className="inline-flex items-center gap-2 rounded-xl px-3 py-1.5 text-white bg-gradient-to-br from-amber-500 to-orange-500 disabled:opacity-50 hover:scale-[1.02] active:scale-[0.98] transition shadow shadow-amber-500/25"
          >
            Pause
          </button>
          <button
            onClick={() => mutateBatch("resume")}
            disabled={!hasSelection}
            className="inline-flex items-center gap-2 rounded-xl px-3 py-1.5 text-white bg-gradient-to-br from-emerald-500 to-green-500 disabled:opacity-50 hover:scale-[1.02] active:scale-[0.98] transition shadow shadow-emerald-500/25"
          >
            Resume
          </button>
          <button
            onClick={() => mutateBatch("disable")}
            disabled={!hasSelection}
            className="inline-flex items-center gap-2 rounded-xl px-3 py-1.5 text-white bg-slate-600 disabled:opacity-50 hover:scale-[1.02] active:scale-[0.98] transition shadow"
          >
            Disable
          </button>

          {showDelete && (
            <button
              onClick={() => mutateBatch("hardDelete")}
              disabled={!hasSelection}
              className="inline-flex items-center gap-2 rounded-xl px-3 py-1.5 text-white bg-gradient-to-br from-red-500 to-pink-500 disabled:opacity-50 hover:scale-[1.02] active:scale-[0.98] transition shadow shadow-rose-500/25"
              title="Permanently delete selected"
            >
              Delete
            </button>
          )}

          <MovePicker folders={folders} onPick={onPickMove} />
          <button
            onClick={clearSel}
            className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-700 hover:scale-[1.02] active:scale-[0.98] transition"
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
}
