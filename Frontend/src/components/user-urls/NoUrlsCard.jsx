import React from "react";

export default function NoUrlsCard({ hasFilters, onClear }) {
  return (
    <div className="flex-1">
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-slate-200/60 shadow-xl shadow-slate-200/40 p-8 sm:p-12 text-center">
        <div className="max-w-sm mx-auto">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-500 text-white flex items-center justify-center mx-auto mb-6 shadow-lg shadow-indigo-500/25">
            <svg
              className="w-8 h-8 sm:w-10 sm:h-10"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M3 12h7v9H3zM14 3h7v18h-7z"
                fill="currentColor"
                opacity=".9"
              />
            </svg>
          </div>
          <h3 className="text-lg sm:text-xl font-semibold">
            <span className="bg-gradient-to-br from-indigo-500 to-purple-600 bg-clip-text text-transparent">
              {hasFilters ? "No matching URLs found" : "No URLs yet"}
            </span>
          </h3>
          <p className="text-slate-600 text-sm sm:text-base mt-1">
            {hasFilters
              ? "Try adjusting your search or tag filters."
              : "Create your first shortened URL to start tracking clicks and analytics."}
          </p>
          {hasFilters && (
            <button
              onClick={onClear}
              className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-2xl border border-slate-200 bg-white text-slate-900 hover:scale-[1.02] active:scale-[0.98] transition shadow-md"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
