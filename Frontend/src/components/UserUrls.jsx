import React, { useState } from "react";
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

  const { data, isLoading, error } = useQuery({
    queryKey: ["userUrls"],
    queryFn: getAllUserUrls,
    refetchInterval: 3000,
    staleTime: 0,
    retry: false,
  });

  const urls = data?.urls || [];

  const handleCopy = (id, shortUrl) => {
    const copiedUrl = `${getPublicBase().replace(/\/$/, "")}/${shortUrl}`;
    navigator.clipboard.writeText(copiedUrl);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const doAction = async (fn, id) => {
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
    const map = {
      active: "bg-emerald-100 text-emerald-700",
      paused: "bg-amber-100 text-amber-700",
      disabled: "bg-slate-200 text-slate-700",
    };
    const label = s[0].toUpperCase() + s.slice(1);
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${map[s]}`}>
        {label}
      </span>
    );
  };

  const NoUrlsCard = () => (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 mt-12">
      <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
        {/* Header */}
        <div className="px-8 py-6 border-b border-slate-100">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-xl">
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
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Your URLs</h2>
              <p className="text-slate-600">
                Manage and track your shortened links
              </p>
            </div>
          </div>
        </div>

        {/* Empty state */}
        <div className="px-8 py-12 text-center">
          <div className="max-w-sm mx-auto">
            <div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-10 h-10 text-slate-400"
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
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
              No URLs yet
            </h3>
            <p className="text-slate-600 mb-6">
              Create your first shortened URL to get started!
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8">
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="text-slate-600 font-medium">
                Loading your URLs...
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }


  if (error && error.status === 404) {
    return <NoUrlsCard />;
  }

  if (error) {
    return (
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <svg
                className="w-12 h-12 text-red-500 mx-auto mb-4"
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
              <p className="text-red-600 font-medium">
                {error?.friendlyMessage ||
                  error?.message ||
                  "We couldn’t load your URLs. Please refresh and try again."}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (urls.length === 0) {
    return <NoUrlsCard />;
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 mt-12">
      <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
        {/* Header */}
        <div className="px-8 py-6 border-b border-slate-100">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-xl">
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
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Your URLs</h2>
              <p className="text-slate-600">
                Manage and track your shortened links
              </p>
            </div>
          </div>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-8 py-4 text-left text-sm font-semibold text-slate-700 uppercase tracking-wider">
                  Original URL
                </th>
                <th className="px-8 py-4 text-left text-sm font-semibold text-slate-700 uppercase tracking-wider">
                  Short URL
                </th>
                <th className="px-8 py-4 text-center text-sm font-semibold text-slate-700 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-8 py-4 text-center text-sm font-semibold text-slate-700 uppercase tracking-wider">
                  Clicks
                </th>
                <th className="px-8 py-4 text-center text-sm font-semibold text-slate-700 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {urls
                .slice()
                .reverse()
                .map((url) => {
                  const fullShort = `${getPublicBase().replace(/\/$/, "")}/${
                    url.shortUrl
                  }`;
                  return (
                    <tr
                      key={url._id}
                      className="hover:bg-slate-50 transition-colors duration-200"
                    >
                      <td className="px-8 py-6">
                        <div className="max-w-xs">
                          <p
                            className="text-slate-900 font-medium truncate"
                            title={url.fullUrl}
                          >
                            {url.fullUrl}
                          </p>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <Link
                          to={fullShort}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 font-medium hover:underline transition-colors duration-200"
                        >
                          {fullShort}
                        </Link>
                      </td>
                      <td className="px-8 py-6 text-center">
                        <StatusPill status={url.status} />
                      </td>
                      <td className="px-8 py-6 text-center">
                        <div className="inline-flex items-center px-3 py-1 bg-slate-100 rounded-full">
                          <span className="text-slate-700 font-semibold">
                            {url.clicks}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-center">
                        <div className="flex items-center justify-center gap-2">
                          {url.status === "paused" ? (
                            <button
                              onClick={() => resume(url._id)}
                              disabled={actionLoading === url._id}
                              className="px-3 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 transition"
                            >
                              Resume
                            </button>
                          ) : url.status === "disabled" ? (
                            <button
                              onClick={() => resume(url._id)}
                              disabled={actionLoading === url._id}
                              className="px-3 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 transition"
                            >
                              Enable
                            </button>
                          ) : (
                            <button
                              onClick={() => pause(url._id)}
                              disabled={actionLoading === url._id}
                              className="px-3 py-2 rounded-xl bg-amber-500 text-white hover:bg-amber-600 transition"
                            >
                              Pause
                            </button>
                          )}
                          {url.status !== "disabled" && (
                            <button
                              onClick={() => disable(url._id)}
                              disabled={actionLoading === url._id}
                              className="px-3 py-2 rounded-xl bg-slate-600 text-white hover:bg-slate-700 transition"
                            >
                              Disable
                            </button>
                          )}
                          <button
                            onClick={() => hardDelete(url._id)}
                            disabled={actionLoading === url._id}
                            className="px-3 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700 transition"
                          >
                            Delete
                          </button>
                          <button
                            onClick={() => handleCopy(url._id, url.shortUrl)}
                            className={`px-3 py-2 rounded-xl font-medium transition-all duration-200 ${
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
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden divide-y divide-slate-100">
          {urls
            .slice()
            .reverse()
            .map((url) => {
              const fullShort = `${getPublicBase().replace(/\/$/, "")}/${
                url.shortUrl
              }`;
              return (
                <div key={url._id} className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Status
                    </span>
                    <StatusPill status={url.status} />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Original URL
                    </label>
                    <p
                      className="text-slate-900 font-medium truncate mt-1"
                      title={url.fullUrl}
                    >
                      {url.fullUrl}
                    </p>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Short URL
                    </label>
                    <Link
                      to={fullShort}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-blue-600 hover:text-blue-800 font-medium hover:underline mt-1 transition-colors duration-200 break-all"
                    >
                      {fullShort}
                    </Link>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Clicks
                      </label>
                      <div className="inline-flex items-center px-3 py-1 bg-slate-100 rounded-full mt-1">
                        <span className="text-slate-700 font-semibold">
                          {url.clicks}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {url.status === "paused" ? (
                        <button
                          onClick={() => resume(url._id)}
                          disabled={actionLoading === url._id}
                          className="px-3 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 transition"
                        >
                          Resume
                        </button>
                      ) : url.status === "disabled" ? (
                        <button
                          onClick={() => resume(url._id)}
                          disabled={actionLoading === url._id}
                          className="px-3 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 transition"
                        >
                          Enable
                        </button>
                      ) : (
                        <button
                          onClick={() => pause(url._id)}
                          disabled={actionLoading === url._id}
                          className="px-3 py-2 rounded-xl bg-amber-500 text-white hover:bg-amber-600 transition"
                        >
                          Pause
                        </button>
                      )}
                      <button
                        onClick={() => handleCopy(url._id, url.shortUrl)}
                        className={`px-3 py-2 rounded-xl font-medium transition-all duration-200 ${
                          copiedId === url._id
                            ? "bg-emerald-600 text-white"
                            : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
                        }`}
                      >
                        {copiedId === url._id ? "Copied!" : "Copy"}
                      </button>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {url.status !== "disabled" && (
                      <button
                        onClick={() => disable(url._id)}
                        disabled={actionLoading === url._id}
                        className="flex-1 px-3 py-2 rounded-xl bg-slate-600 text-white hover:bg-slate-700 transition"
                      >
                        Disable
                      </button>
                    )}
                    <button
                      onClick={() => hardDelete(url._id)}
                      disabled={actionLoading === url._id}
                      className="flex-1 px-3 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default UserUrls;
