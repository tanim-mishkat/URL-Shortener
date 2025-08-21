import React, { useMemo, useState, useEffect, useCallback } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { getAllUserUrls } from "../api/user.api";
import { Link } from "@tanstack/react-router";
import { getPublicBase } from "../utils/publicBase";
import { queryClient } from "../main.jsx";
import {
  updateLinkStatus,
  softDeleteLink,
  hardDeleteLink,
  moveLinkToFolder,
} from "../api/shortUrl.api";
import FolderSidebar from "./FolderSidebar.jsx";
import TagEditor from "./TagEditor.jsx";
import { listFolders } from "../api/folder.api";

// Custom hook for debounced values
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const fuzzySearch = (items, query, keys) => {
  if (!query || query.trim() === "") return items;

  const searchTerms = query.toLowerCase().trim().split(/\s+/);

  return items.filter((item) => {
    return searchTerms.every((term) => {
      return keys.some((key) => {
        const value = key.split(".").reduce((obj, prop) => obj?.[prop], item);
        return value && value.toString().toLowerCase().includes(term);
      });
    });
  });
};

const tagSearch = (items, tagQuery) => {
  if (!tagQuery || tagQuery.trim() === "") return items;

  const searchTag = tagQuery.toLowerCase().trim();

  return items.filter((item) => {
    const tags = Array.isArray(item.tags) ? item.tags : [];
    return tags.some((tag) => tag.toLowerCase().includes(searchTag));
  });
};

