import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllUserUrls } from "../api/user.api";
import { Link } from "@tanstack/react-router";

const UserUrls = () => {
  const [copiedId, setCopiedId] = useState(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ["userUrls"],
    queryFn: getAllUserUrls,
    refetchInterval: 3000,
    staleTime: 0,
  });

  const urls = data?.urls || [];

  console.log("user data", urls);

  const handleCopy = (id, shortUrl) => {
    const copiedUrl = `http://localhost:5000/${shortUrl}`;
    navigator.clipboard.writeText(copiedUrl);

    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

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
                {error?.message ||
                  "We couldn’t load your URLs. Please refresh and try again."}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
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

        {urls.length === 0 ? (
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
        ) : (
          <>
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
                    .map((url, index) => (
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
                            to={url.shortUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 font-medium hover:underline transition-colors duration-200"
                          >
                            {url.shortUrl}
                          </Link>
                        </td>
                        <td className="px-8 py-6 text-center">
                          <div className="inline-flex items-center px-3 py-1 bg-slate-100 rounded-full">
                            <svg
                              className="w-4 h-4 text-slate-500 mr-1"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                              />
                            </svg>
                            <span className="text-slate-700 font-semibold">
                              {url.clicks}
                            </span>
                          </div>
                        </td>
                        <td className="px-8 py-6 text-center">
                          <button
                            onClick={() => handleCopy(url._id, url.shortUrl)}
                            className={`inline-flex items-center px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                              copiedId === url._id
                                ? "bg-emerald-600 text-white shadow-lg"
                                : "bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transform hover:scale-105"
                            }`}
                          >
                            {copiedId === url._id ? (
                              <>
                                <svg
                                  className="w-4 h-4 mr-2"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                                Copied!
                              </>
                            ) : (
                              <>
                                <svg
                                  className="w-4 h-4 mr-2"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                                  />
                                </svg>
                                Copy
                              </>
                            )}
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden divide-y divide-slate-100">
              {urls
                .slice()
                .reverse()
                .map((url) => (
                  <div key={url._id} className="p-6 space-y-4">
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
                        to={url.shortUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-blue-600 hover:text-blue-800 font-medium hover:underline mt-1 transition-colors duration-200"
                      >
                        {url.shortUrl}
                      </Link>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                          Clicks
                        </label>
                        <div className="inline-flex items-center px-3 py-1 bg-slate-100 rounded-full mt-1">
                          <svg
                            className="w-4 h-4 text-slate-500 mr-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </svg>
                          <span className="text-slate-700 font-semibold">
                            {url.clicks}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleCopy(url._id, url.shortUrl)}
                        className={`inline-flex items-center px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                          copiedId === url._id
                            ? "bg-emerald-600 text-white shadow-lg"
                            : "bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg"
                        }`}
                      >
                        {copiedId === url._id ? (
                          <>
                            <svg
                              className="w-4 h-4 mr-2"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                            Copied!
                          </>
                        ) : (
                          <>
                            <svg
                              className="w-4 h-4 mr-2"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                              />
                            </svg>
                            Copy
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default UserUrls;
