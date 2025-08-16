import React from "react";
import UrlForm from "../components/UrlForm";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-slate-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-500"></div>
      </div>

      {/* Hero Section */}
      <div className="relative z-10 pt-16 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            {/* Hero Icon */}
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-blue-600 to-blue-700 rounded-3xl mb-8 shadow-2xl transform hover:scale-105 transition-transform duration-300">
              <svg
                className="w-12 h-12 text-white"
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

            {/* Hero Text */}
            <h1 className="text-5xl md:text-7xl font-bold text-slate-900 mb-6 tracking-tight">
              Shorten
              <span className="bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
                {" "}
                URLs
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto leading-relaxed mb-8">
              Transform your long, complex URLs into clean, shareable links that
              are easy to remember and track.
            </p>

            {/* Feature Pills */}
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <div className="inline-flex items-center px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-slate-200 shadow-sm">
                <svg
                  className="w-4 h-4 text-emerald-600 mr-2"
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
                <span className="text-slate-700 font-medium">
                  Lightning Fast
                </span>
              </div>
              <div className="inline-flex items-center px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-slate-200 shadow-sm">
                <svg
                  className="w-4 h-4 text-blue-600 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-slate-700 font-medium">100% Free</span>
              </div>
              <div className="inline-flex items-center px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-slate-200 shadow-sm">
                <svg
                  className="w-4 h-4 text-emerald-600 mr-2"
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
                </svg>
                <span className="text-slate-700 font-medium">Analytics</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* URL Form Section */}
      <div className="relative z-10 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <UrlForm />
        </div>
      </div>

      {/* Features Section */}
      <div className="relative z-10 py-16 bg-white/60 backdrop-blur-sm border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Why Choose Our URL Shortener?
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Simple, fast, and reliable URL shortening with powerful features
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="text-center p-6 rounded-3xl bg-white/80 border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-105">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl mb-4">
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
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                Lightning Fast
              </h3>
              <p className="text-slate-600">
                Generate shortened URLs instantly with our optimized
                infrastructure
              </p>
            </div>

            {/* Feature 2 */}
            <div className="text-center p-6 rounded-3xl bg-white/80 border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-105">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl mb-4">
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
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                Detailed Analytics
              </h3>
              <p className="text-slate-600">
                Track clicks, monitor performance, and gain insights into your
                links
              </p>
            </div>

            {/* Feature 3 */}
            <div className="text-center p-6 rounded-3xl bg-white/80 border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-105">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-slate-500 to-slate-600 rounded-2xl mb-4">
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
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                Custom Links
              </h3>
              <p className="text-slate-600">
                Create branded short links with custom slugs for better
                recognition
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-emerald-600 to-blue-600"></div>
    </div>
  );
};

export default HomePage;
