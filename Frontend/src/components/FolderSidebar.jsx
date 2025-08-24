import React, { useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { listFolders, renameFolder, createFolder } from "../api/folder.api";
import { useToast } from "../context/ToastContext";

export default function FolderSidebar({
  selectedFolderId,
  onSelect,
  onDropMove,
}) {
  const qc = useQueryClient();
  const { show } = useToast();

  const { data: foldersData } = useQuery({
    queryKey: ["folders"],
    queryFn: listFolders,
    staleTime: 60_000,
  });

  const [creating, setCreating] = useState(false);
  const [createName, setCreateName] = useState("");
  async function handleCreate() {
    const name = createName.trim();
    if (!name) return;
    try {
      await createFolder(name);
      setCreating(false);
      setCreateName("");
      qc.invalidateQueries({ queryKey: ["folders"] });
      show("Folder created");
    } catch {
      show("Create folder failed");
    }
  }

  const folders = useMemo(
    () => (Array.isArray(foldersData?.folders) ? foldersData.folders : []),
    [foldersData]
  );

  const { countsMap, allCount, unfiledCount } = useMemo(() => {
    const topCounts = (foldersData && foldersData.counts) || null;

    const fromFolders = {};
    for (const f of folders) {
      const c =
        (typeof f.count === "number" && f.count) ??
        (typeof f.linksCount === "number" && f.linksCount) ??
        (typeof f.items === "number" && f.items) ??
        null;
      if (f._id && typeof c === "number") fromFolders[f._id] = c;
    }

    const map = topCounts || fromFolders;

    let all =
      (typeof foldersData?.all === "number" && foldersData.all) ??
      (typeof foldersData?.total === "number" && foldersData.total) ??
      null;

    let unfiled =
      (typeof foldersData?.unfiled === "number" && foldersData.unfiled) ??
      (topCounts && typeof topCounts[""] === "number" ? topCounts[""] : null);

    if (all == null && map && Object.keys(map).length) {
      all = Object.values(map).reduce((s, n) => s + (Number(n) || 0), 0);
      if (typeof unfiled === "number") {
        all += 0;
      }
    }
    if (unfiled == null && typeof all === "number" && map) {
      const sumFolders = Object.values(map).reduce(
        (s, n) => s + (Number(n) || 0),
        0
      );
      if (all >= sumFolders) unfiled = all - sumFolders;
    }

    return {
      countsMap: map || {},
      allCount: all ?? null,
      unfiledCount: unfiled ?? null,
    };
  }, [foldersData, folders]);

  const [editingId, setEditingId] = useState(null);
  const [nameDraft, setNameDraft] = useState("");

  useEffect(() => {
    if (editingId === null) setNameDraft("");
  }, [editingId]);

  const startRename = (f) => {
    setEditingId(f._id);
    setNameDraft(f.name);
  };
  const commitRename = async () => {
    const id = editingId;
    const newName = nameDraft.trim();
    if (!id) return;
    if (!newName) {
      show("Folder name cannot be empty");
      return;
    }
    try {
      await renameFolder(id, newName);
      setEditingId(null);
      qc.invalidateQueries({ queryKey: ["folders"] });
    } catch {
      show("Rename failed");
    }
  };

  const allowMove = (e) => {
    if (e.dataTransfer.types.includes("application/json")) e.preventDefault();
  };
  const handleDrop = (e, folderId) => {
    e.preventDefault();
    try {
      const raw = e.dataTransfer.getData("application/json");
      const payload = JSON.parse(raw || "{}");
      const ids = Array.isArray(payload.linkIds) ? payload.linkIds : [];
      if (ids.length) onDropMove?.(ids, folderId ?? null);
    } catch {
      /* ignore */
    }
  };

  const itemBase =
    "flex items-center justify-between gap-2 px-3 py-2 rounded-xl cursor-pointer hover:bg-slate-100 transition";
  const isActive = (id) =>
    (id ?? null) === (selectedFolderId ?? null) ? "bg-slate-100" : "";
  const Badge = ({ num }) =>
    typeof num === "number" ? (
      <span className="ml-2 inline-flex min-w-[1.5rem] justify-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
        {num}
      </span>
    ) : null;

  return (
    <aside className="w-64 space-y-2">
      {/* All */}
      <div
        className={`${itemBase} ${isActive(null)}`}
        onClick={() => onSelect(null)}
        onDragOver={allowMove}
        onDrop={(e) => handleDrop(e, null)}
        title="All links"
      >
        <span className="truncate">All</span>
        <Badge num={allCount} />
      </div>
      {/* Unfiled */}
      <div
        className={`${itemBase} ${isActive("__unfiled__")}`}
        onClick={() => onSelect("__unfiled__")}
        onDragOver={allowMove}
        onDrop={(e) => handleDrop(e, "")}
        title="Unfiled"
      >
        <span className="truncate text-slate-700">Unfiled</span>
        <Badge num={unfiledCount} />
      </div>

      <div className="mt-3 pt-3 border-t border-slate-200 flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-500">Folders</span>
        {!creating ? (
          <button
            onClick={() => setCreating(true)}
            className="px-2 py-1 text-xs rounded-lg border border-slate-200 bg-white hover:bg-slate-50"
          >
            + New
          </button>
        ) : (
          <div className="flex items-center gap-1">
            <input
              className="px-2 py-1 text-xs rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 outline-none"
              value={createName}
              onChange={(e) => setCreateName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleCreate();
                if (e.key === "Escape") {
                  setCreating(false);
                  setCreateName("");
                }
              }}
              autoFocus
              placeholder="Folder name"
            />
            <button
              onClick={handleCreate}
              className="px-2 py-1 text-xs rounded-lg text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Add
            </button>
            <button
              onClick={() => {
                setCreating(false);
                setCreateName("");
              }}
              className="px-2 py-1 text-xs rounded-lg border border-slate-200 bg-white hover:bg-slate-50"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
      <div className="space-y-1">
        {folders.map((f) => {
          const active = isActive(f._id);
          const count =
            (typeof countsMap[f._id] === "number" && countsMap[f._id]) ??
            (typeof f.count === "number" && f.count) ??
            (typeof f.linksCount === "number" && f.linksCount) ??
            null;
          const isEditing = editingId === f._id;

          return (
            <div
              key={f._id}
              className={`${itemBase} ${active}`}
              onClick={() => onSelect(f._id)}
              onDragOver={allowMove}
              onDrop={(e) => handleDrop(e, f._id)}
            >
              {isEditing ? (
                <input
                  className="flex-1 mr-2 px-2 py-1 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 outline-none text-sm"
                  value={nameDraft}
                  onChange={(e) => setNameDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") commitRename();
                    if (e.key === "Escape") setEditingId(null);
                  }}
                  autoFocus
                />
              ) : (
                <span className="truncate">{f.name}</span>
              )}

              <div className="flex items-center">
                <Badge num={count} />
                {!isEditing ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      startRename(f);
                    }}
                    className="ml-2 px-2 py-1 text-xs rounded-lg border border-slate-200 bg-white hover:bg-slate-50"
                    title="Rename"
                  >
                    Rename
                  </button>
                ) : (
                  <div className="ml-2 flex items-center gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        commitRename();
                      }}
                      className="px-2 py-1 text-xs rounded-lg text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                      Save
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingId(null);
                      }}
                      className="px-2 py-1 text-xs rounded-lg border border-slate-200 bg-white hover:bg-slate-50"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
}
