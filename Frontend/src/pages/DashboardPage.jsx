import UrlForm from "../components/UrlForm.jsx";
import UserUrls from "../components/UserUrls.jsx";

const DashboardPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 relative">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-64 h-64 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-slate-200 rounded-full mix-blend-multiply filter blur-2xl opacity-10 animate-pulse delay-500"></div>
      </div>

      {/* Header Section */}
      <div className="relative z-10 pt-8 pb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-700 rounded-3xl mb-6 shadow-lg">
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
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Dashboard
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Manage your shortened URLs and track their performance all in one
              place
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex-1 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* URL Shortening Section */}
          <section>
            <UrlForm />
          </section>

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

export default DashboardPage;
