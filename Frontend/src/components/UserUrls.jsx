import React, {
  useMemo,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import {
  useQuery,
  useQueryClient,
  useMutation,
  useInfiniteQuery,
} from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";

import { getPublicBase } from "../utils/publicBase";
import {
  updateLinkStatus,
  softDeleteLink,
  hardDeleteLink,
  moveLinkToFolder,
  listLinks,
  batchLinks,
  restoreLink,
} from "../api/shortUrl.api";
import { listFolders } from "../api/folder.api";

import FolderSidebar from "./FolderSidebar.jsx";
import { useToast } from "../context/ToastContext.js";

import useDebounce from "../hooks/useDebounce.js";
import { fuzzySearch, tagSearch } from "../utils/filtering.js";

import NoUrlsCard from "./user-urls/NoUrlsCard.jsx";
import UrlRow from "./user-urls/UrlRow.jsx";
import UrlCard from "./user-urls/UrlCard.jsx";
import BulkToolbar from "./user-urls/BulkToolbar.jsx";
import MobileBulkToolbar from "./user-urls/MobileBulkToolbar.jsx";

/* ----------------------------- */

const UserUrls = () => {
  const qc = useQueryClient();
  const { show } = useToast();

  // Filters & UI state
  const [folderId, setFolderId] = useState(null);
  const [tagFilterInput, setTagFilterInput] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useDebounce(searchInput, 300);
  const debouncedTagFilter = useDebounce(tagFilterInput, 300);

  const [copiedId, setCopiedId] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const [expandedTags, setExpandedTags] = useState({});
  const [confirmDel, setConfirmDel] = useState({
    open: false,
    id: null,
    busy: false,
  });
  // Folders
  const { data: foldersData } = useQuery({
    queryKey: ["folders"],
    queryFn: listFolders,
    staleTime: 60_000,
  });
  const folders = foldersData?.folders || [];

  // Links (infinite pagination)
  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: [
      "userUrls",
      { folderId, search: debouncedSearch, tag: debouncedTagFilter },
    ],
    queryFn: ({ pageParam }) =>
      listLinks({
        limit: 50,
        cursor: pageParam,
        folderId,
        q: debouncedSearch || undefined,
        tags: debouncedTagFilter ? debouncedTagFilter : undefined,
      }),
    getNextPageParam: (last) => last?.nextCursor ?? undefined,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  const EMPTY_PAGES = useRef([]).current;
  const pages = data?.pages ?? EMPTY_PAGES;
  const allUrls = useMemo(() => pages.flatMap((p) => p?.items ?? []), [pages]);

  // Filtered list
  const filteredUrls = useMemo(() => {
    let filtered = allUrls;
    if (debouncedSearch) {
      filtered = fuzzySearch(filtered, debouncedSearch, [
        "fullUrl",
        "shortUrl",
        "folderId.name",
        "tags",
      ]);
    }
    if (debouncedTagFilter) {
      filtered = tagSearch(filtered, debouncedTagFilter);
    }
    return filtered;
  }, [allUrls, debouncedSearch, debouncedTagFilter]);

  // Selection
  const [selected, setSelected] = useState(() => new Set());
  const allSelectedOnPage =
    filteredUrls.length > 0 && filteredUrls.every((u) => selected.has(u._id));
  const hasSelection = selected.size > 0;

  const toggle = useCallback((id) => {
    setSelected((s) => {
      const n = new Set(s);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  }, []);

  const clearSel = useCallback(() => setSelected(new Set()), []);

  const toggleAllOnPage = useCallback(() => {
    setSelected((s) => {
      const n = new Set(s);
      if (allSelectedOnPage) {
        filteredUrls.forEach((u) => n.delete(u._id));
      } else {
        filteredUrls.forEach((u) => n.add(u._id));
      }
      return n;
    });
  }, [allSelectedOnPage, filteredUrls]);

  // Infinite-scroll sentinel
  const loadMoreRef = useRef(null);
  useEffect(() => {
    if (!loadMoreRef.current) return;
    const io = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    });
    io.observe(loadMoreRef.current);
    return () => io.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  +(
    // Auto-scroll the page while dragging near top/bottom
    useEffect(() => {
      const EDGE = 80; // px from top/bottom that activates scrolling
      const SPEED = 24; // max px per tick
      const onDragOver = (e) => {
        const y = e.clientY;
        const h = window.innerHeight;
        if (y < EDGE) {
          const d = Math.ceil(((EDGE - y) / EDGE) * SPEED);
          window.scrollBy(0, -d);
        } else if (y > h - EDGE) {
          const d = Math.ceil(((y - (h - EDGE)) / EDGE) * SPEED);
          window.scrollBy(0, d);
        }
      };
      window.addEventListener("dragover", onDragOver, { passive: true });
      return () => window.removeEventListener("dragover", onDragOver);
    }, [])
  );

  // Actions
  const handleCopy = useCallback((id, shortUrl) => {
    const copiedUrl = `${getPublicBase().replace(/\/$/, "")}/${shortUrl}`;
    navigator.clipboard.writeText(copiedUrl);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }, []);

  const doAction = useCallback(
    async (fn, id) => {
      try {
        setActionLoading(id);
        await fn(id);
        qc.invalidateQueries({ queryKey: ["userUrls"] });
        qc.invalidateQueries({ queryKey: ["folders"] });
      } catch (e) {
        console.error(e);
        show(e?.friendlyMessage || "Action failed");
      } finally {
        setActionLoading(null);
      }
    },
    [qc, show]
  );

  const pause = useCallback(
    (id) => doAction((x) => updateLinkStatus(x, "paused"), id),
    [doAction]
  );

  const resume = useCallback(
    (id) => doAction((x) => updateLinkStatus(x, "active"), id),
    [doAction]
  );

  const disable = useCallback((id) => doAction(softDeleteLink, id), [doAction]);

  const hardDelete = useCallback((id) => {
    setConfirmDel({ open: true, id, busy: false });
  }, []);

  const handleConfirmDelete = async () => {
    setConfirmDel((s) => ({ ...s, busy: true }));
    try {
      await doAction((x) => hardDeleteLink(x), confirmDel.id);
    } finally {
      setConfirmDel({ open: false, id: null, busy: false });
    }
  };

  // Drop handler passed into FolderSidebar
  const handleDropMove = (ids, folderId) => {
    mutateBatch("moveToFolder", { folderId }, ids);
  };
  // Bulk mutate + Undo (for disable)
  // mutateBatch: allow override of ids (for drag-drop)

  const mutateBatch = async (op, payload = {}, idsOverride = null) => {
    const ids = idsOverride ?? Array.from(selected);
    if (!ids.length) return;
    await batchLinks(op, ids, payload);
    qc.invalidateQueries({ queryKey: ["userUrls"] });
    qc.invalidateQueries({ queryKey: ["folders"] });

    if (op === "disable" && ids.length === 1) {
      const id = ids[0];
      show(
        ({ dismiss }) => (
          <div className="flex items-center gap-3">
            <span>Link disabled.</span>
            <button
              onClick={async () => {
                await restoreLink(id);
                qc.invalidateQueries({ queryKey: ["userUrls"] });
                qc.invalidateQueries({ queryKey: ["folders"] });
                dismiss();
              }}
              className="underline"
            >
              Undo
            </button>
          </div>
        ),
        { duration: 5000 }
      );
    } else {
      show("Batch action applied");
    }
    clearSel();
  };

  // Move link into folder (row-level)
  const { mutate: moveFolder } = useMutation({
    mutationFn: ({ id, folderId }) => moveLinkToFolder(id, folderId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["userUrls"] });
      qc.invalidateQueries({ queryKey: ["folders"] });
    },
  });
  const onMoveFolder = useCallback(
    (id, folderId) => moveFolder({ id, folderId }),
    [moveFolder]
  );

  /* ----------------------------- */
  // Render

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/50">
        <div className="max-w-none mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
          <div className="flex gap-6">
            <div className="w-64 hidden lg:block">
              <div className="h-64 rounded-3xl bg-white/70 backdrop-blur-sm border border-slate-200 animate-pulse" />
            </div>
            <div className="flex-1">
              <div className="h-80 rounded-3xl bg-white/70 backdrop-blur-sm border border-slate-200 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error && error.status === 404) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/50">
        <div className="max-w-none mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 flex gap-6">
          <div className="hidden lg:block">
            <FolderSidebar
              selectedFolderId={folderId}
              onSelect={setFolderId}
              onDropMove={handleDropMove}
            />
          </div>
          <NoUrlsCard
            hasFilters={!!(debouncedSearch || debouncedTagFilter)}
            onClear={() => {
              setSearchInput("");
              setTagFilterInput("");
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/50">
      <div className="w-full px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-12 max-w-none mx-auto">
        {/* Header & Filters */}
        <div className="mb-6 space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="inline-flex w-2 h-2 rounded-full bg-indigo-500" />
              <div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight bg-gradient-to-br from-indigo-500 to-purple-600 bg-clip-text text-transparent">
                  Your URLs
                </h2>
                <p className="text-slate-600 text-sm sm:text-base">
                  Organize with folders and tags • {filteredUrls.length} of{" "}
                  {allUrls.length} URLs
                </p>
              </div>
            </div>

            <Link
              to="/create"
              className="inline-flex items-center gap-2 rounded-2xl px-4 py-2.5 text-white font-medium bg-gradient-to-br from-indigo-500 to-purple-600 hover:scale-[1.02] active:scale-[0.98] transition shadow-lg shadow-indigo-500/25"
            >
              <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 4a1 1 0 011 1v4h4a1 1 0 110 2h-4v4a1 1 0 11-2 0v-4H5a1 1 0 110-2h4V5a1 1 0 011-1z" />
              </svg>
              Create
            </Link>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="flex-1 relative">
              <input
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search URLs, domains, or content..."
                className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200/70 bg-white/80 backdrop-blur-sm text-sm shadow-inner shadow-slate-200/40 focus:ring-2 focus:ring-indigo-500/50 focus:outline-none"
              />
              <svg
                className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              {searchInput && (
                <button
                  onClick={() => setSearchInput("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
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
              )}
            </div>

            <div className="flex-1 sm:flex-none sm:w-56 relative">
              <input
                value={tagFilterInput}
                onChange={(e) => setTagFilterInput(e.target.value)}
                placeholder="Filter by tag..."
                className="w-full pl-8 pr-4 py-3 rounded-2xl border border-slate-200/70 bg-white/80 backdrop-blur-sm text-sm shadow-inner shadow-slate-200/40 focus:ring-2 focus:ring-indigo-500/50 focus:outline-none"
              />
              <span className="text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium">
                #
              </span>
              {tagFilterInput && (
                <button
                  onClick={() => setTagFilterInput("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
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
              )}
            </div>
          </div>

          {(debouncedSearch || debouncedTagFilter) && (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-slate-600">Active filters:</span>
              {debouncedSearch && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-medium">
                  Search: "{debouncedSearch}"
                  <button
                    onClick={() => setSearchInput("")}
                    className="text-indigo-500 hover:text-indigo-700"
                  >
                    ×
                  </button>
                </span>
              )}
              {debouncedTagFilter && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-medium">
                  Tag: "#{debouncedTagFilter}"
                  <button
                    onClick={() => setTagFilterInput("")}
                    className="text-emerald-500 hover:text-emerald-700"
                  >
                    ×
                  </button>
                </span>
              )}
            </div>
          )}
        </div>

        <div className="flex gap-6">
          {/* Sidebar */}
          <div className="hidden lg:block">
            <FolderSidebar
              selectedFolderId={folderId}
              onSelect={setFolderId}
              onDropMove={handleDropMove}
            />
          </div>

          {/* Main */}
          <div className="flex-1 bg-white/80 backdrop-blur-sm rounded-3xl border border-slate-200/60 shadow-xl shadow-slate-200/40 overflow-visible">
            {/* Desktop Table (widened: no horizontal slider) */}
            <div className="hidden lg:block overflow-visible">
              {hasSelection && (
                <BulkToolbar
                  count={selected.size}
                  hasSelection={hasSelection}
                  mutateBatch={mutateBatch}
                  clearSel={clearSel}
                  folders={folders}
                  onPickMove={(fid) =>
                    mutateBatch("moveToFolder", { folderId: fid })
                  }
                />
              )}

              {filteredUrls.length === 0 ? (
                <div className="p-8">
                  <NoUrlsCard
                    hasFilters={!!(debouncedSearch || debouncedTagFilter)}
                    onClear={() => {
                      setSearchInput("");
                      setTagFilterInput("");
                    }}
                  />
                </div>
              ) : (
                <>
                  <table className="w-full">
                    <thead className="bg-white/70 backdrop-blur-sm border-b border-slate-200/70">
                      <tr>
                        <th className="px-4 py-4">
                          <input
                            type="checkbox"
                            checked={allSelectedOnPage}
                            onChange={toggleAllOnPage}
                          />
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wide">
                          Original URL
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wide">
                          Short URL
                        </th>
                        <th className="px-6 py-4 text-center text-xs font-semibold text-slate-600 uppercase tracking-wide">
                          Folder
                        </th>
                        <th className="px-6 py-4 text-center text-xs font-semibold text-slate-600 uppercase tracking-wide">
                          Tags
                        </th>
                        <th className="px-6 py-4 text-center text-xs font-semibold text-slate-600 uppercase tracking-wide">
                          Status
                        </th>
                        <th className="px-6 py-4 text-center text-xs font-semibold text-slate-600 uppercase tracking-wide">
                          Clicks
                        </th>
                        <th className="px-6 py-4 text-center text-xs font-semibold text-slate-600 uppercase tracking-wide">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    {/* ---------- Desktop table rows: pass selectedIds ---------- */}
                    <tbody className="divide-y divide-slate-100">
                      {filteredUrls.map((url) => (
                        <UrlRow
                          key={url._id}
                          url={url}
                          folders={folders}
                          onMoveFolder={onMoveFolder}
                          isSelected={selected.has(url._id)}
                          onToggleSelect={() => toggle(url._id)}
                          isTagsOpen={!!expandedTags[url._id]}
                          onToggleTags={() =>
                            setExpandedTags((s) => ({
                              ...s,
                              [url._id]: !s[url._id],
                            }))
                          }
                          actionLoading={actionLoading === url._id}
                          copiedId={copiedId}
                          onCopy={() => handleCopy(url._id, url.shortUrl)}
                          onPause={() => pause(url._id)}
                          onResume={() => resume(url._id)}
                          onDisable={() => disable(url._id)}
                          onHardDelete={() => hardDelete(url._id)}
                          selectedIds={Array.from(selected)}
                        />
                      ))}
                    </tbody>
                  </table>

                  {/* Infinite scroll sentinel */}
                  <div
                    ref={loadMoreRef}
                    className="p-4 text-center text-slate-400"
                  >
                    {isFetchingNextPage
                      ? "Loading…"
                      : hasNextPage
                      ? "Scroll to load more"
                      : "End"}
                  </div>
                </>
              )}
            </div>
            {/* Mobile/Tablet Cards + inline bulk toolbar */}
            <div className="lg:hidden">
              <div className="px-3 pt-3">
                <MobileBulkToolbar
                  inline
                  count={selected.size}
                  hasSelection={hasSelection}
                  mutateBatch={mutateBatch}
                  clearSel={clearSel}
                  folders={folders}
                  onPickMove={(fid) =>
                    mutateBatch("moveToFolder", { folderId: fid })
                  }
                  allSelectedOnPage={allSelectedOnPage}
                  toggleAllOnPage={toggleAllOnPage}
                />
              </div>
              {filteredUrls.length === 0 ? (
                <div className="p-6">
                  <NoUrlsCard
                    hasFilters={!!(debouncedSearch || debouncedTagFilter)}
                    onClear={() => {
                      setSearchInput("");
                      setTagFilterInput("");
                    }}
                  />
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {/* ---------- Mobile cards: pass selectedIds ---------- */}
                  {filteredUrls.map((url) => (
                    <UrlCard
                      key={url._id}
                      url={url}
                      folders={folders}
                      onMoveFolder={onMoveFolder}
                      actionLoading={actionLoading === url._id}
                      copiedId={copiedId}
                      onCopy={() => handleCopy(url._id, url.shortUrl)}
                      onPause={() => pause(url._id)}
                      onResume={() => resume(url._id)}
                      onDisable={() => disable(url._id)}
                      onHardDelete={() => hardDelete(url._id)}
                      isTagsOpen={!!expandedTags[url._id]}
                      onToggleTags={() =>
                        setExpandedTags((s) => ({
                          ...s,
                          [url._id]: !s[url._id],
                        }))
                      }
                      isSelected={selected.has(url._id)}
                      onToggleSelect={() => toggle(url._id)}
                      selectedIds={Array.from(selected)} // << NEW
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sentinel for infinite scroll (outside table for mobile) */}
        <div
          ref={loadMoreRef}
          className="lg:hidden p-4 text-center text-slate-400"
        />
      </div>
    </div>
  );
};

export default UserUrls;
