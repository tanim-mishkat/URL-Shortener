import React, { useState } from "react";
import { createShortUrl } from "../api/shortUrl.api";
import { useSelector } from "react-redux";
import { queryClient } from "../main.jsx";
import { Link } from "@tanstack/react-router";

const UrlForm = () => {
  const [url, setUrl] = useState("https://example.com");
  const [shortUrl, setShortUrl] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [customSlug, setCustomSlug] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isLoggedIn } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setShortUrl("");
    setCopied(false);
    setIsSubmitting(true);

    try {
      const trimmed = url.trim();
      if (/^(javascript:|data:)/i.test(trimmed)) {
        throw { friendlyMessage: "Unsupported URL scheme." };
      }
      const normalized = (() => {
        try {
          const withProto = trimmed.includes("://")
            ? trimmed
            : `https://${trimmed}`;
          const u = new URL(withProto);
          u.hash = "";
          return u.toString();
        } catch {
          throw { friendlyMessage: "Please enter a valid URL." };
        }
      })();

      const shortUrlResponse = await createShortUrl(normalized, customSlug);
      setShortUrl(shortUrlResponse);

      // Refresh the user URLs list without aggressive polling
      await queryClient.invalidateQueries({ queryKey: ["userUrls"] });
      await queryClient.invalidateQueries({ queryKey: ["folders"] });

      setError("");
      setCustomSlug("");
      setUrl("https://");
    } catch (err) {
      const status = err?.status || err?.response?.status;
      const msg =
        err?.friendlyMessage ||
        (status === 409
          ? "Custom slug is already taken. Try another."
          : status === 400
          ? "Invalid URL. Please check and try again."
          : "Couldn't create the link. Please try again.");
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopy = async () => {
    if (!shortUrl) return;
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const tmp = document.createElement("textarea");
      tmp.value = shortUrl;
      tmp.setAttribute("readonly", "");
      tmp.style.position = "absolute";
      tmp.style.left = "-9999px";
      document.body.appendChild(tmp);
      tmp.select();
      try {
        document.execCommand("copy");
      } finally {
        document.body.removeChild(tmp);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-50/50 via-indigo-50/30 to-purple-50/50">
      <div className="w-full px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8 max-w-5xl mx-auto">
        {/* Main Form Card */}
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl shadow-slate-200/40 border border-slate-200/60 overflow-hidden">
          {/* Header Section */}
          <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 bg-gradient-to-br from-indigo-50/60 via-purple-50/40 to-blue-50/50 border-b border-slate-100/50">
            <div className="text-center max-w-2xl mx-auto">
              <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-indigo-500 via-purple-500 to-blue-600 rounded-2xl sm:rounded-3xl mb-4 sm:mb-6 shadow-lg shadow-indigo-500/25">
                <svg
                  className="w-8 h-8 sm:w-10 sm:h-10 text-white"
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

              <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <div className="w-1.5 sm:w-2 h-8 sm:h-10 bg-gradient-to-b from-indigo-500 to-purple-600 rounded-full"></div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold bg-gradient-to-r from-slate-800 via-indigo-700 to-purple-700 bg-clip-text text-transparent">
                  Shorten Your URL
                </h1>
              </div>

              <p className="text-slate-600 text-base sm:text-lg lg:text-xl leading-relaxed px-2">
                Transform long, complex URLs into clean, shareable links in
                seconds
              </p>

              <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 mt-4 sm:mt-6 text-xs sm:text-sm text-slate-500">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-emerald-400 rounded-full"></div>
                  <span>Free Forever</span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-400 rounded-full"></div>
                  <span>Analytics Included</span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-purple-400 rounded-full"></div>
                  <span>Custom Links</span>
                </div>
              </div>
            </div>
          </div>

          {/* Form Section */}
          <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            <form
              onSubmit={handleSubmit}
              className="space-y-6 sm:space-y-8 max-w-2xl mx-auto"
            >
              {/* URL Input */}
              <div className="group">
                <label
                  htmlFor="url"
                  className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-3 sm:mb-4"
                >
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-indigo-500 rounded-full"></div>
                  Enter your long URL
                </label>
                <div className="relative">
                  <input
                    id="url"
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://your-very-long-url.com/with/many/parameters"
                    required
                    className="w-full px-4 sm:px-6 py-3.5 sm:py-5 text-slate-900 bg-gradient-to-r from-slate-50 to-indigo-50/30 
                             border-2 border-slate-200/60 rounded-xl sm:rounded-2xl focus:outline-none focus:ring-4 
                             focus:ring-indigo-100 focus:border-indigo-400 transition-all duration-300 
                             text-sm sm:text-base lg:text-lg placeholder:text-slate-400 group-hover:border-indigo-300
                             shadow-sm hover:shadow-md focus:shadow-lg"
                  />
                  <div className="absolute inset-y-0 right-3 sm:right-6 flex items-center pointer-events-none">
                    <div className="p-1.5 sm:p-2 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg sm:rounded-xl">
                      <svg
                        className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600"
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
                  </div>
                </div>
              </div>

              {/* Custom Slug Input (for logged in users) */}
              {isLoggedIn && (
                <div className="group">
                  <label
                    htmlFor="customSlug"
                    className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-3 sm:mb-4"
                  >
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-purple-500 rounded-full"></div>
                    Custom slug
                    <span className="px-2 py-0.5 sm:py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">
                      optional
                    </span>
                  </label>
                  <div className="relative">
                    <input
                      id="customSlug"
                      type="text"
                      value={customSlug}
                      onChange={(e) => setCustomSlug(e.target.value)}
                      placeholder="my-custom-link"
                      className="w-full px-4 sm:px-6 py-3.5 sm:py-5 text-slate-900 bg-gradient-to-r from-slate-50 to-purple-50/30 
                               border-2 border-slate-200/60 rounded-xl sm:rounded-2xl focus:outline-none focus:ring-4 
                               focus:ring-purple-100 focus:border-purple-400 transition-all duration-300 
                               text-sm sm:text-base lg:text-lg placeholder:text-slate-400 group-hover:border-purple-300
                               shadow-sm hover:shadow-md focus:shadow-lg"
                    />
                    <div className="absolute inset-y-0 right-3 sm:right-6 flex items-center pointer-events-none">
                      <div className="p-1.5 sm:p-2 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg sm:rounded-xl">
                        <svg
                          className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <p className="mt-2 text-xs sm:text-sm text-slate-500 flex items-center gap-1.5 sm:gap-2">
                    <svg
                      className="w-3.5 h-3.5 sm:w-4 sm:h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Leave empty for auto-generated slug
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group relative flex-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-600 
                           text-white font-bold py-3.5 sm:py-5 px-6 sm:px-8 rounded-xl sm:rounded-2xl hover:from-indigo-600 hover:via-purple-600 
                           hover:to-blue-700 focus:outline-none focus:ring-4 focus:ring-indigo-200
                           transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]
                           shadow-xl shadow-indigo-500/25 hover:shadow-2xl hover:shadow-indigo-500/40
                           disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                           text-sm sm:text-base lg:text-lg xl:text-xl"
                >
                  <span className="flex items-center justify-center space-x-2 sm:space-x-3">
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 sm:w-6 sm:h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Creating your link...</span>
                      </>
                    ) : (
                      <>
                        <div className="p-0.5 sm:p-1 bg-white/20 rounded-md sm:rounded-lg group-hover:bg-white/30 transition-colors">
                          <svg
                            className="w-4 h-4 sm:w-5 sm:h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13 10V3L4 14h7v7l9-11h-7z"
                            />
                          </svg>
                        </div>
                        <span>Shorten URL</span>
                      </>
                    )}
                  </span>
                </button>

                {/* View My URLs Button (only for logged in users) */}
                {isLoggedIn && (
                  <Link
                    to="/my-urls"
                    className="group flex-shrink-0 bg-white border-2 border-slate-200 hover:border-indigo-300 
                             text-slate-700 hover:text-indigo-700 font-bold py-3.5 sm:py-5 px-6 sm:px-8 rounded-xl sm:rounded-2xl
                             transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]
                             shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-slate-200
                             text-sm sm:text-base lg:text-lg xl:text-xl"
                  >
                    <span className="flex items-center justify-center space-x-2 sm:space-x-3 whitespace-nowrap">
                      <div className="p-0.5 sm:p-1 bg-slate-100 group-hover:bg-indigo-100 rounded-md sm:rounded-lg transition-colors">
                        <svg
                          className="w-4 h-4 sm:w-5 sm:h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                          />
                        </svg>
                      </div>
                      <span>View My URLs</span>
                    </span>
                  </Link>
                )}
              </div>
            </form>

            {/* Error Message */}
            {error && (
              <div className="mt-6 sm:mt-8 max-w-2xl mx-auto">
                <div className="p-4 sm:p-6 bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200/60 rounded-xl sm:rounded-2xl shadow-lg">
                  <div className="flex items-start space-x-3 sm:space-x-4">
                    <div className="p-1.5 sm:p-2 bg-red-100 rounded-lg sm:rounded-xl">
                      <svg
                        className="w-5 h-5 sm:w-6 sm:h-6 text-red-600"
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
                    <div>
                      <h4 className="font-bold text-red-800 mb-1 text-sm sm:text-base">
                        Oops! Something went wrong
                      </h4>
                      <p className="text-red-700 font-medium leading-relaxed text-sm sm:text-base">
                        {error}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Success Result */}
            {shortUrl && (
              <div className="mt-6 sm:mt-8 max-w-2xl mx-auto">
                <div
                  className="p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 
                               border-2 border-emerald-200/60 rounded-2xl sm:rounded-3xl shadow-xl shadow-emerald-500/10 
                               hover:shadow-2xl hover:shadow-emerald-500/20 transition-all duration-300"
                >
                  {/* Success Header */}
                  <div className="flex items-start sm:items-center gap-3 mb-4 sm:mb-6">
                    <div className="p-2 sm:p-3 bg-gradient-to-br from-emerald-100 to-green-100 rounded-xl sm:rounded-2xl shadow-sm">
                      <svg
                        className="w-6 h-6 sm:w-7 sm:h-7 text-emerald-600"
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
                    </div>
                    <div>
                      <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-emerald-900">
                        Your shortened URL is ready!
                      </h3>
                      <p className="text-emerald-700 text-xs sm:text-sm lg:text-base mt-1">
                        Share it anywhere, track clicks, and get insights
                      </p>
                    </div>
                  </div>

                  {/* URL Display and Copy */}
                  <div className="bg-white/70 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6 border border-emerald-200/50 shadow-sm">
                    <div className="flex flex-col gap-3 sm:gap-4">
                      <div className="min-w-0">
                        <label className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-2 block">
                          Your Short URL
                        </label>
                        <Link
                          to={shortUrl}
                          className="text-indigo-700 hover:text-purple-700 font-bold break-all text-base sm:text-lg lg:text-xl
                                   hover:underline transition-colors duration-200 block"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {shortUrl}
                        </Link>
                      </div>

                      <button
                        type="button"
                        onClick={handleCopy}
                        className={`w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-bold transition-all duration-300 
                                   shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 text-sm sm:text-base ${
                                     copied
                                       ? "bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-emerald-500/25"
                                       : "bg-white text-slate-700 hover:bg-slate-50 border-2 border-slate-200 hover:border-emerald-300"
                                   }`}
                      >
                        {copied ? (
                          <span className="flex items-center justify-center space-x-2">
                            <svg
                              className="w-4 h-4 sm:w-5 sm:h-5"
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
                            <span>Copied!</span>
                          </span>
                        ) : (
                          <span className="flex items-center justify-center space-x-2">
                            <svg
                              className="w-4 h-4 sm:w-5 sm:h-5"
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
                            <span>Copy Link</span>
                          </span>
                        )}
                      </button>

                      {/* A11y live region for screen readers */}
                      <p role="status" aria-live="polite" className="sr-only">
                        {copied ? "Short link copied to clipboard" : ""}
                      </p>
                    </div>

                    {/* Quick Actions */}
                    <div className="flex items-center justify-between mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-emerald-200/50">
                      <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-emerald-700">
                        <div className="flex items-center gap-1.5 sm:gap-2">
                          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-emerald-400 rounded-full"></div>
                          <span>Ready to share</span>
                        </div>
                        <div className="flex items-center gap-1.5 sm:gap-2">
                          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-400 rounded-full"></div>
                          <span>Analytics enabled</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Additional Features Info */}
        {!shortUrl && (
          <div className="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
            <div className="bg-white/60 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-slate-200/60 hover:bg-white/80 transition-all duration-300">
              <div className="p-2 sm:p-3 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg sm:rounded-xl w-fit mb-3 sm:mb-4">
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h3 className="font-bold text-slate-800 mb-2 text-sm sm:text-base">
                Advanced Analytics
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm">
                Track clicks, locations, devices, and referrers with detailed
                insights.
              </p>
            </div>

            <div className="bg-white/60 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-slate-200/60 hover:bg-white/80 transition-all duration-300">
              <div className="p-2 sm:p-3 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg sm:rounded-xl w-fit mb-3 sm:mb-4">
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <h3 className="font-bold text-slate-800 mb-2 text-sm sm:text-base">
                Secure & Reliable
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm">
                Enterprise-grade security with 99.9% uptime guarantee.
              </p>
            </div>

            <div className="bg-white/60 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-slate-200/60 hover:bg-white/80 transition-all duration-300 sm:col-span-2 lg:col-span-1">
              <div className="p-2 sm:p-3 bg-gradient-to-br from-emerald-100 to-green-100 rounded-lg sm:rounded-xl w-fit mb-3 sm:mb-4">
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="font-bold text-slate-800 mb-2 text-sm sm:text-base">
                Lightning Fast
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm">
                Instant redirects with global CDN for maximum performance.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UrlForm;
