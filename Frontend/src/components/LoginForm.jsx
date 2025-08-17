import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { loginUser } from "../api/user.api";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../store/slice/authSlice.js";
import { useNavigate, Link } from "@tanstack/react-router";

export default function LoginForm({ setLogin }) {
  const [email, setEmail] = useState("user1@gmail.com");
  const [password, setPassword] = useState("11111111");
  const [errors, setErrors] = useState({});
  const [showPw, setShowPw] = useState(false);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const auth = useSelector((state) => state.auth);
  function validate({ email, password }) {
    const e = {};
    if (!email.trim()) e.email = "Please enter your email address";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
      e.email = "Enter a valid email address";
    if (!password) e.password = "Please enter your password";
    return e;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMsg("");

    const eMap = validate({ email, password });
    setErrors(eMap);
    if (Object.keys(eMap).length) return;

    try {
      setLoading(true);
      const res = await loginUser(password, email);
      dispatch(login(res.user));
      setMsg("Logged in!");
      navigate({ to: "/dashboard" });
    } catch (err) {
      setMsg(
        "We couldn't sign you in. Please check your details and try again."
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="w-full max-w-md">
        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
          {/* Header */}
          <div className="px-8 py-10 bg-gradient-to-br from-blue-600 to-blue-700 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl mb-4">
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
            <h1 className="text-2xl font-bold text-white mb-2">Welcome Back</h1>
            <p className="text-blue-100">Sign in to your account to continue</p>
          </div>

          {/* Form */}
          <div className="px-8 py-8">
            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
              <Field
                label="Email Address"
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={errors.email}
              />

              <PasswordField
                label="Password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                show={showPw}
                setShow={setShowPw}
                error={errors.password}
              />

              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    id="remember"
                    name="remember"
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 bg-slate-50 border-slate-300 rounded focus:ring-blue-500 focus:ring-2"
                  />
                  <span className="ml-2 text-sm text-slate-700">
                    Remember me
                  </span>
                </label>

                {/* Changed from <a> to <Link> */}
                <Link
                  to="/forgot-password"
                  className="text-sm text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-200"
                >
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold 
                         py-3 px-6 rounded-2xl hover:from-blue-700 hover:to-blue-800 
                         focus:outline-none focus:ring-4 focus:ring-blue-100
                         transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]
                         shadow-lg hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed
                         disabled:transform-none"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Signing in...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    <svg
                      className="w-5 h-5 mr-2"
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
                    Sign In
                  </span>
                )}
              </button>

              {msg && (
                <div
                  className={`p-4 rounded-2xl border ${
                    msg === "Logged in!"
                      ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                      : "bg-red-50 border-red-200 text-red-700"
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    {msg === "Logged in!" ? (
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
                    ) : (
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
                          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    )}
                    <p className="font-medium">{msg}</p>
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Footer */}
          <div className="px-8 py-6 bg-slate-50 border-t border-slate-100">
            <p className="text-center text-sm text-slate-600">
              Don't have an account?{" "}
              <span
                onClick={() => setLogin && setLogin(false)}
                className="font-semibold text-blue-600 hover:text-blue-800 cursor-pointer hover:underline transition-colors duration-200"
              >
                Create one
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, id, name, type = "text", value, onChange, error }) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-semibold text-slate-700 mb-2"
      >
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        autoComplete={name === "email" ? "email" : undefined}
        className={`w-full px-4 py-3 bg-slate-50 border rounded-2xl text-slate-900 
                   placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-100 
                   focus:border-blue-500 transition-all duration-200 ${
                     error ? "border-red-300 bg-red-50" : "border-slate-200"
                   }`}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
      />
      {error && (
        <p
          id={`${id}-error`}
          className="mt-2 text-sm text-red-600 flex items-center space-x-1"
        >
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
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}

function PasswordField({
  label,
  id,
  name,
  value,
  onChange,
  show,
  setShow,
  error,
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-semibold text-slate-700 mb-2"
      >
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          name={name}
          type={show ? "text" : "password"}
          value={value}
          onChange={onChange}
          autoComplete="current-password"
          className={`w-full px-4 py-3 pr-12 bg-slate-50 border rounded-2xl text-slate-900 
                     placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-100 
                     focus:border-blue-500 transition-all duration-200 ${
                       error ? "border-red-300 bg-red-50" : "border-slate-200"
                     }`}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-slate-500 hover:text-slate-700 
                   rounded-lg hover:bg-slate-100 transition-all duration-200"
          aria-label={show ? "Hide password" : "Show password"}
        >
          {show ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
      {error && (
        <p
          id={`${id}-error`}
          className="mt-2 text-sm text-red-600 flex items-center space-x-1"
        >
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
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 0 0118 0z"
            />
          </svg>
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}
