import React from "react";
import { Link } from "@tanstack/react-router";
import TagEditor from "../TagEditor.jsx";
import StatusPill from "./StatusPill.jsx";
import FolderSelect from "./FolderSelect.jsx";
import { getPublicBase } from "../../utils/publicBase";

export default function UrlCard({
  url,
  folders,
  onMoveFolder,
  actionLoading,
  copiedId,
  onCopy,
  onPause,
  onResume,
  onDisable,
  onHardDelete,
  isTagsOpen,
  onToggleTags,
  isSelected,
  onToggleSelect,
  selectedIds = [],
}) {
  const fullShort = `${getPublicBase().replace(/\/$/, "")}/${url.shortUrl}`;
  const onDragStart = (e) => {
    const ids = isSelected && selectedIds.length ? selectedIds : [url._id];
    e.dataTransfer.setData(
      "application/json",
      JSON.stringify({ linkIds: ids })
    );
    e.dataTransfer.effectAllowed = "move";
  };
  return (
    <div className="p-4 sm:p-6 space-y-4" draggable onDragStart={onDragStart}>
      {/* Header row with selection + status + clicks */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={onToggleSelect}
            className="w-4 h-4"
          />
          <StatusPill status={url.status} />
        </div>
        <div className="inline-flex items-center px-3 py-1.5 bg-slate-100 rounded-xl">
          <span className="text-slate-800 font-semibold text-sm">
            {(url.clicks ?? 0).toLocaleString()} clicks
          </span>
        </div>
      </div>

      {/* URLs */}
      <div className="space-y-3">
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1.5">
            ORIGINAL URL
          </label>
          <div className="p-3 bg-slate-50 rounded-xl">
            <p className="text-slate-900 text-sm break-all" title={url.fullUrl}>
              {url.fullUrl}
            </p>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1.5">
            SHORT URL
          </label>
          <Link
            to={fullShort}
            target="_blank"
            rel="noopener noreferrer"
            className="block p-3 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 text-indigo-700 font-medium hover:underline transition text-sm break-all"
          >
            {fullShort}
          </Link>
        </div>
      </div>

      {/* Folder + tags */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1">
          <label className="block text-xs font-medium text-slate-500 mb-1.5">
            FOLDER
          </label>
          <FolderSelect link={url} folders={folders} onMove={onMoveFolder} />
        </div>
        <div className="flex-shrink-0">
          <button
            onClick={onToggleTags}
            className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-sm font-medium transition"
          >
            {isTagsOpen ? "Hide" : "Edit"} tags
          </button>
        </div>
      </div>

      {isTagsOpen && (
        <div className="pt-2">
          <TagEditor link={url} />
        </div>
      )}

      {/* Primary actions */}
      <div className="grid grid-cols-2 gap-3">
        <Link
          to={`/stats/${url._id}`}
          target="_blank"
          className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-white font-medium bg-gradient-to-br from-blue-500 to-indigo-500 hover:scale-[1.02] active:scale-[0.98] transition text-sm shadow shadow-indigo-500/25"
        >
          Stats
        </Link>

        {url.status === "paused" ? (
          <button
            onClick={onResume}
            disabled={actionLoading}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-white font-medium bg-gradient-to-br from-emerald-500 to-green-500 hover:scale-[1.02] active:scale-[0.98] transition disabled:opacity-50 text-sm shadow shadow-emerald-500/25"
          >
            {actionLoading ? "…" : "Resume"}
          </button>
        ) : url.status === "disabled" ? (
          <button
            onClick={onResume}
            disabled={actionLoading}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-white font-medium bg-gradient-to-br from-emerald-500 to-green-500 hover:scale-[1.02] active:scale-[0.98] transition disabled:opacity-50 text-sm shadow shadow-emerald-500/25"
          >
            {actionLoading ? "…" : "Enable"}
          </button>
        ) : (
          <button
            onClick={onPause}
            disabled={actionLoading}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-white font-medium bg-gradient-to-br from-amber-500 to-orange-500 hover:scale-[1.02] active:scale-[0.98] transition disabled:opacity-50 text-sm shadow shadow-amber-500/25"
          >
            {actionLoading ? "…" : "Pause"}
          </button>
        )}
      </div>

      {/* Secondary actions */}
      <div className="grid grid-cols-3 gap-2">
        <button
          onClick={onCopy}
          className={`flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl font-medium transition text-sm ${
            copiedId === url._id
              ? "bg-gradient-to-br from-emerald-500 to-green-500 text-white shadow shadow-emerald-500/25"
              : "bg-white text-slate-700 border border-slate-200 hover:scale-[1.02] active:scale-[0.98]"
          }`}
        >
          {copiedId === url._id ? "Copied" : "Copy"}
        </button>

        {url.status !== "disabled" && (
          <button
            onClick={onDisable}
            disabled={actionLoading}
            className="flex items-center justify-center px-3 py-2.5 rounded-xl bg-slate-600 text-white font-medium hover:scale-[1.02] active:scale-[0.98] transition disabled:opacity-50 text-sm"
          >
            {actionLoading ? "…" : "Disable"}
          </button>
        )}

        <button
          onClick={onHardDelete}
          disabled={actionLoading}
          className="flex items-center justify-center px-3 py-2.5 rounded-xl text-white font-medium bg-gradient-to-br from-red-500 to-pink-500 hover:scale-[1.02] active:scale-[0.98] transition disabled:opacity-50 text-sm shadow shadow-rose-500/25"
        >
          {actionLoading ? "…" : "Delete"}
        </button>
      </div>
    </div>
  );
}
