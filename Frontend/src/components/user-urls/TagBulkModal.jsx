import React, { useMemo, useState } from "react";

function parseTags(raw) {
  if (!raw) return [];
  // split by comma/space, strip '#' and trim, dedupe (case-insensitive)
  const seen = new Set();
  const out = [];
  raw
    .split(/[,\s]+/g)
    .map((t) => t.replace(/^#/, "").trim())
    .filter(Boolean)
    .forEach((t) => {
      const key = t.toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        out.push(t);
      }
    });
  return out;
}

export default function TagBulkModal({
  open,
  onClose,
  onAdd,      // (tags: string[]) => void
  onRemove,   // (tags: string[]) => void
  count = 0,  // number of selected links
}) {
  const [value, setValue] = useState("");
  const tags = useMemo(() => parseTags(value), [value]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 bg-slate-900/50" onClick={onClose} />
      <div className="relative z-[101] w-full max-w-lg bg-white rounded-2xl shadow-xl border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900">
          Edit tags for {count} selected
        </h3>

        <p className="mt-1 text-sm text-slate-600">
          Enter tags separated by commas or spaces. We’ll ignore “#” prefixes.
        </p>

        <div className="mt-4">
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="e.g. marketing, q3, campaign-a"
            className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 outline-none"
          />
          {tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {tags.map((t) => (
                <span
                  key={t.toLowerCase()}
                  className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700"
                >
                  #{t}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="mt-6 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
          >
            Close
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const t = parseTags(value);
                if (t.length) onRemove?.(t);
              }}
              disabled={tags.length === 0}
              className="px-3 py-2 rounded-xl text-white bg-slate-600 disabled:opacity-50"
              title="Remove these tags from selected links"
            >
              Remove
            </button>
            <button
              onClick={() => {
                const t = parseTags(value);
                if (t.length) onAdd?.(t);
              }}
              disabled={tags.length === 0}
              className="px-3 py-2 rounded-xl text-white bg-gradient-to-br from-emerald-500 to-green-500 disabled:opacity-50"
              title="Add these tags to selected links"
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
