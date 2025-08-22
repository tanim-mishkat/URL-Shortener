import React, { useState } from "react";

export default function MovePicker({ folders = [], onPick }) {
  const [v, setV] = useState("");
  return (
    <select
      className="px-2.5 py-1.5 rounded-xl border border-slate-200 text-xs bg-white"
      value={v}
      onChange={(e) => {
        const fid = e.target.value || null;
        setV("");
        onPick?.(fid);
      }}
    >
      <option value="">{folders.length ? "Move…" : "No folders"}</option>
      {folders.map((f) => (
        <option key={f._id} value={f._id}>
          {f.name}
        </option>
      ))}
      <option value="">Unfiled</option>
    </select>
  );
}
