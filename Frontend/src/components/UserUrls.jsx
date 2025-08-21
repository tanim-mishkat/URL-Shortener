import React, { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllUserUrls } from "../api/user.api";
import { Link } from "@tanstack/react-router";
import { getPublicBase } from "../utils/publicBase";
import { queryClient } from "../main.jsx";
import {
  updateLinkStatus,
  softDeleteLink,
  hardDeleteLink,
} from "../api/shortUrl.api";

const UserUrls = () => {
  const [copiedId, setCopiedId] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);

  const base = useMemo(() => getPublicBase().replace(/\/$/, ""), []);

  const {
    data,
    isLoading,
    error,
    isFetching, 
    refetch, 
  } = useQuery({
    queryKey: ["userUrls"],
    queryFn: getAllUserUrls,
    keepPreviousData: true,
    placeholderData: (prev) => prev,
    staleTime: 20_000,
    refetchOnWindowFocus: false,
    refetchInterval: false,
    retry: 1,
  });

  const urls = data?.urls || [];
  const urlsDesc = useMemo(() => urls.slice().reverse(), [urls]);

  const handleCopy = (id, shortUrl) => {
    const copiedUrl = `${base}/${shortUrl}`;
    navigator.clipboard.writeText(copiedUrl);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const doAction = async (fn, id) => {
    try {
      setActionLoading(id);
      await fn(id);
      await queryClient.invalidateQueries({ queryKey: ["userUrls"] });
    } catch (e) {
      console.error(e);
      alert(e?.friendlyMessage || "Action failed");
    } finally {
      setActionLoading(null);
    }
  };

  const pause = (id) => doAction((x) => updateLinkStatus(x, "paused"), id);
  const resume = (id) => doAction((x) => updateLinkStatus(x, "active"), id);
  const disable = (id) => doAction(softDeleteLink, id);
  const hardDelete = (id) => {
    if (!confirm("This will permanently delete the link. Continue?")) return;
    return doAction(hardDeleteLink, id);
  };

  const StatusPill = ({ status }) => {
    const s = status || "active";
    const config = {
      active: {
        bg: "bg-gradient-to-r from-emerald-100 to-green-100",
        text: "text-emerald-700",
        dot: "bg-emerald-500",
      },
      paused: {
        bg: "bg-gradient-to-r from-amber-100 to-yellow-100",
        text: "text-amber-700",
        dot: "bg-amber-500",
      },
      disabled: {
        bg: "bg-gradient-to-r from-slate-100 to-gray-100",
        text: "text-slate-700",
        dot: "bg-slate-500",
      },
    };
    const label = s[0].toUpperCase() + s.slice(1);
    return (
      <div
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${config[s].bg} ${config[s].text} shadow-sm`}
      >
        <div className={`w-2 h-2 rounded-full ${config[s].dot}`} />
        {label}
      </div>
    );
  };

  const NoUrlsCard = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/50">
      <div className="w-full px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-12 max-w-6xl mx-auto">
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/40 border border-slate-200/60 overflow-hidden backdrop-blur-sm">
          {/* Header */}
          <div className="px-6 sm:px-8 py-6 border-b border-slate-100 bg-gradient-to-r from-indigo-50/50 to-purple-50/30">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl shadow-sm">
                <svg
                  className="w-7 h-7 text-indigo-600"
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
                <div className="flex items-center gap-3 mb-1">
                  <div className="w-1.5 h-6 bg-gradient-to-b from-indigo-500 to-purple-600 rounded-full" />
                  <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-slate-800 via-indigo-700 to-purple-700 bg-clip-text text-transparent">
                    Your URLs
                  </h2>
                </div>
                <p className="text-slate-600">
                  Manage and track your shortened links
                </p>
              </div>
            </div>
          </div>

          {/* Empty state */}
          <div className="px-6 sm:px-8 py-16 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg">
                <svg
                  className="w-12 h-12 text-indigo-500"
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
              <h3 className="text-xl sm:text-2xl font-semibold text-slate-900 mb-3">
                No URLs yet
              </h3>
              <p className="text-slate-600 mb-8 text-base sm:text-lg">
                Create your first shortened URL to get started tracking clicks
                and analytics!
              </p>
              <div className="inline-flex items-center px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 transition-all duration-300 cursor-pointer">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                Create First URL
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (isLoading && !data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/50">
        <div className="w-full px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-12 max-w-6xl mx-auto">
          <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/40 border border-slate-200/60 p-8 backdrop-blur-sm">
            <div className="flex items-center justify-center py-16">
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-100 border-t-indigo-600"></div>
                  <div
                    className="absolute inset-0 rounded-full h-12 w-12 border-4 border-transparent border-r-purple-600 animate-spin"
                    style={{
                      animationDirection: "reverse",
                      animationDuration: "1.5s",
                    }}
                  />
                </div>
                <span className="text-slate-700 font-medium text-lg">
                  Loading your URLs...
                </span>
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" />
                  <div
                    className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  />
                  <div
                    className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error && error.status === 404) return <NoUrlsCard />;

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50/20 to-orange-50/30">
        <div className="w-full px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-12 max-w-6xl mx-auto">
          <div className="bg-white rounded-3xl shadow-xl shadow-red-200/40 border border-red-200/60 p-8 backdrop-blur-sm">
            <div className="flex items-center justify-center py-16">
              <div className="text-center max-w-md">
                <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-orange-100 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <svg
                    className="w-10 h-10 text-red-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">
                  Something went wrong
                </h3>
                <p className="text-red-600 font-medium leading-relaxed">
                  {error?.friendlyMessage ||
                    error?.message ||
                    "We couldn't load your URLs. Please refresh and try again."}
                </p>
                <button
                  className="mt-6 px-6 py-3 rounded-2xl bg-gradient-to-r from-red-500 to-orange-500 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                  onClick={() => refetch()}
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (urls.length === 0) return <NoUrlsCard />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/50">
      <div className="w-full px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-12 max-w-7xl mx-auto">
        {/* Enhanced Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl shadow-sm">
                <svg
                  className="w-7 h-7 text-indigo-600"
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
                <div className="flex items-center gap-3 mb-1">
                  <div className="w-1.5 h-8 bg-gradient-to-b from-indigo-500 to-purple-600 rounded-full" />
                  <h2 className="text-2xl sm:text-3xl xl:text-4xl font-bold bg-gradient-to-r from-slate-800 via-indigo-700 to-purple-700 bg-clip-text text-transparent">
                    Your URLs
                  </h2>
                </div>
                <p className="text-slate-600">
                  Manage and track your shortened links
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {isFetching && (
                <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-medium">
                  Updating…
                </span>
              )}
              <button
                onClick={() => refetch()}
                className="px-4 py-2 rounded-xl bg-white text-slate-700 border border-slate-200 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                Refresh
              </button>
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-indigo-50 text-indigo-700 text-sm font-medium border border-indigo-200">
                {urls.length} {urls.length === 1 ? "link" : "links"}
              </div>
            </div>
          </div>
        </div>

        {/* Main Container */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl shadow-slate-200/40 border border-slate-200/60 overflow-hidden">
          {/* Desktop Table */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-slate-50/80 to-indigo-50/50">
                <tr>
                  <th className="px-6 xl:px-8 py-5 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-indigo-400 rounded-full" />
                      Original URL
                    </div>
                  </th>
                  <th className="px-6 xl:px-8 py-5 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-400 rounded-full" />
                      Short URL
                    </div>
                  </th>
                  <th className="px-6 xl:px-8 py-5 text-center text-xs font-bold text-slate-600 uppercase tracking-wider">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full" />
                      Status
                    </div>
                  </th>
                  <th className="px-6 xl:px-8 py-5 text-center text-xs font-bold text-slate-600 uppercase tracking-wider">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full" />
                      Clicks
                    </div>
                  </th>
                  <th className="px-6 xl:px-8 py-5 text-center text-xs font-bold text-slate-600 uppercase tracking-wider">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-2 h-2 bg-orange-400 rounded-full" />
                      Actions
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100/50">
                {urlsDesc.map((url) => {
                  const fullShort = `${base}/${url.shortUrl}`;
                  const busy = actionLoading === url._id || isFetching;
                  return (
                    <tr
                      key={url._id}
                      className="hover:bg-gradient-to-r hover:from-indigo-50/50 hover:to-purple-50/30 transition-all duration-200 group"
                    >
                      <td className="px-6 xl:px-8 py-6">
                        <div className="max-w-xs xl:max-w-sm">
                          <p
                            className="text-slate-900 font-medium truncate group-hover:text-indigo-900 transition-colors"
                            title={url.fullUrl}
                          >
                            {url.fullUrl}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 xl:px-8 py-6">
                        <Link
                          to={fullShort}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indigo-600 hover:text-purple-600 font-medium hover:underline transition-colors duration-200 break-all"
                        >
                          {fullShort}
                        </Link>
                      </td>
                      <td className="px-6 xl:px-8 py-6 text-center">
                        <StatusPill status={url.status} />
                      </td>
                      <td className="px-6 xl:px-8 py-6 text-center">
                        <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-slate-100 to-blue-50 rounded-xl shadow-sm">
                          <span className="text-slate-800 font-bold text-lg">
                            {(url.clicks ?? 0).toLocaleString()}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 xl:px-8 py-6 text-center">
                        <div className="flex items-center justify-center gap-2 flex-wrap">
                          <Link
                            to={`/stats/${url._id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-medium hover:from-blue-600 hover:to-indigo-600 transition-all duration-200 shadow-md hover:shadow-lg"
                          >
                            Stats
                          </Link>

                          {url.status === "paused" ? (
                            <button
                              onClick={() => resume(url._id)}
                              disabled={busy}
                              aria-disabled={busy}
                              className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-green-500 text-white font-medium hover:from-emerald-600 hover:to-green-600 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50"
                            >
                              {busy ? "…" : "Resume"}
                            </button>
                          ) : url.status === "disabled" ? (
                            <button
                              onClick={() => resume(url._id)}
                              disabled={busy}
                              aria-disabled={busy}
                              className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-green-500 text-white font-medium hover:from-emerald-600 hover:to-green-600 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50"
                            >
                              {busy ? "…" : "Enable"}
                            </button>
                          ) : (
                            <button
                              onClick={() => pause(url._id)}
                              disabled={busy}
                              aria-disabled={busy}
                              className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-medium hover:from-amber-600 hover:to-orange-600 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50"
                            >
                              {busy ? "…" : "Pause"}
                            </button>
                          )}

                          {url.status !== "disabled" && (
                            <button
                              onClick={() => disable(url._id)}
                              disabled={busy}
                              aria-disabled={busy}
                              className="px-4 py-2 rounded-xl bg-gradient-to-r from-slate-500 to-gray-500 text-white font-medium hover:from-slate-600 hover:to-gray-600 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50"
                            >
                              {busy ? "…" : "Disable"}
                            </button>
                          )}

                          <button
                            onClick={() => hardDelete(url._id)}
                            disabled={busy}
                            aria-disabled={busy}
                            className="px-4 py-2 rounded-xl bg-gradient-to-r from-red-500 to-pink-500 text-white font-medium hover:from-red-600 hover:to-pink-600 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50"
                          >
                            {busy ? "…" : "Delete"}
                          </button>

                          <button
                            onClick={() => handleCopy(url._id, url.shortUrl)}
                            className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 shadow-md hover:shadow-lg ${
                              copiedId === url._id
                                ? "bg-gradient-to-r from-emerald-500 to-green-500 text-white"
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
          </div>

          {/* Mobile/Tablet Cards */}
          <div className="lg:hidden divide-y divide-slate-100/50">
            {urlsDesc.map((url) => {
              const fullShort = `${base}/${url.shortUrl}`;
              const busy = actionLoading === url._id || isFetching;
              return (
                <div
                  key={url._id}
                  className="p-6 space-y-5 hover:bg-gradient-to-r hover:from-indigo-50/50 hover:to-purple-50/30 transition-all duration-200"
                >
                  {/* Status and Click Count Row */}
                  <div className="flex items-center justify-between">
                    <StatusPill status={url.status} />
                    <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-slate-100 to-blue-50 rounded-xl shadow-sm">
                      <span className="text-slate-800 font-bold">
                        {(url.clicks ?? 0).toLocaleString()} clicks
                      </span>
                    </div>
                  </div>

                  {/* Original URL */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                      <div className="w-2 h-2 bg-indigo-400 rounded-full" />
                      Original URL
                    </label>
                    <p
                      className="text-slate-900 font-medium break-all bg-slate-50 px-3 py-2 rounded-xl"
                      title={url.fullUrl}
                    >
                      {url.fullUrl}
                    </p>
                  </div>

                  {/* Short URL */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-400 rounded-full" />
                      Short URL
                    </label>
                    <Link
                      to={fullShort}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-indigo-600 hover:text-purple-600 font-medium hover:underline transition-colors duration-200 break-all bg-indigo-50 px-3 py-2 rounded-xl"
                    >
                      {fullShort}
                    </Link>
                  </div>

                  {/* Primary Actions */}
                  <div className="flex gap-3">
                    <Link
                      to={`/stats/${url._id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 text-center px-4 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-medium hover:from-blue-600 hover:to-indigo-600 transition-all duration-200 shadow-lg"
                    >
                      📊 Stats
                    </Link>

                    {url.status === "paused" ? (
                      <button
                        onClick={() => resume(url._id)}
                        disabled={busy}
                        aria-disabled={busy}
                        className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-green-500 text-white font-medium hover:from-emerald-600 hover:to-green-600 transition-all duration-200 shadow-lg disabled:opacity-50"
                      >
                        {busy ? "⏳" : "▶️ Resume"}
                      </button>
                    ) : url.status === "disabled" ? (
                      <button
                        onClick={() => resume(url._id)}
                        disabled={busy}
                        aria-disabled={busy}
                        className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-green-500 text-white font-medium hover:from-emerald-600 hover:to-green-600 transition-all duration-200 shadow-lg disabled:opacity-50"
                      >
                        {busy ? "⏳" : "✅ Enable"}
                      </button>
                    ) : (
                      <button
                        onClick={() => pause(url._id)}
                        disabled={busy}
                        aria-disabled={busy}
                        className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-medium hover:from-amber-600 hover:to-orange-600 transition-all duration-200 shadow-lg disabled:opacity-50"
                      >
                        {busy ? "⏳" : "⏸️ Pause"}
                      </button>
                    )}

                    <button
                      onClick={() => handleCopy(url._id, url.shortUrl)}
                      className={`flex-1 px-4 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg ${
                        copiedId === url._id
                          ? "bg-gradient-to-r from-emerald-500 to-green-500 text-white"
                          : "bg-white text-slate-700 border-2 border-slate-200 hover:bg-slate-50 hover:border-indigo-200"
                      }`}
                    >
                      {copiedId === url._id ? "✅ Copied!" : "📋 Copy"}
                    </button>
                  </div>

                  {/* Secondary Actions */}
                  <div className="flex gap-3">
                    {url.status !== "disabled" && (
                      <button
                        onClick={() => disable(url._id)}
                        disabled={busy}
                        aria-disabled={busy}
                        className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-slate-500 to-gray-500 text-white font-medium hover:from-slate-600 hover:to-gray-600 transition-all duration-200 shadow-lg disabled:opacity-50"
                      >
                        {busy ? "⏳" : "🚫 Disable"}
                      </button>
                    )}
                    <button
                      onClick={() => hardDelete(url._id)}
                      disabled={busy}
                      aria-disabled={busy}
                      className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-red-500 to-pink-500 text-white font-medium hover:from-red-600 hover:to-pink-600 transition-all duration-200 shadow-lg disabled:opacity-50"
                    >
                      {busy ? "⏳" : "🗑️ Delete"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserUrls;
