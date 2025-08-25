import { Link, useNavigate } from "@tanstack/react-router";
import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { logout } from "../store/slice/authSlice.js";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = async () => {
    try {
      await fetch(`${import.meta.env.VITE_API_BASE}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });

      dispatch(logout());
      navigate({ to: "/" });
    } catch (error) {
      console.error("Logout failed:", error);
      dispatch(logout());
      navigate({ to: "/" });
    } finally {
      setShowLogoutModal(false);
      setIsMobileMenuOpen(false);
    }
  };

  const confirmLogout = () => {
    setShowLogoutModal(true);
  };

  return (
    <>
      <nav className="bg-white/95 backdrop-blur-sm shadow-lg border-b border-slate-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left - App Name/Logo */}
            <div className="flex items-center space-x-2">
              <Link to="/" className="flex items-center space-x-3 group">
                <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl group-hover:from-indigo-600 group-hover:to-purple-700 transition-all duration-300 shadow-lg">
                  <svg
                    className="w-6 h-6 text-white"
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
                  <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent group-hover:from-indigo-700 group-hover:to-purple-700 transition-all duration-300">
                    URLShort
                  </h1>
                  <p className="text-xs text-slate-500 hidden sm:block">
                    Link Shortener
                  </p>
                </div>
              </Link>
            </div>

            {/* Center - Navigation Links */}
            <div className="hidden md:flex items-center space-x-1">
              <NavLink to="/" label="Home" />
              <NavLink to="/about" label="About" />
              <NavLink to="/services" label="Services" />
              <NavLink to="/contact" label="Contact" />
            </div>

            {/* Right - Action Buttons */}
            <div className="flex items-center space-x-3">
              {isLoggedIn ? (
                <button
                  onClick={confirmLogout}
                  className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 
                           text-white font-medium rounded-xl hover:from-red-600 hover:to-red-700 
                           focus:outline-none focus:ring-4 focus:ring-red-100
                           transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl
                           active:scale-95"
                >
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
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                    />
                  </svg>
                  <span className="hidden sm:inline">Logout</span>
                </button>
              ) : (
                <Link
                  to="/auth"
                  className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 
                           text-white font-medium rounded-xl hover:from-emerald-600 hover:to-teal-700 
                           focus:outline-none focus:ring-4 focus:ring-emerald-100
                           transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl
                           active:scale-95"
                >
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
                      d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                    />
                  </svg>
                  <span className="hidden sm:inline">Sign In</span>
                </Link>
              )}

              {/* Mobile Menu Button */}
              <div className="md:hidden">
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all duration-200"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d={
                        isMobileMenuOpen
                          ? "M6 18L18 6M6 6l12 12"
                          : "M4 6h16M4 12h16M4 18h16"
                      }
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-slate-100 bg-white/95 backdrop-blur-sm">
            <div className="px-4 py-3 space-y-1">
              <MobileNavLink
                to="/"
                label="Home"
                onClick={() => setIsMobileMenuOpen(false)}
              />
              <MobileNavLink
                to="/about"
                label="About"
                onClick={() => setIsMobileMenuOpen(false)}
              />
              <MobileNavLink
                to="/services"
                label="Services"
                onClick={() => setIsMobileMenuOpen(false)}
              />
              <MobileNavLink
                to="/contact"
                label="Contact"
                onClick={() => setIsMobileMenuOpen(false)}
              />
              {isLoggedIn ? (
                <button
                  onClick={confirmLogout}
                  className="flex items-center w-full text-left px-4 py-3 text-red-600 hover:text-red-700 hover:bg-red-50 
                           rounded-xl font-medium transition-all duration-200"
                >
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
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                    />
                  </svg>
                  Logout
                </button>
              ) : (
                <MobileNavLink
                  to="/auth"
                  label="Sign In"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                />
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity backdrop-blur-sm"
              onClick={() => setShowLogoutModal(false)}
            ></div>

            {/* Modal */}
            <div className="relative transform overflow-hidden rounded-2xl bg-white px-4 pb-4 pt-5 text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                  <svg
                    className="h-6 w-6 text-red-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                    />
                  </svg>
                </div>
                <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                  <h3 className="text-base font-semibold leading-6 text-gray-900">
                    Confirm Logout
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Are you sure you want to logout? You'll need to sign in
                      again to access your account.
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse gap-3">
                <button
                  type="button"
                  className="inline-flex w-full justify-center rounded-xl bg-gradient-to-r from-red-500 to-red-600 
                           px-4 py-2.5 text-sm font-semibold text-white shadow-lg hover:from-red-600 hover:to-red-700 
                           transition-all duration-200 transform hover:scale-105 active:scale-95
                           sm:w-auto focus:outline-none focus:ring-4 focus:ring-red-100"
                  onClick={handleLogout}
                >
                  Yes, Logout
                </button>
                <button
                  type="button"
                  className="mt-3 inline-flex w-full justify-center rounded-xl bg-white px-4 py-2.5 
                           text-sm font-semibold text-gray-900 shadow-lg ring-1 ring-inset ring-gray-300 
                           hover:bg-gray-50 transition-all duration-200 transform hover:scale-105 active:scale-95
                           sm:mt-0 sm:w-auto focus:outline-none focus:ring-4 focus:ring-gray-100"
                  onClick={() => setShowLogoutModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// Desktop Navigation Link Component
const NavLink = ({ to, label }) => {
  return (
    <Link
      to={to}
      className="px-4 py-2 text-slate-700 hover:text-indigo-700 hover:bg-indigo-50 
               rounded-xl font-medium transition-all duration-200 transform hover:scale-105
               [&.active]:text-indigo-700 [&.active]:bg-indigo-50 [&.active]:shadow-md"
    >
      {label}
    </Link>
  );
};

// Mobile Navigation Link Component
const MobileNavLink = ({ to, label, onClick, className = "" }) => {
  const defaultClasses =
    "block px-4 py-3 text-slate-700 hover:text-indigo-700 hover:bg-indigo-50 rounded-xl font-medium transition-all duration-200 [&.active]:text-indigo-700 [&.active]:bg-indigo-50";

  return (
    <Link to={to} onClick={onClick} className={className || defaultClasses}>
      {label}
    </Link>
  );
};

export default Navbar;
