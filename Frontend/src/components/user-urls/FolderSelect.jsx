import React from "react";

export default function FolderSelect({ link, folders, onMove }) {
  // Handle both cases: folderId as object with _id property, or folderId as string
  const current =
    typeof link.folderId === "object" && link.folderId?._id
      ? link.folderId._id
      : link.folderId || null;

  return (
    <select
      className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-sm bg-white/90 backdrop-blur-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
      value={current ?? ""}
      onChange={(e) => {
        const v = e.target.value || null;
        onMove(link._id, v);
      }}
    >
      <option value="">Unfiled</option>
      {folders.map((f) => (
        <option key={f._id} value={f._id}>
          {f.name}
        </option>
      ))}
    </select>
  );
}
