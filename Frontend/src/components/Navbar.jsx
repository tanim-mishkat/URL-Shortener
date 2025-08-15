import { Link } from "@tanstack/react-router";

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md px-6 py-3 flex items-center justify-between">
      {/* Left - App Name */}
      <div className="text-xl font-bold text-gray-800">
        <Link to="/">URL Shortener</Link>
      </div>

      {/* Center - Navigation Links */}
      <div className="flex space-x-6">
        <Link to="/" className="text-gray-600 hover:text-gray-900">
          Home
        </Link>
        <Link to="/about" className="text-gray-600 hover:text-gray-900">
          About
        </Link>
        <Link to="/services" className="text-gray-600 hover:text-gray-900">
          Services
        </Link>
        <Link to="/contact" className="text-gray-600 hover:text-gray-900">
          Contact
        </Link>
      </div>

      {/* Right - Login Button */}
      <div>
        <Link
          to="/auth"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Login
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
