import { Link, useNavigate } from "@tanstack/react-router";
import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { logout } from "../store/slice/authSlice.js"; 

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include", // Include cookies if using session-based auth
      });

      dispatch(logout());

      navigate({ to: "/" });
    } catch (error) {
      console.error("Logout failed:", error);
      dispatch(logout());
      navigate({ to: "/" });
    }
  };

  return (
    <nav className="bg-white/95 backdrop-blur-sm shadow-lg border-b border-slate-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left - App Name/Logo */}
          <div className="flex items-center space-x-2">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="p-2 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl group-hover:from-blue-700 group-hover:to-blue-800 transition-all duration-200">
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
                <h1 className="text-xl font-bold text-slate-900 group-hover:text-blue-700 transition-colors duration-200">
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
                onClick={handleLogout}
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 
                         text-white font-medium rounded-xl hover:from-blue-700 hover:to-blue-800 
                         focus:outline-none focus:ring-4 focus:ring-blue-100
                         transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
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
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 
                         text-white font-medium rounded-xl hover:from-blue-700 hover:to-blue-800 
                         focus:outline-none focus:ring-4 focus:ring-blue-100
                         transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
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

      {/* Mobile Navigation Menu - Conditionally visible */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white">
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
                onClick={() => {
                  handleLogout();
                  setIsMobileMenuOpen(false);
                }}
                className="block w-full text-left px-4 py-3 text-slate-700 hover:text-blue-700 hover:bg-blue-50 
                         rounded-xl font-medium transition-all duration-200"
              >
                Logout
              </button>
            ) : (
              <MobileNavLink
                to="/auth"
                label="Sign In"
                onClick={() => setIsMobileMenuOpen(false)}
              />
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

// Desktop Navigation Link Component
const NavLink = ({ to, label }) => {
  return (
    <Link
      to={to}
      className="px-4 py-2 text-slate-700 hover:text-blue-700 hover:bg-blue-50 
               rounded-xl font-medium transition-all duration-200
               [&.active]:text-blue-700 [&.active]:bg-blue-50"
    >
      {label}
    </Link>
  );
};

// Mobile Navigation Link Component
const MobileNavLink = ({ to, label, onClick }) => {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="block px-4 py-3 text-slate-700 hover:text-blue-700 hover:bg-blue-50 
               rounded-xl font-medium transition-all duration-200
               [&.active]:text-blue-700 [&.active]:bg-blue-50"
    >
      {label}
    </Link>
  );
};

export default Navbar;
