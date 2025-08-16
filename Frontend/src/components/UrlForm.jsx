import React, { useState } from "react";
import { createShortUrl } from "../api/shortUrl.api";
import { useSelector } from "react-redux";
import UserUrls from "./UserUrls.jsx";
import { QueryClient } from "@tanstack/react-query";
import { queryClient } from "../main.jsx";
import { Link } from "@tanstack/react-router";

const UrlForm = () => {
  const [url, setUrl] = useState("https://example.com");
  const [shortUrl, setShortUrl] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [customSlug, setCustomSlug] = useState("");
  const { isLoggedIn } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setShortUrl("");
    setCopied(false);
    try {
      const shortUrlResponse = await createShortUrl(url, customSlug);
      setShortUrl(shortUrlResponse);
      queryClient.invalidateQueries({ queryKey: ["userUrls"] });
      setError("");
    } catch (err) {
      console.log(err);
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "We couldn’t shorten that link. Please check the URL and try again."
      );
    }
  };

  const handleCopy = () => {
    if (shortUrl) {
      navigator.clipboard.writeText(shortUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 sm:px-6">
      {/* Main Form Card */}
      <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8 sm:p-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl mb-4">
            <svg
              className="w-8 h-8 text-white"
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
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Shorten Your URL
          </h1>
          <p className="text-slate-600 text-lg">
            Create clean, shareable links in seconds
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* URL Input */}
          <div className="relative">
            <label
              htmlFor="url"
              className="block text-sm font-semibold text-slate-700 mb-3"
            >
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
                className="w-full px-5 py-4 text-slate-900 bg-slate-50 border border-slate-200 rounded-2xl 
                         focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500
                         transition-all duration-200 text-base placeholder:text-slate-400"
              />
              <div className="absolute inset-y-0 right-4 flex items-center">
                <svg
                  className="w-5 h-5 text-slate-400"
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

          {/* Custom Slug Input (for logged in users) */}
          {isLoggedIn && (
            <div className="relative">
              <label
                htmlFor="customSlug"
                className="block text-sm font-semibold text-slate-700 mb-3"
              >
                Custom slug{" "}
                <span className="text-slate-400 font-normal">(optional)</span>
              </label>
              <div className="relative">
                <input
                  id="customSlug"
                  type="text"
                  value={customSlug}
                  onChange={(e) => setCustomSlug(e.target.value)}
                  placeholder="my-custom-link"
                  className="w-full px-5 py-4 text-slate-900 bg-slate-50 border border-slate-200 rounded-2xl 
                           focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500
                           transition-all duration-200 text-base placeholder:text-slate-400"
                />
                <div className="absolute inset-y-0 right-4 flex items-center">
                  <svg
                    className="w-5 h-5 text-slate-400"
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
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold 
                     py-4 px-8 rounded-2xl hover:from-blue-700 hover:to-blue-800 
                     focus:outline-none focus:ring-4 focus:ring-blue-100
                     transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]
                     shadow-lg hover:shadow-xl"
          >
            <span className="flex items-center justify-center space-x-2">
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
              <span>Shorten URL</span>
            </span>
          </button>
        </form>

        {/* Error Message */}
        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-2xl">
            <div className="flex items-center space-x-3">
              <svg
                className="w-5 h-5 text-red-500 flex-shrink-0"
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
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* Success Result */}
        {shortUrl && (
          <div className="mt-8 p-6 bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200 rounded-2xl">
            <div className="flex items-start justify-between space-x-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-2">
                  <svg
                    className="w-5 h-5 text-emerald-600"
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
                  <h3 className="font-semibold text-emerald-900">
                    Your shortened URL is ready!
                  </h3>
                </div>
                <Link
                  to={shortUrl}
                  className="text-blue-700 hover:text-blue-800 font-medium break-all text-lg
                           hover:underline transition-colors duration-200"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {shortUrl}
                </Link>
              </div>
              <button
                type="button"
                onClick={handleCopy}
                className={`flex-shrink-0 px-4 py-2 rounded-xl font-medium transition-all duration-200
                  ${
                    copied
                      ? "bg-emerald-600 text-white shadow-lg"
                      : "bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 hover:border-slate-300"
                  }`}
              >
                {copied ? (
                  <span className="flex items-center space-x-2">
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
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>Copied!</span>
                  </span>
                ) : (
                  <span className="flex items-center space-x-2">
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
                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                    <span>Copy</span>
                  </span>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UrlForm;
