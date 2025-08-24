import React from "react";
import { Link } from "@tanstack/react-router";
import TagEditor from "../TagEditor.jsx";
import StatusPill from "./StatusPill.jsx";
import FolderSelect from "./FolderSelect.jsx";
import { getPublicBase } from "../../utils/publicBase";

export default function UrlRow({
  url,
  selectedIds = [],
  isSelected,
  onToggleSelect,
  isTagsOpen,
  onToggleTags,
  folders,
  onMoveFolder,
  actionLoading,
  copiedId,
  onCopy,
  onPause,
  onResume,
  onDisable,
  onHardDelete,
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
    <tr
      className="hover:bg-slate-50/70 transition-colors align-top"
      draggable
      onDragStart={onDragStart}
    >
      <td className="px-4 py-4">
        <input type="checkbox" checked={isSelected} onChange={onToggleSelect} />
      </td>

      <td className="px-6 py-4 max-w-xs">
        <p className="text-slate-900 font-medium truncate" title={url.fullUrl}>
          {url.fullUrl}
        </p>
      </td>

      <td className="px-6 py-4">
        <Link
          to={fullShort}
          target="_blank"
          rel="noopener noreferrer"
          className="text-indigo-600 hover:text-indigo-700 font-medium hover:underline transition-colors break-all"
        >
          {fullShort}
        </Link>
      </td>

      <td className="px-6 py-4 text-center">
        <FolderSelect link={url} folders={folders} onMove={onMoveFolder} />
      </td>

      <td className="px-6 py-4 text-center">
        <button
          onClick={onToggleTags}
          className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-sm transition"
        >
          {isTagsOpen ? "Hide" : "Edit"} tags
        </button>
        {isTagsOpen && (
          <div className="mt-3 text-left">
            <TagEditor link={url} />
          </div>
        )}
      </td>

      <td className="px-6 py-4 text-center">
        <StatusPill status={url.status} />
      </td>

      <td className="px-6 py-4 text-center">
        <div className="inline-flex items-center px-3 py-1.5 rounded-xl bg-slate-100">
          <span className="text-slate-800 font-semibold text-sm">
            {(url.clicks ?? 0).toLocaleString()}
          </span>
        </div>
      </td>

      <td className="px-6 py-4 text-center">
        <div className="flex items-center justify-center gap-2 flex-wrap">
          <Link
            to={`/stats/${url._id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-xl text-white text-sm font-medium bg-gradient-to-br from-blue-500 to-indigo-500 hover:scale-[1.02] active:scale-[0.98] transition shadow shadow-indigo-500/25"
          >
            Stats
          </Link>

          {url.status === "paused" ? (
            <button
              onClick={onResume}
              disabled={actionLoading}
              className="px-3 py-1.5 rounded-xl text-white text-sm font-medium bg-gradient-to-br from-emerald-500 to-green-500 hover:scale-[1.02] active:scale-[0.98] transition disabled:opacity-50 shadow shadow-emerald-500/25"
            >
              {actionLoading ? "…" : "Resume"}
            </button>
          ) : url.status === "disabled" ? (
            <button
              onClick={onResume}
              disabled={actionLoading}
              className="px-3 py-1.5 rounded-xl text-white text-sm font-medium bg-gradient-to-br from-emerald-500 to-green-500 hover:scale-[1.02] active:scale-[0.98] transition disabled:opacity-50 shadow shadow-emerald-500/25"
            >
              {actionLoading ? "…" : "Enable"}
            </button>
          ) : (
            <button
              onClick={onPause}
              disabled={actionLoading}
              className="px-3 py-1.5 rounded-xl text-white text-sm font-medium bg-gradient-to-br from-amber-500 to-orange-500 hover:scale-[1.02] active:scale-[0.98] transition disabled:opacity-50 shadow shadow-amber-500/25"
            >
              {actionLoading ? "…" : "Pause"}
            </button>
          )}

          {url.status !== "disabled" && (
            <button
              onClick={onDisable}
              disabled={actionLoading}
              className="px-3 py-1.5 rounded-xl text-white text-sm font-medium bg-slate-600 hover:scale-[1.02] active:scale-[0.98] transition disabled:opacity-50"
            >
              {actionLoading ? "…" : "Disable"}
            </button>
          )}

          <button
            onClick={onHardDelete}
            disabled={actionLoading}
            className="px-3 py-1.5 rounded-xl text-white text-sm font-medium bg-gradient-to-br from-red-500 to-pink-500 hover:scale-[1.02] active:scale-[0.98] transition disabled:opacity-50 shadow shadow-rose-500/25"
          >
            {actionLoading ? "…" : "Delete"}
          </button>

          <button
            onClick={onCopy}
            className={`px-3 py-1.5 rounded-xl text-sm font-medium transition ${
              copiedId === url._id
                ? "bg-gradient-to-br from-emerald-500 to-green-500 text-white shadow shadow-emerald-500/25"
                : "bg-white text-slate-700 border border-slate-200 hover:scale-[1.02] active:scale-[0.98]"
            }`}
          >
            {copiedId === url._id ? "Copied!" : "Copy"}
          </button>
        </div>
      </td>
    </tr>
  );
}
