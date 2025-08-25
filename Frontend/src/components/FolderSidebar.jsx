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
      show("Folder created successfully", { type: "success" });
    } catch {
      show("Failed to create folder", { type: "error" });
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
        all += unfiled;
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
      show("Folder name cannot be empty", { type: "warning" });
      return;
    }
    try {
      await renameFolder(id, newName);
      setEditingId(null);
      qc.invalidateQueries({ queryKey: ["folders"] });
      show("Folder renamed successfully", { type: "success" });
    } catch {
      show("Failed to rename folder", { type: "error" });
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
    "group flex items-center justify-between gap-2 px-4 py-3 rounded-xl cursor-pointer transition-all duration-200 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 hover:shadow-md hover:scale-[1.02] active:scale-[0.98]";

  const isActive = (id) =>
    (id ?? null) === (selectedFolderId ?? null)
      ? "bg-gradient-to-r from-indigo-100 to-purple-100 shadow-md border border-indigo-200 text-indigo-900"
      : "text-slate-700";

  const Badge = ({ num }) =>
    typeof num === "number" ? (
      <span className="ml-2 inline-flex min-w-[1.5rem] justify-center px-2.5 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-slate-100 to-slate-200 text-slate-700 shadow-sm">
        {num}
      </span>
    ) : null;

  return (
    <aside className="w-72 space-y-3 p-4 bg-white border-r border-slate-200 h-full overflow-y-auto">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Folders
        </h2>
        <p className="text-sm text-slate-500 mt-1">Organize your links</p>
      </div>

      {/* All Links */}
      <div
        className={`${itemBase} ${isActive(null)}`}
        onClick={() => onSelect(null)}
        onDragOver={allowMove}
        onDrop={(e) => handleDrop(e, null)}
        title="All links"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-sm">
            <svg
              className="w-4 h-4 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
            </svg>
          </div>
          <span className="font-medium">All Links</span>
        </div>
        <Badge num={allCount} />
      </div>

      {/* Unfiled */}
      <div
        className={`${itemBase} ${isActive("__unfiled__")}`}
        onClick={() => onSelect("__unfiled__")}
        onDragOver={allowMove}
        onDrop={(e) => handleDrop(e, "")}
        title="Unfiled links"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg shadow-sm">
            <svg
              className="w-4 h-4 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 01-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12zm-9 7a1 1 0 012 0v1.586l2.293-2.293a1 1 0 111.414 1.414L6.414 15H8a1 1 0 010 2H4a1 1 0 01-1-1v-4zm13-1a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 010-2h1.586l-2.293-2.293a1 1 0 111.414-1.414L15.586 13H14a1 1 0 01-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <span className="font-medium text-slate-600">Unfiled</span>
        </div>
        <Badge num={unfiledCount} />
      </div>

      {/* Folders Section */}
      <div className="pt-4 border-t border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-semibold text-slate-600 flex items-center gap-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
            </svg>
            Custom Folders
          </span>
          {!creating ? (
            <button
              onClick={() => setCreating(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 active:scale-95"
            >
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
              New Folder
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <input
                className="px-3 py-1.5 text-xs rounded-lg border-2 border-indigo-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none bg-white shadow-sm"
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
                className="px-3 py-1.5 text-xs rounded-lg text-white bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 shadow-lg transition-all duration-200 transform hover:scale-105 active:scale-95"
              >
                Add
              </button>
              <button
                onClick={() => {
                  setCreating(false);
                  setCreateName("");
                }}
                className="px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white hover:bg-slate-50 shadow-sm transition-all duration-200"
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        <div className="space-y-2">
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
                onClick={() => !isEditing && onSelect(f._id)}
                onDragOver={allowMove}
                onDrop={(e) => handleDrop(e, f._id)}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="p-2 bg-gradient-to-r from-slate-500 to-slate-600 rounded-lg shadow-sm group-hover:from-indigo-500 group-hover:to-purple-600 transition-all duration-200">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                    </svg>
                  </div>

                  {isEditing ? (
                    <input
                      className="flex-1 px-3 py-2 rounded-lg border-2 border-indigo-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none text-sm bg-white shadow-sm"
                      value={nameDraft}
                      onChange={(e) => setNameDraft(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") commitRename();
                        if (e.key === "Escape") setEditingId(null);
                      }}
                      autoFocus
                      onClick={(e) => e.stopPropagation()}
                    />
                  ) : (
                    <span className="font-medium truncate">{f.name}</span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <Badge num={count} />
                  {!isEditing ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        startRename(f);
                      }}
                      className="opacity-0 group-hover:opacity-100 px-2 py-1 text-xs rounded-lg bg-white border border-slate-200 hover:bg-slate-50 shadow-sm transition-all duration-200 transform hover:scale-105"
                      title="Rename folder"
                    >
                      <svg
                        className="w-3 h-3 text-slate-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                    </button>
                  ) : (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          commitRename();
                        }}
                        className="px-2 py-1 text-xs rounded-lg text-white bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 shadow-lg transition-all duration-200 transform hover:scale-105"
                        title="Save changes"
                      >
                        <svg
                          className="w-3 h-3"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingId(null);
                        }}
                        className="px-2 py-1 text-xs rounded-lg border border-slate-200 bg-white hover:bg-slate-50 shadow-sm transition-all duration-200"
                        title="Cancel editing"
                      >
                        <svg
                          className="w-3 h-3"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {folders.length === 0 && (
            <div className="text-center py-8 text-slate-500">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-slate-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                </svg>
              </div>
              <p className="text-sm font-medium text-slate-600 mb-1">
                No folders yet
              </p>
              <p className="text-xs text-slate-500">
                Create your first folder to get organized
              </p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
