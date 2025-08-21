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
      // Normalize & validate input
      const trimmed = url.trim();

      // Block dangerous schemes early
      if (/^(javascript:|data:)/i.test(trimmed)) {
        throw { friendlyMessage: "Unsupported URL scheme." };
      }

      // Ensure protocol, strip fragment, and re-serialize
      const normalized = (() => {
        try {
          const withProto = trimmed.includes("://")
            ? trimmed
            : `https://${trimmed}`;
          const u = new URL(withProto);
          u.hash = ""; // avoid persisting tracking fragments
          return u.toString();
        } catch {
          throw { friendlyMessage: "Please enter a valid URL." };
        }
      })();

      // Create on server
      const shortUrlResponse = await createShortUrl(normalized, customSlug);
      setShortUrl(shortUrlResponse);

      // Refresh the user URLs list without aggressive polling
      await queryClient.invalidateQueries({ queryKey: ["userUrls"] });

      // Reset inputs
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
          : "Couldn’t create the link. Please try again.");
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/50">
      <div className="w-full px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-12 max-w-4xl mx-auto">
        {/* Main Form Card */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl shadow-slate-200/40 border border-slate-200/60 overflow-hidden">
          {/* Header Section */}
          <div className="px-6 sm:px-8 lg:px-12 py-8 sm:py-12 bg-gradient-to-br from-indigo-50/50 via-purple-50/30 to-blue-50/40 border-b border-slate-100/50">
            <div className="text-center max-w-2xl mx-auto">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-500 via-purple-500 to-blue-600 rounded-3xl mb-6 shadow-lg shadow-indigo-500/25">
                <svg
                  className="w-10 h-10 text-white"
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

              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="w-2 h-10 bg-gradient-to-b from-indigo-500 to-purple-600 rounded-full"></div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-slate-800 via-indigo-700 to-purple-700 bg-clip-text text-transparent">
                  Shorten Your URL
                </h1>
              </div>

              <p className="text-slate-600 text-lg sm:text-xl leading-relaxed">
                Transform long, complex URLs into clean, shareable links in
                seconds
              </p>

              <div className="flex items-center justify-center gap-6 mt-6 text-sm text-slate-500">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                  <span>Free Forever</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span>Analytics Included</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  <span>Custom Links</span>
                </div>
              </div>
            </div>
          </div>

          {/* Form Section */}
          <div className="px-6 sm:px-8 lg:px-12 py-8 sm:py-12">
            <form
              onSubmit={handleSubmit}
              className="space-y-8 max-w-2xl mx-auto"
            >
              {/* URL Input */}
              <div className="group">
                <label
                  htmlFor="url"
                  className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-4"
                >
                  <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
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
                    className="w-full px-6 py-5 text-slate-900 bg-gradient-to-r from-slate-50 to-indigo-50/30 
                             border-2 border-slate-200/60 rounded-2xl focus:outline-none focus:ring-4 
                             focus:ring-indigo-100 focus:border-indigo-400 transition-all duration-300 
                             text-base sm:text-lg placeholder:text-slate-400 group-hover:border-indigo-300
                             shadow-sm hover:shadow-md focus:shadow-lg"
                  />
                  <div className="absolute inset-y-0 right-6 flex items-center pointer-events-none">
                    <div className="p-2 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl">
                      <svg
                        className="w-5 h-5 text-indigo-600"
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
                    className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-4"
                  >
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    Custom slug
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">
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
                      className="w-full px-6 py-5 text-slate-900 bg-gradient-to-r from-slate-50 to-purple-50/30 
                               border-2 border-slate-200/60 rounded-2xl focus:outline-none focus:ring-4 
                               focus:ring-purple-100 focus:border-purple-400 transition-all duration-300 
                               text-base sm:text-lg placeholder:text-slate-400 group-hover:border-purple-300
                               shadow-sm hover:shadow-md focus:shadow-lg"
                    />
                    <div className="absolute inset-y-0 right-6 flex items-center pointer-events-none">
                      <div className="p-2 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl">
                        <svg
                          className="w-5 h-5 text-purple-600"
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
                  <p className="mt-2 text-sm text-slate-500 flex items-center gap-2">
                    <svg
                      className="w-4 h-4"
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

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="group relative w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-600 
                         text-white font-bold py-5 px-8 rounded-2xl hover:from-indigo-600 hover:via-purple-600 
                         hover:to-blue-700 focus:outline-none focus:ring-4 focus:ring-indigo-200
                         transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]
                         shadow-xl shadow-indigo-500/25 hover:shadow-2xl hover:shadow-indigo-500/40
                         disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                         text-lg sm:text-xl"
              >
                <span className="flex items-center justify-center space-x-3">
                  {isSubmitting ? (
                    <>
                      <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Creating your link...</span>
                    </>
                  ) : (
                    <>
                      <div className="p-1 bg-white/20 rounded-lg group-hover:bg-white/30 transition-colors">
                        <svg
                          className="w-5 h-5"
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
                      <span>✨ Shorten URL</span>
                    </>
                  )}
                </span>
              </button>
            </form>

            {/* Error Message */}
            {error && (
              <div className="mt-8 max-w-2xl mx-auto">
                <div className="p-6 bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200/60 rounded-2xl shadow-lg">
                  <div className="flex items-start space-x-4">
                    <div className="p-2 bg-red-100 rounded-xl">
                      <svg
                        className="w-6 h-6 text-red-600"
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
                      <h4 className="font-bold text-red-800 mb-1">
                        Oops! Something went wrong
                      </h4>
                      <p className="text-red-700 font-medium leading-relaxed">
                        {error}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Success Result */}
            {shortUrl && (
              <div className="mt-8 max-w-2xl mx-auto">
                <div
                  className="p-6 sm:p-8 bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 
                               border-2 border-emerald-200/60 rounded-3xl shadow-xl shadow-emerald-500/10 
                               hover:shadow-2xl hover:shadow-emerald-500/20 transition-all duration-300"
                >
                  {/* Success Header */}
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-gradient-to-br from-emerald-100 to-green-100 rounded-2xl shadow-sm">
                      <svg
                        className="w-7 h-7 text-emerald-600"
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
                      <h3 className="text-xl sm:text-2xl font-bold text-emerald-900">
                        🎉 Your shortened URL is ready!
                      </h3>
                      <p className="text-emerald-700 text-sm sm:text-base">
                        Share it anywhere, track clicks, and get insights
                      </p>
                    </div>
                  </div>

                  {/* URL Display and Copy */}
                  <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-emerald-200/50 shadow-sm">
                    <div className="flex items-center justify-between gap-4 flex-wrap sm:flex-nowrap">
                      <div className="flex-1 min-w-0">
                        <label className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-2 block">
                          Your Short URL
                        </label>
                        <Link
                          to={shortUrl}
                          className="text-indigo-700 hover:text-purple-700 font-bold break-all text-lg sm:text-xl
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
                        className={`flex-shrink-0 px-6 py-3 rounded-xl font-bold transition-all duration-300 
                                   shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 ${
                                     copied
                                       ? "bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-emerald-500/25"
                                       : "bg-white text-slate-700 hover:bg-slate-50 border-2 border-slate-200 hover:border-emerald-300"
                                   }`}
                      >
                        {copied ? (
                          <span className="flex items-center space-x-2">
                            <svg
                              className="w-5 h-5"
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
                            <span>✅ Copied!</span>
                          </span>
                        ) : (
                          <span className="flex items-center space-x-2">
                            <svg
                              className="w-5 h-5"
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
                            <span>📋 Copy Link</span>
                          </span>
                        )}
                      </button>

                      {/* A11y live region for screen readers */}
                      <p role="status" aria-live="polite" className="sr-only">
                        {copied ? "Short link copied to clipboard" : ""}
                      </p>
                    </div>

                    {/* Quick Actions */}
                    <div className="flex items-center justify-between mt-6 pt-4 border-t border-emerald-200/50">
                      <div className="flex items-center gap-4 text-sm text-emerald-700">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                          <span>Ready to share</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
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
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/60 hover:bg-white/80 transition-all duration-300">
              <div className="p-3 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl w-fit mb-4">
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
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h3 className="font-bold text-slate-800 mb-2">
                Advanced Analytics
              </h3>
              <p className="text-slate-600 text-sm">
                Track clicks, locations, devices, and referrers with detailed
                insights.
              </p>
            </div>

            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/60 hover:bg-white/80 transition-all duration-300">
              <div className="p-3 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl w-fit mb-4">
                <svg
                  className="w-6 h-6 text-purple-600"
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
              <h3 className="font-bold text-slate-800 mb-2">
                Secure & Reliable
              </h3>
              <p className="text-slate-600 text-sm">
                Enterprise-grade security with 99.9% uptime guarantee.
              </p>
            </div>

            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/60 hover:bg-white/80 transition-all duration-300">
              <div className="p-3 bg-gradient-to-br from-emerald-100 to-green-100 rounded-xl w-fit mb-4">
                <svg
                  className="w-6 h-6 text-emerald-600"
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
              <h3 className="font-bold text-slate-800 mb-2">Lightning Fast</h3>
              <p className="text-slate-600 text-sm">
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
