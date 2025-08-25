import React, { useMemo, useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { Plus, Search, Hash, X, Filter, Loader2 } from "lucide-react";

import { listFolders } from "../api/folder.api";
import useDebounce from "../hooks/useDebounce";
import useLinksData from "../hooks/useLinksData";
import useSelection from "../hooks/useSelection";
import useDragEdgeScroll from "../hooks/useDragEdgeScroll";
import useSentinelLoaders from "../hooks/useSentinelLoaders";
import useLinkActions from "../hooks/useLinkActions.jsx";
import { useToast } from "../context/ToastContext";

import FolderSidebar from "./FolderSidebar.jsx";
import NoUrlsCard from "./user-urls/NoUrlsCard.jsx";
import UrlRow from "./user-urls/UrlRow.jsx";
import UrlCard from "./user-urls/UrlCard.jsx";
import BulkToolbar from "./user-urls/BulkToolbar.jsx";
import MobileBulkToolbar from "./user-urls/MobileBulkToolbar.jsx";
import ConfirmModal from "./modals/ConfirmModals.jsx";

const UserUrls = () => {
  const qc = useQueryClient();
  const { show } = useToast();

  const [folderId, setFolderId] = useState(null);
  const [tagFilterInput, setTagFilterInput] = useState("");
  const [searchInput, setSearchInput] = useState("");

  // Longer debounce for better typing experience
  const debouncedSearch = useDebounce(searchInput, 800);
  const debouncedTag = useDebounce(tagFilterInput, 600);

  // Show loading indicator when user is typing but debounce hasn't fired yet
  const isSearching = searchInput !== debouncedSearch;
  const isTagFiltering = tagFilterInput !== debouncedTag;

  const { data: foldersData } = useQuery({
    queryKey: ["folders"],
    queryFn: listFolders,
    staleTime: 60_000,
  });
  const folders = foldersData?.folders || [];

  const {
    allUrls,
    filteredUrls,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useLinksData({
    folderId,
    search: debouncedSearch,
    tag: debouncedTag,
  });

  const {
    selected,
    toggle,
    clearSel,
    toggleAllOnPage,
    allSelectedOnPage,
    hasSelection,
  } = useSelection(filteredUrls);

  // Track which items have their TagEditor open
  const [openTagEditors, setOpenTagEditors] = useState(new Set());
  const isTagOpen = (id) => openTagEditors.has(id);
  const toggleTagOpen = (id) =>
    setOpenTagEditors((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  const closeAllTags = () => setOpenTagEditors(new Set());

  // Close editors when folder or filters change
  useEffect(() => {
    closeAllTags();
  }, [folderId, debouncedSearch, debouncedTag]);

  useDragEdgeScroll();
  const { tableSentinelRef, mobileSentinelRef } = useSentinelLoaders({
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  });

  const actions = useLinkActions({ qc, show, selected, clearSel });

  const countsText = useMemo(() => {
    if (isSearching || isTagFiltering) {
      return `Searching ${allUrls.length} URLs...`;
    }
    return `${filteredUrls.length} of ${allUrls.length} URLs`;
  }, [filteredUrls.length, allUrls.length, isSearching, isTagFiltering]);

  const hasActiveFilters = !!(debouncedSearch || debouncedTag);

  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-slate-50/50 via-indigo-50/30 to-purple-50/50">
        <div className="max-w-none mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
          <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
            <div className="w-full lg:w-64 hidden lg:block">
              <div className="h-48 lg:h-64 rounded-2xl sm:rounded-3xl bg-white/70 backdrop-blur-sm border border-slate-200 animate-pulse" />
            </div>
            <div className="flex-1">
              <div className="h-64 lg:h-80 rounded-2xl sm:rounded-3xl bg-white/70 backdrop-blur-sm border border-slate-200 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error && error.status === 404) {
    return (
      <div className="bg-gradient-to-br from-slate-50/50 via-indigo-50/30 to-purple-50/50">
        <div className="max-w-none mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 flex flex-col lg:flex-row gap-4 lg:gap-6">
          <div className="hidden lg:block">
            <FolderSidebar
              selectedFolderId={folderId}
              onSelect={setFolderId}
              onDropMove={actions.handleDropMove}
            />
          </div>
          <NoUrlsCard
            hasFilters={hasActiveFilters}
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
    <div className="bg-gradient-to-br from-slate-50/50 via-indigo-50/30 to-purple-50/50">
      <div className="w-full px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8 max-w-none mx-auto">
        <div className="mb-4 sm:mb-6 space-y-3 sm:space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="inline-flex w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-indigo-500" />
              <div>
                <h2 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-semibold tracking-tight bg-gradient-to-br from-indigo-500 to-purple-600 bg-clip-text text-transparent">
                  Your URLs
                </h2>
                <div className="flex items-center gap-2">
                  <p className="text-slate-600 text-xs sm:text-sm lg:text-base mt-0.5">
                    {countsText}
                  </p>
                  {(isSearching || isTagFiltering) && (
                    <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 text-indigo-500 animate-spin" />
                  )}
                </div>
              </div>
            </div>

            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2 sm:py-2.5 text-white font-medium bg-gradient-to-br from-indigo-500 to-purple-600 hover:scale-[1.02] active:scale-[0.98] transition shadow-lg shadow-indigo-500/25 text-sm sm:text-base"
            >
              <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="whitespace-nowrap">Create New</span>
            </Link>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="flex-1 relative">
              <input
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search URLs, domains, tags, or content..."
                className="w-full pl-8 sm:pl-10 pr-10 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl border border-slate-200/70 bg-white/80 backdrop-blur-sm text-sm shadow-inner shadow-slate-200/40 focus:ring-2 focus:ring-indigo-500/50 focus:outline-none transition-colors"
              />
              <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400 absolute left-2.5 sm:left-3 top-1/2 transform -translate-y-1/2" />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                {isSearching && (
                  <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 text-indigo-500 animate-spin" />
                )}
                {searchInput && (
                  <button
                    onClick={() => setSearchInput("")}
                    className="text-slate-400 hover:text-slate-600 p-0.5 hover:bg-slate-100 rounded transition-colors"
                    title="Clear search"
                  >
                    <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>
                )}
              </div>
            </div>

            <div className="flex-1 sm:flex-none sm:w-48 lg:w-56 relative">
              <input
                value={tagFilterInput}
                onChange={(e) => setTagFilterInput(e.target.value)}
                placeholder="Filter by tag..."
                className="w-full pl-6 sm:pl-8 pr-10 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl border border-slate-200/70 bg-white/80 backdrop-blur-sm text-sm shadow-inner shadow-slate-200/40 focus:ring-2 focus:ring-indigo-500/50 focus:outline-none transition-colors"
              />
              <Hash className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400 absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2" />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                {isTagFiltering && (
                  <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 text-indigo-500 animate-spin" />
                )}
                {tagFilterInput && (
                  <button
                    onClick={() => setTagFilterInput("")}
                    className="text-slate-400 hover:text-slate-600 p-0.5 hover:bg-slate-100 rounded transition-colors"
                    title="Clear tag filter"
                  >
                    <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <Filter className="w-4 h-4 text-slate-500" />
              <span className="text-slate-600">Active filters:</span>
              {debouncedSearch && (
                <span className="inline-flex items-center gap-1 px-2 sm:px-2.5 py-0.5 sm:py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-medium">
                  Search: "{debouncedSearch}"
                  <button
                    onClick={() => setSearchInput("")}
                    className="text-indigo-500 hover:text-indigo-700 ml-1 hover:bg-indigo-100 rounded p-0.5 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {debouncedTag && (
                <span className="inline-flex items-center gap-1 px-2 sm:px-2.5 py-0.5 sm:py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-medium">
                  Tag: "#{debouncedTag}"
                  <button
                    onClick={() => setTagFilterInput("")}
                    className="text-emerald-500 hover:text-emerald-700 ml-1 hover:bg-emerald-100 rounded p-0.5 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              <button
                onClick={() => {
                  setSearchInput("");
                  setTagFilterInput("");
                }}
                className="text-xs text-slate-500 hover:text-slate-700 underline ml-2"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
          <div className="hidden lg:block">
            <FolderSidebar
              selectedFolderId={folderId}
              onSelect={setFolderId}
              onDropMove={actions.handleDropMove}
            />
          </div>

          <div className="flex-1 bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl border border-slate-200/60 shadow-xl shadow-slate-200/40 overflow-visible">
            <div className="hidden lg:block overflow-visible">
              {hasSelection && (
                <BulkToolbar
                  count={selected.size}
                  hasSelection={hasSelection}
                  mutateBatch={actions.mutateBatch}
                  clearSel={clearSel}
                  folders={folders}
                  onPickMove={(fid) =>
                    actions.mutateBatch("moveToFolder", { folderId: fid })
                  }
                />
              )}

              {filteredUrls.length === 0 ? (
                <div className="p-6 sm:p-8">
                  <NoUrlsCard
                    hasFilters={hasActiveFilters}
                    onClear={() => {
                      setSearchInput("");
                      setTagFilterInput("");
                    }}
                  />
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-full">
                      <thead className="bg-white/70 backdrop-blur-sm border-b border-slate-200/70">
                        <tr>
                          <th className="px-3 sm:px-4 py-3 sm:py-4">
                            <input
                              type="checkbox"
                              checked={allSelectedOnPage}
                              onChange={toggleAllOnPage}
                              className="rounded"
                            />
                          </th>
                          <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wide min-w-0">
                            Original URL
                          </th>
                          <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wide min-w-0">
                            Short URL
                          </th>
                          <th className="px-3 sm:px-6 py-3 sm:py-4 text-center text-xs font-semibold text-slate-600 uppercase tracking-wide">
                            Folder
                          </th>
                          <th className="px-3 sm:px-6 py-3 sm:py-4 text-center text-xs font-semibold text-slate-600 uppercase tracking-wide">
                            Tags
                          </th>
                          <th className="px-3 sm:px-6 py-3 sm:py-4 text-center text-xs font-semibold text-slate-600 uppercase tracking-wide">
                            Status
                          </th>
                          <th className="px-3 sm:px-6 py-3 sm:py-4 text-center text-xs font-semibold text-slate-600 uppercase tracking-wide">
                            Clicks
                          </th>
                          <th className="px-3 sm:px-6 py-3 sm:py-4 text-center text-xs font-semibold text-slate-600 uppercase tracking-wide">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredUrls.map((url) => (
                          <UrlRow
                            key={url._id}
                            url={url}
                            folders={folders}
                            onMoveFolder={actions.onMoveFolder}
                            isSelected={selected.has(url._id)}
                            onToggleSelect={() => toggle(url._id)}
                            isTagsOpen={isTagOpen(url._id)}
                            onToggleTags={() => toggleTagOpen(url._id)}
                            actionLoading={actions.actionLoading === url._id}
                            copiedId={actions.copiedId}
                            onCopy={() =>
                              actions.handleCopy(url._id, url.shortUrl)
                            }
                            onPause={() => actions.pause(url._id)}
                            onResume={() => actions.resume(url._id)}
                            onDisable={() => actions.disable(url._id)}
                            onHardDelete={() => actions.hardDelete(url._id)}
                            selectedIds={Array.from(selected)}
                          />
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div
                    ref={tableSentinelRef}
                    className="p-3 sm:p-4 text-center text-slate-400 text-sm"
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

            <div className="lg:hidden">
              <div className="px-3 pt-3">
                <MobileBulkToolbar
                  inline
                  count={selected.size}
                  hasSelection={hasSelection}
                  mutateBatch={actions.mutateBatch}
                  clearSel={clearSel}
                  folders={folders}
                  onPickMove={(fid) =>
                    actions.mutateBatch("moveToFolder", { folderId: fid })
                  }
                  allSelectedOnPage={allSelectedOnPage}
                  toggleAllOnPage={toggleAllOnPage}
                />
              </div>

              {filteredUrls.length === 0 ? (
                <div className="p-4 sm:p-6">
                  <NoUrlsCard
                    hasFilters={hasActiveFilters}
                    onClear={() => {
                      setSearchInput("");
                      setTagFilterInput("");
                    }}
                  />
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {filteredUrls.map((url) => (
                    <UrlCard
                      key={url._id}
                      url={url}
                      folders={folders}
                      onMoveFolder={actions.onMoveFolder}
                      actionLoading={actions.actionLoading === url._id}
                      copiedId={actions.copiedId}
                      onCopy={() => actions.handleCopy(url._id, url.shortUrl)}
                      onPause={() => actions.pause(url._id)}
                      onResume={() => actions.resume(url._id)}
                      onDisable={() => actions.disable(url._id)}
                      onHardDelete={() => actions.hardDelete(url._id)}
                      isTagsOpen={isTagOpen(url._id)}
                      onToggleTags={() => toggleTagOpen(url._id)}
                      isSelected={selected.has(url._id)}
                      onToggleSelect={() => toggle(url._id)}
                      selectedIds={Array.from(selected)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div
          ref={mobileSentinelRef}
          className="lg:hidden p-3 sm:p-4 text-center text-slate-400 text-sm"
        />
      </div>

      <ConfirmModal
        open={actions.confirmDel.open}
        title="Delete Link Permanently"
        message="This action cannot be undone. The link will be permanently deleted and all analytics data will be lost."
        confirmText="Delete Permanently"
        cancelText="Cancel"
        onConfirm={actions.handleConfirmDelete}
        onClose={() =>
          actions.setConfirmDel({ open: false, id: null, busy: false })
        }
        busy={actions.confirmDel.busy}
        variant="danger"
      />
    </div>
  );
};

export default UserUrls;
