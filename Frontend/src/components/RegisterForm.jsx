import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { registerUser } from "../api/user.api";
import { useNavigate, Link } from "@tanstack/react-router";
import { useDispatch } from "react-redux";
import { login } from "../store/slice/authSlice";

export default function RegisterForm({ setLogin }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [agree, setAgree] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPw, setShowPw] = useState(false);
  const [showPw2, setShowPw2] = useState(false);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  function validate({ name, email, password, confirm, agree }) {
    const e = {};
    if (!name.trim()) e.name = "Please enter your full name";
    if (!email.trim()) e.email = "Please enter your email address";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
      e.email = "Enter a valid email address";
    if (!password) e.password = "Please enter a password";
    else if (password.length < 8) e.password = "Use at least 8 characters";
    if (!confirm) e.confirm = "Please confirm your password";
    else if (password !== confirm) e.confirm = "Passwords don’t match";
    if (!agree) e.agree = "Please accept the terms to continue";
    return e;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMsg("");

    const eMap = validate({ name, email, password, confirm, agree });
    setErrors(eMap);
    if (Object.keys(eMap).length) return;

    try {
      setLoading(true);
      const res = await registerUser(name, password, email);
      if (res?.user) dispatch(login(res.user));
      setMsg("Registered!");
      navigate({ to: "/dashboard" });
    } catch (err) {
      setMsg(
        err.friendlyMessage || "Something went wrong. Please try again later."
      );
      setErrors({});
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
          <div className="px-8 py-10 bg-gradient-to-br from-emerald-600 to-emerald-700 text-center">
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
                  d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">
              Create Account
            </h1>
            <p className="text-emerald-100">
              Join us to start shortening your URLs
            </p>
          </div>

          {/* Form */}
          <div className="px-8 py-8">
            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
              <Field
                label="Full Name"
                id="name"
                name="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                error={errors.name}
                placeholder="Enter your full name"
              />

              <Field
                label="Email Address"
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={errors.email}
                placeholder="Enter your email"
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
                placeholder="Create a strong password"
              />

              <PasswordField
                label="Confirm Password"
                id="confirm"
                name="confirm"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                show={showPw2}
                setShow={setShowPw2}
                error={errors.confirm}
                placeholder="Re-enter your password"
              />

              <div className="space-y-2">
                <div className="flex items-start space-x-3">
                  <input
                    id="agree"
                    name="agree"
                    type="checkbox"
                    checked={agree}
                    onChange={(e) => setAgree(e.target.checked)}
                    className="w-5 h-5 text-emerald-600 bg-slate-50 border-slate-300 rounded focus:ring-emerald-500 focus:ring-2 mt-0.5"
                  />
                  <label
                    htmlFor="agree"
                    className="text-sm text-slate-700 leading-relaxed"
                  >
                    I agree to the{" "}
                    <Link
                      to="/terms"
                      className="text-emerald-600 hover:text-emerald-800 font-medium hover:underline transition-colors duration-200"
                    >
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link
                      to="/privacy"
                      className="text-emerald-600 hover:text-emerald-800 font-medium hover:underline transition-colors duration-200"
                    >
                      Privacy Policy
                    </Link>
                  </label>
                </div>
                {errors.agree && (
                  <p className="text-sm text-red-600 flex items-center space-x-1 ml-8">
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
                    <span>{errors.agree}</span>
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-semibold 
                         py-3 px-6 rounded-2xl hover:from-emerald-700 hover:to-emerald-800 
                         focus:outline-none focus:ring-4 focus:ring-emerald-100
                         transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]
                         shadow-lg hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed
                         disabled:transform-none"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Creating Account...
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
                        d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                      />
                    </svg>
                    Create Account
                  </span>
                )}
              </button>

              {msg && (
                <div
                  className={`p-4 rounded-2xl border ${
                    msg === "Registered!"
                      ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                      : "bg-red-50 border-red-200 text-red-700"
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    {msg === "Registered!" ? (
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
              Already have an account?{" "}
              <span
                onClick={() => setLogin?.(true)}
                className="font-semibold text-emerald-600 hover:text-emerald-800 cursor-pointer hover:underline transition-colors duration-200"
              >
                Sign in
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  id,
  name,
  type = "text",
  value,
  onChange,
  error,
  placeholder,
}) {
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
        placeholder={placeholder}
        className={`w-full px-4 py-3 bg-slate-50 border rounded-2xl text-slate-900 
                   placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-emerald-100 
                   focus:border-emerald-500 transition-all duration-200 ${
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
  placeholder,
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
          placeholder={placeholder}
          className={`w-full px-4 py-3 pr-12 bg-slate-50 border rounded-2xl text-slate-900 
                     placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-emerald-100 
                     focus:border-emerald-500 transition-all duration-200 ${
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
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}
