import React, { useState } from "react";
import TagBulkModal from "./TagBulkUrl.jsx";
import ConfirmModal from "../modals/ConfirmModals.jsx";

export default function MobileBulkToolbar({
  count,
  hasSelection,
  mutateBatch,
  clearSel,
  folders,
  onPickMove,
  allSelectedOnPage, // <-- accept from parent
  toggleAllOnPage, // <-- accept from parent
}) {
  const [show, setShow] = useState(false);
  const [showTags, setShowTags] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  if (!hasSelection) return null;

  return (
    <>
      <div className="sticky top-0 z-20 bg-transparent pb-3">
        <div className="mt-2 rounded-2xl bg-white/90 backdrop-blur-sm border border-slate-200/70 p-3 shadow-md">
          <div className="flex items-center justify-between">
            {/* LEFT: select-all + count */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={!!allSelectedOnPage}
                onChange={toggleAllOnPage}
              />
              <span className="text-sm text-slate-700">
                <span className="font-semibold">{count}</span> selected
              </span>
            </div>

            <button
              onClick={() => setShow((s) => !s)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-700"
            >
              {show ? "Hide actions" : "Bulk actions"}
            </button>
          </div>

          {show && (
            <div className="mt-3 grid grid-cols-2 gap-2">
              <button
                onClick={() => mutateBatch("pause")}
                className="px-3 py-2 rounded-xl text-white bg-gradient-to-br from-amber-500 to-orange-500"
              >
                Pause
              </button>
              <button
                onClick={() => mutateBatch("resume")}
                className="px-3 py-2 rounded-xl text-white bg-gradient-to-br from-emerald-500 to-green-500"
              >
                Resume
              </button>
              <button
                onClick={() => mutateBatch("disable")}
                className="px-3 py-2 rounded-xl text-white bg-slate-600"
              >
                Disable
              </button>

              {/* NEW: Tags */}
              <button
                onClick={() => setShowTags(true)}
                className="px-3 py-2 rounded-xl text-indigo-700 bg-indigo-50 border border-indigo-200"
              >
                Tags…
              </button>

              <select
                className="col-span-2 px-3 py-2 rounded-xl border border-slate-200 bg-white"
                onChange={(e) => {
                  const fid = e.target.value || null;
                  e.currentTarget.value = "";
                  onPickMove?.(fid);
                }}
                defaultValue=""
              >
                <option value="">
                  {folders.length ? "Move to…" : "No folders"}
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
                className="px-3 py-2 rounded-xl text-white bg-gradient-to-br from-red-500 to-pink-500"
              >
                Delete
              </button>
              <button
                onClick={clearSel}
                className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-700"
              >
                Clear
              </button>
            </div>
          )}
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

      {/* use local confirmOpen and call batch hardDelete */}
      <ConfirmModal
        open={confirmOpen}
        title="Delete selected links?"
        message={`This will permanently delete ${count} selected link${
          count > 1 ? "s" : ""
        }. This cannot be undone.`}
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
