import React, { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  listFolders,
  createFolder,
  deleteFolder,
  renameFolder,
} from "../api/folder.api";
import { queryClient } from "../main.jsx";

export default function FolderSidebar({ selectedFolderId, onSelect }) {
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["folders"],
    queryFn: listFolders,
    staleTime: 60_000,
  });

  const folders = data?.folders || [];

  const { mutate: addFolder, isLoading: adding } = useMutation({
    mutationFn: (n) => createFolder(n),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["folders"] });
      queryClient.invalidateQueries({ queryKey: ["userUrls"] });
      setName("");
    },
    onError: (error) => {
      alert(error?.friendlyMessage || "Failed to create folder");
    },
  });

  const { mutate: doDelete, isLoading: deleting } = useMutation({
    mutationFn: (id) => deleteFolder(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["folders"] });
      queryClient.invalidateQueries({ queryKey: ["userUrls"] });
      if (selectedFolderId && selectedFolderId !== "unfiled") {
        onSelect(null); // bounce back to All after deletion
      }
    },
    onError: (error) => {
      alert(error?.friendlyMessage || "Failed to delete folder");
    },
  });

  const { mutate: doRename, isLoading: renaming } = useMutation({
    mutationFn: ({ id, n }) => renameFolder(id, n),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["folders"] });
      setEditingId(null);
      setEditName("");
    },
    onError: (error) => {
      alert(error?.friendlyMessage || "Failed to rename folder");
      setEditingId(null);
      setEditName("");
    },
  });

  const handleCreate = (e) => {
    e.preventDefault();
    const n = name.trim();
    if (!n) return;
    if (n.length > 50) {
      alert("Folder name must be 50 characters or less");
      return;
    }

    if (folders.some((f) => f.name.toLowerCase() === n.toLowerCase())) {
      alert("A folder with this name already exists");
      return;
    }
    addFolder(n);
  };

  const startEdit = (folder) => {
    setEditingId(folder._id);
    setEditName(folder.name);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName("");
  };

  const handleRename = (e) => {
    e.preventDefault();
    const n = editName.trim();
    if (!n || n === folders.find((f) => f._id === editingId)?.name) {
      cancelEdit();
      return;
    }
    if (n.length > 50) {
      alert("Folder name must be 50 characters or less");
      return;
    }

    if (
      folders.some(
        (f) => f._id !== editingId && f.name.toLowerCase() === n.toLowerCase()
      )
    ) {
      alert("A folder with this name already exists");
      return;
    }
    doRename({ id: editingId, n });
  };

  const handleDelete = (folder) => {
    if (
      !confirm(
        `Delete folder "${folder.name}"? Links will be moved to Unfiled.`
      )
    ) {
      return;
    }
    doDelete(folder._id);
  };

  const renderItem = (id, label, badge, icon) => {
    const active = (selectedFolderId ?? null) === id;
    return (
      <button
        key={id ?? "all"}
        onClick={() => onSelect(id ?? null)}
        className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
          active
            ? "bg-blue-600 text-white"
            : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
        }`}
      >
        {icon && (
          <span
            className={`text-sm ${active ? "text-white" : "text-slate-500"}`}
          >
            {icon}
          </span>
        )}
        <span className="flex-1 text-left truncate">{label}</span>
        {badge != null && (
          <span
            className={`text-xs px-2 py-0.5 rounded-full font-medium ${
              active ? "bg-white/20 text-white" : "bg-slate-200 text-slate-700"
            }`}
          >
            {badge}
          </span>
        )}
      </button>
    );
  };

  return (
    <aside className="w-full lg:w-64 space-y-4">
      <div className="bg-white rounded-2xl border border-slate-200 p-4">
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-slate-900 mb-3">Folders</h3>

          {/* Special items */}
          <div className="space-y-1 mb-4">
            {renderItem(
              null,
              "All URLs",
              undefined,
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
            {renderItem(
              "unfiled",
              "Unfiled",
              undefined,
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </div>

          {/* Divider */}
          <div className="border-t border-slate-200 my-3"></div>
        </div>

        {/* User folders */}
        <div className="space-y-1 mb-4">
          {isLoading ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-9 rounded-lg bg-slate-100 animate-pulse"
                />
              ))}
            </div>
          ) : folders.length ? (
            folders.map((f) => (
              <div key={f._id}>
                {editingId === f._id ? (
                  <form
                    onSubmit={handleRename}
                    className="flex items-center gap-1 p-1"
                  >
                    <input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="flex-1 px-2 py-1 text-sm rounded border border-blue-300 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-200"
                      maxLength={50}
                      autoFocus
                      onBlur={() => {
                        setTimeout(cancelEdit, 150);
                      }}
                    />
                    <button
                      type="submit"
                      disabled={renaming}
                      className="p-1 text-green-600 hover:bg-green-50 rounded"
                      title="Save"
                    >
                      <svg
                        className="w-4 h-4"
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
                      type="button"
                      onClick={cancelEdit}
                      className="p-1 text-slate-400 hover:bg-slate-50 rounded"
                      title="Cancel"
                    >
                      <svg
                        className="w-4 h-4"
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
                  </form>
                ) : (
                  <div className="flex items-center gap-1">
                    {renderItem(
                      f._id,
                      f.name,
                      f.count ?? 0,
                      undefined,
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                      </svg>
                    )}
                    <div className="flex gap-0.5">
                      <button
                        onClick={() => startEdit(f)}
                        disabled={renaming || deleting}
                        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors disabled:opacity-50"
                        title="Rename folder"
                      >
                        <svg
                          className="w-3.5 h-3.5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(f)}
                        disabled={renaming || deleting}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
                        title="Delete folder"
                      >
                        <svg
                          className="w-3.5 h-3.5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-sm text-slate-500 text-center py-4 italic">
              No folders yet
            </div>
          )}
        </div>

        {/* Create new folder */}
        <div className="border-t border-slate-200 pt-4">
          <form onSubmit={handleCreate} className="space-y-3">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Create new folder..."
              maxLength={50}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-colors"
            />
            <button
              type="submit"
              disabled={adding || !name.trim()}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 focus:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {adding ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Creating...
                </>
              ) : (
                <>
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Add Folder
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </aside>
  );
}