const UserUrls = () => {
  const qc = useQueryClient();

  const [folderId, setFolderId] = useState(null);
  const [tagFilterInput, setTagFilterInput] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const debouncedSearch = useDebounce(searchInput, 300);
  const debouncedTagFilter = useDebounce(tagFilterInput, 300);

  const [copiedId, setCopiedId] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const [expandedTags, setExpandedTags] = useState({});

  const { data: foldersData } = useQuery({
    queryKey: ["folders"],
    queryFn: listFolders,
    staleTime: 60_000,
  });
  const folders = foldersData?.folders || [];

  const { data, isLoading, error } = useQuery({
    queryKey: ["userUrls", { folderId }],
    queryFn: () => getAllUserUrls({ folderId }),
    refetchInterval: 3000,
    staleTime: 0,
    retry: false,
  });

  const allUrls = data?.urls || [];

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

  const handleCopy = useCallback((id, shortUrl) => {
    const copiedUrl = `${getPublicBase().replace(/\/$/, "")}/${shortUrl}`;
    navigator.clipboard.writeText(copiedUrl);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }, []);

  const doAction = useCallback(async (fn, id) => {
    try {
      setActionLoading(id);
      await fn(id);
      queryClient.invalidateQueries({ queryKey: ["userUrls"] });
    } catch (e) {
      console.error(e);
      alert(e?.friendlyMessage || "Action failed");
    } finally {
      setActionLoading(null);
    }
  }, []);

  const pause = useCallback(
    (id) => doAction((x) => updateLinkStatus(x, "paused"), id),
    [doAction]
  );
  const resume = useCallback(
    (id) => doAction((x) => updateLinkStatus(x, "active"), id),
    [doAction]
  );
  const disable = useCallback((id) => doAction(softDeleteLink, id), [doAction]);
  const hardDelete = useCallback(
    (id) => {
      if (!confirm("This will permanently delete the link. Continue?")) return;
      return doAction(hardDeleteLink, id);
    },
    [doAction]
  );

  const StatusPill = ({ status }) => {
    const s = status || "active";
    const config = {
      active: {
        bg: "bg-emerald-50",
        border: "border-emerald-200",
        text: "text-emerald-700",
        dot: "bg-emerald-500",
      },
      paused: {
        bg: "bg-amber-50",
        border: "border-amber-200",
        text: "text-amber-700",
        dot: "bg-amber-500",
      },
      disabled: {
        bg: "bg-slate-50",
        border: "border-slate-200",
        text: "text-slate-600",
        dot: "bg-slate-400",
      },
    };
    const label = s[0].toUpperCase() + s.slice(1);
    return (
      <div
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${config[s].bg} ${config[s].border} ${config[s].text}`}
      >
        <div className={`w-1.5 h-1.5 rounded-full ${config[s].dot}`}></div>
        {label}
      </div>
    );
  };

  const NoUrlsCard = () => (
    <div className="flex-1">
      <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 text-center">
        <div className="max-w-sm mx-auto">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-8 h-8 sm:w-10 sm:h-10 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.102m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
              />
            </svg>
          </div>
          <h3 className="text-lg sm:text-xl font-semibold text-slate-900 mb-2">
            {debouncedSearch || debouncedTagFilter
              ? "No matching URLs found"
              : "No URLs yet"}
          </h3>
          <p className="text-slate-500 text-sm sm:text-base">
            {debouncedSearch || debouncedTagFilter
              ? "Try adjusting your search or filter criteria"
              : "Create your first shortened URL to get started tracking clicks and analytics!"}
          </p>
          {(debouncedSearch || debouncedTagFilter) && (
            <button
              onClick={() => {
                setSearchInput("");
                setTagFilterInput("");
              }}
              className="mt-4 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>
    </div>
  );

  // Move link into folder
  const { mutate: moveFolder, isLoading: moving } = useMutation({
    mutationFn: ({ id, folderId }) => moveLinkToFolder(id, folderId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["userUrls"] });
    },
  });

  const FolderSelect = ({ link }) => {
    const current = link.folderId?._id || null;
    return (
      <select
        className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-sm bg-white focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
        value={current ?? ""}
        onChange={(e) => {
          const v = e.target.value || null;
          moveFolder({ id: link._id, folderId: v });
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
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-none mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
          <div className="flex gap-6">
            <div className="w-64 hidden lg:block">
              <div className="h-64 rounded-2xl bg-white border border-slate-200 animate-pulse" />
            </div>
            <div className="flex-1">
              <div className="h-80 rounded-2xl bg-white border border-slate-200 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error && error.status === 404) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-none mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 flex gap-6">
          <div className="hidden lg:block">
            <FolderSidebar selectedFolderId={folderId} onSelect={setFolderId} />
          </div>
          <NoUrlsCard />
        </div>
      </div>
    );
  }

  // Main 
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="w-full px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8 max-w-none mx-auto">
        {/* Header & Filters */}
        <div className="mb-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-100 rounded-xl">
              <svg
                className="w-6 h-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.102m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900">
                Your URLs
              </h2>
              <p className="text-slate-500 text-sm sm:text-base">
                Organize with folders and tags • {filteredUrls.length} of{" "}
                {allUrls.length} URLs
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="flex-1 relative">
              <input
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search URLs, domains, or content..."
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-sm bg-white focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-colors"
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
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
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
            <div className="flex-1 sm:flex-none sm:w-48 relative">
              <input
                value={tagFilterInput}
                onChange={(e) => setTagFilterInput(e.target.value)}
                placeholder="Filter by tag..."
                className="w-full pl-8 pr-4 py-3 rounded-xl border border-slate-200 text-sm bg-white focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-colors"
              />
              <span className="text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2 text-sm font-medium">
                #
              </span>
              {tagFilterInput && (
                <button
                  onClick={() => setTagFilterInput("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
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

          {/* Active filters indicator */}
          {(debouncedSearch || debouncedTagFilter) && (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-slate-600">Active filters:</span>
              {debouncedSearch && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                  Search: "{debouncedSearch}"
                  <button
                    onClick={() => setSearchInput("")}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    ×
                  </button>
                </span>
              )}
              {debouncedTagFilter && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                  Tag: "#{debouncedTagFilter}"
                  <button
                    onClick={() => setTagFilterInput("")}
                    className="text-green-500 hover:text-green-700"
                  >
                    ×
                  </button>
                </span>
              )}
            </div>
          )}
        </div>

        <div className="flex gap-6">
          {/* Sidebar (folders) */}
          <div className="hidden lg:block">
            <FolderSidebar selectedFolderId={folderId} onSelect={setFolderId} />
          </div>

          {/* Main container */}
          <div className="flex-1 bg-white rounded-2xl border border-slate-200 overflow-hidden">
            {/* Desktop Table */}
            <div className="hidden lg:block overflow-x-auto">
              {filteredUrls.length === 0 ? (
                <div className="p-8">
                  <NoUrlsCard />
                </div>
              ) : (
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
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
                  <tbody className="divide-y divide-slate-100">
                    {filteredUrls.map((url) => {
                      const fullShort = `${getPublicBase().replace(
                        /\/$/,
                        ""
                      )}/${url.shortUrl}`;
                      const isOpen = !!expandedTags[url._id];
                      return (
                        <tr
                          key={url._id}
                          className="hover:bg-slate-50 transition-colors align-top"
                        >
                          <td className="px-6 py-4 max-w-xs">
                            <p
                              className="text-slate-900 font-medium truncate"
                              title={url.fullUrl}
                            >
                              {url.fullUrl}
                            </p>
                          </td>
                          <td className="px-6 py-4">
                            <Link
                              to={fullShort}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors break-all"
                            >
                              {fullShort}
                            </Link>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <FolderSelect link={url} />
                          </td>
                          <td className="px-6 py-4 text-center">
                            <button
                              onClick={() =>
                                setExpandedTags((s) => ({
                                  ...s,
                                  [url._id]: !s[url._id],
                                }))
                              }
                              className="px-3 py-1.5 rounded-lg border border-slate-200 text-sm hover:bg-slate-50 transition-colors"
                            >
                              {isOpen ? "Hide" : "Edit"} tags
                            </button>
                            {isOpen && (
                              <div className="mt-3 text-left">
                                <TagEditor link={url} />
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <StatusPill status={url.status} />
                          </td>
                          <td className="px-6 py-4 text-center">
                            <div className="inline-flex items-center px-3 py-1.5 bg-slate-100 rounded-lg">
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
                                className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
                              >
                                Stats
                              </Link>

                              {url.status === "paused" ? (
                                <button
                                  onClick={() => resume(url._id)}
                                  disabled={actionLoading === url._id}
                                  className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50"
                                >
                                  {actionLoading === url._id ? "..." : "Resume"}
                                </button>
                              ) : url.status === "disabled" ? (
                                <button
                                  onClick={() => resume(url._id)}
                                  disabled={actionLoading === url._id}
                                  className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50"
                                >
                                  {actionLoading === url._id ? "..." : "Enable"}
                                </button>
                              ) : (
                                <button
                                  onClick={() => pause(url._id)}
                                  disabled={actionLoading === url._id}
                                  className="px-3 py-1.5 rounded-lg bg-amber-500 text-white text-sm font-medium hover:bg-amber-600 transition-colors disabled:opacity-50"
                                >
                                  {actionLoading === url._id ? "..." : "Pause"}
                                </button>
                              )}

                              {url.status !== "disabled" && (
                                <button
                                  onClick={() => disable(url._id)}
                                  disabled={actionLoading === url._id}
                                  className="px-3 py-1.5 rounded-lg bg-slate-500 text-white text-sm font-medium hover:bg-slate-600 transition-colors disabled:opacity-50"
                                >
                                  {actionLoading === url._id
                                    ? "..."
                                    : "Disable"}
                                </button>
                              )}

                              <button
                                onClick={() => hardDelete(url._id)}
                                disabled={actionLoading === url._id}
                                className="px-3 py-1.5 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
                              >
                                {actionLoading === url._id ? "..." : "Delete"}
                              </button>

                              <button
                                onClick={() =>
                                  handleCopy(url._id, url.shortUrl)
                                }
                                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                                  copiedId === url._id
                                    ? "bg-emerald-600 text-white"
                                    : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
                                }`}
                              >
                                {copiedId === url._id ? "Copied!" : "Copy"}
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>

            {/* Mobile/Tablet Cards */}
            <div className="lg:hidden">
              {filteredUrls.length === 0 ? (
                <div className="p-6">
                  <NoUrlsCard />
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {filteredUrls.map((url) => {
                    const fullShort = `${getPublicBase().replace(/\/$/, "")}/${
                      url.shortUrl
                    }`;
                    const isOpen = !!expandedTags[url._id];
                    return (
                      <div key={url._id} className="p-4 sm:p-6 space-y-4">
                        {/* Status and Clicks Row */}
                        <div className="flex items-center justify-between">
                          <StatusPill status={url.status} />
                          <div className="inline-flex items-center px-3 py-1.5 bg-slate-100 rounded-lg">
                            <span className="text-slate-800 font-semibold text-sm">
                              {(url.clicks ?? 0).toLocaleString()} clicks
                            </span>
                          </div>
                        </div>

                        {/* URLs Section */}
                        <div className="space-y-3">
                          <div>
                            <label className="block text-xs font-medium text-slate-500 mb-1.5">
                              ORIGINAL URL
                            </label>
                            <div className="p-3 bg-slate-50 rounded-lg">
                              <p
                                className="text-slate-900 text-sm break-all"
                                title={url.fullUrl}
                              >
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
                              className="block p-3 bg-blue-50 rounded-lg text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors text-sm break-all"
                            >
                              {fullShort}
                            </Link>
                          </div>
                        </div>

                        {/* Folder and Tags Row */}
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                          <div className="flex-1">
                            <label className="block text-xs font-medium text-slate-500 mb-1.5">
                              FOLDER
                            </label>
                            <FolderSelect link={url} />
                          </div>
                          <div className="flex-shrink-0">
                            <button
                              onClick={() =>
                                setExpandedTags((s) => ({
                                  ...s,
                                  [url._id]: !s[url._id],
                                }))
                              }
                              className="px-4 py-2 rounded-lg border border-slate-200 text-sm font-medium hover:bg-slate-50 transition-colors"
                            >
                              {isOpen ? "Hide" : "Edit"} tags
                            </button>
                          </div>
                        </div>

                        {isOpen && (
                          <div className="pt-2">
                            <TagEditor link={url} />
                          </div>
                        )}

                        {/* Primary Actions */}
                        <div className="grid grid-cols-2 gap-3">
                          <Link
                            to={`/stats/${url._id}`}
                            target="_blank"
                            className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors text-sm"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
                              <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
                            </svg>
                            Stats
                          </Link>

                          {url.status === "paused" ? (
                            <button
                              onClick={() => resume(url._id)}
                              disabled={actionLoading === url._id}
                              className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50 text-sm"
                            >
                              {actionLoading === url._id ? (
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              ) : (
                                <svg
                                  className="w-4 h-4"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              )}
                              Resume
                            </button>
                          ) : url.status === "disabled" ? (
                            <button
                              onClick={() => resume(url._id)}
                              disabled={actionLoading === url._id}
                              className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50 text-sm"
                            >
                              {actionLoading === url._id ? (
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              ) : (
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
                              )}
                              Enable
                            </button>
                          ) : (
                            <button
                              onClick={() => pause(url._id)}
                              disabled={actionLoading === url._id}
                              className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-amber-500 text-white font-medium hover:bg-amber-600 transition-colors disabled:opacity-50 text-sm"
                            >
                              {actionLoading === url._id ? (
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              ) : (
                                <svg
                                  className="w-4 h-4"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              )}
                              Pause
                            </button>
                          )}
                        </div>

                        {/* Secondary Actions */}
                        <div className="grid grid-cols-3 gap-2">
                          <button
                            onClick={() => handleCopy(url._id, url.shortUrl)}
                            className={`flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg font-medium transition-colors text-sm ${
                              copiedId === url._id
                                ? "bg-emerald-600 text-white"
                                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                            }`}
                          >
                            {copiedId === url._id ? (
                              <>
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
                                Copied
                              </>
                            ) : (
                              <>
                                <svg
                                  className="w-4 h-4"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                                  <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                                </svg>
                                Copy
                              </>
                            )}
                          </button>

                          {url.status !== "disabled" && (
                            <button
                              onClick={() => disable(url._id)}
                              disabled={actionLoading === url._id}
                              className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg bg-slate-500 text-white font-medium hover:bg-slate-600 transition-colors disabled:opacity-50 text-sm"
                            >
                              {actionLoading === url._id ? (
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              ) : (
                                <>
                                  <svg
                                    className="w-4 h-4"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                  Disable
                                </>
                              )}
                            </button>
                          )}

                          <button
                            onClick={() => hardDelete(url._id)}
                            disabled={actionLoading === url._id}
                            className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition-colors disabled:opacity-50 text-sm"
                          >
                            {actionLoading === url._id ? (
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                              <>
                                <svg
                                  className="w-4 h-4"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                                Delete
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserUrls;
