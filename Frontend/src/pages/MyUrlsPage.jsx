import UserUrls from "../components/UserUrls.jsx";

const MyUrlsPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 relative">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 sm:top-20 right-10 sm:right-20 w-48 sm:w-72 h-48 sm:h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-10 sm:bottom-20 left-10 sm:left-20 w-40 sm:w-64 h-40 sm:h-64 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 sm:w-96 h-60 sm:h-96 bg-slate-200 rounded-full mix-blend-multiply filter blur-2xl opacity-10 animate-pulse delay-500"></div>
      </div>

      {/* Header Section */}
      <div className="relative z-10 pt-4 sm:pt-8 pb-4 sm:pb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl sm:rounded-3xl mb-4 sm:mb-6 shadow-lg">
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
                  d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 mb-3 sm:mb-4">
              My URLs
            </h1>
            <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed px-4">
              Manage, organize, and track all your shortened URLs in one place
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex-1 pb-8 sm:pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* User URLs Section */}
          <section>
            <UserUrls />
          </section>
        </div>
      </div>

      {/* Footer Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-emerald-600 to-blue-600"></div>
    </div>
  );
};

export default MyUrlsPage;