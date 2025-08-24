import React, { useState } from "react";
import TagBulkModal from "./TagBulkUrl.jsx";
import ConfirmModal from "../modals/ConfirmModals.jsx";

export default function BulkToolbar({
  count,
  hasSelection,
  mutateBatch,
  clearSel,
  folders,
  onPickMove,
}) {
  const [showTags, setShowTags] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const canAct = hasSelection && count > 0;

  return (
    <>
      <div className="sticky top-0 z-10 mb-3">
        <div className="m-3 rounded-2xl bg-white/90 backdrop-blur-sm border border-slate-200/70 p-3 flex flex-col sm:flex-row sm:items-center gap-2 shadow-md">
          <span className="text-sm text-slate-700">
            <span className="font-semibold">{count}</span> selected
          </span>

          <div className="sm:ml-auto flex flex-wrap gap-2">
            <button
              onClick={() => mutateBatch("pause")}
              disabled={!canAct}
              className="inline-flex items-center gap-2 rounded-xl px-3 py-1.5 text-white bg-gradient-to-br from-amber-500 to-orange-500 disabled:opacity-50"
            >
              Pause
            </button>
            <button
              onClick={() => mutateBatch("resume")}
              disabled={!canAct}
              className="inline-flex items-center gap-2 rounded-xl px-3 py-1.5 text-white bg-gradient-to-br from-emerald-500 to-green-500 disabled:opacity-50"
            >
              Resume
            </button>
            <button
              onClick={() => mutateBatch("disable")}
              disabled={!canAct}
              className="inline-flex items-center gap-2 rounded-xl px-3 py-1.5 text-white bg-slate-600 disabled:opacity-50"
            >
              Disable
            </button>

            {/* NEW: Tags */}
            <button
              onClick={() => setShowTags(true)}
              disabled={!canAct}
              className="inline-flex items-center gap-2 rounded-xl px-3 py-1.5 text-indigo-700 bg-indigo-50 border border-indigo-200 disabled:opacity-50"
              title="Add or remove tags on selected"
            >
              Tags…
            </button>

            <select
              className="px-2.5 py-1.5 rounded-xl border border-slate-200 text-sm bg-white/90"
              onChange={(e) => {
                const fid = e.target.value || null;
                e.currentTarget.value = "";
                if (fid !== undefined) onPickMove?.(fid);
              }}
              defaultValue=""
            >
              <option value="">
                {folders.length ? "Move…" : "No folders"}
              </option>
              {folders.map((f) => (
                <option key={f._id} value={f._id}>
                  {f.name}
                </option>
              ))}
              <option value="">Unfiled</option>
            </select>

            <button
              onClick={() => setConfirmOpen(true)}
              disabled={!canAct}
              className="inline-flex items-center gap-2 rounded-xl px-3 py-1.5 text-white bg-gradient-to-br from-red-500 to-pink-500 disabled:opacity-50"
              title="Permanently delete selected links"
            >
              Delete
            </button>

            <button
              onClick={clearSel}
              className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-700"
            >
              Clear
            </button>
          </div>
        </div>
      </div>
      {/* Modals */}
      <TagBulkModal
        open={showTags}
        count={count}
        onClose={() => setShowTags(false)}
        onAdd={(tags) => {
          setShowTags(false);
          mutateBatch("addTags", { tags });
        }}
        onRemove={(tags) => {
          setShowTags(false);
          mutateBatch("removeTags", { tags });
        }}
      />
      {/* Bulk delete confirm modal */}
      <ConfirmModal
        open={confirmOpen}
        title="Delete selected links?"
        message="This will permanently delete the selected links. This cannot be undone."
        confirmText="Delete"
        onClose={() => setConfirmOpen(false)}
        onConfirm={() => {
          setConfirmOpen(false);
          mutateBatch("hardDelete");
        }}
      />
    </>
  );
}
