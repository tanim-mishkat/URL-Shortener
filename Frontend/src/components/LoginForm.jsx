import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { loginUser } from "../api/user.api";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../store/slice/authSlice.js";
import { useNavigate } from "@tanstack/react-router";

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
  console.log(auth);
  function validate({ email, password }) {
    const e = {};
    if (!email.trim()) e.email = "Required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
      e.email = "Enter a valid email";
    if (!password) e.password = "Required";
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
        err?.response?.data?.message ||
          err?.message ||
          "Something went wrong. Please try again."
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-2">
      <div className="w-full max-w-md bg-white rounded-2xl shadow p-6 ring-1 ring-slate-200 flex flex-col">
        <div className="text-center mb-6">
          <div className="mx-auto h-12 w-12 rounded-2xl bg-indigo-600 text-white grid place-items-center mb-2">
            🔒
          </div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Sign in to your account
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <Field
            label="Email"
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

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 select-none">
              <input
                id="remember"
                name="remember"
                type="checkbox"
                // Remove checked/onChange for remember, or implement if needed
                className="h-4 w-4 rounded border-slate-300 text-indigo-600"
              />
              <span className="text-slate-600">Remember me</span>
            </label>
            <a href="#" className="text-slate-700 hover:underline">
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-indigo-600 px-4 py-2.5 text-white font-medium shadow-sm hover:bg-indigo-700 transition disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>

          {msg && (
            <p
              className="text-sm text-slate-600 text-center"
              aria-live="polite"
            >
              {msg}
            </p>
          )}
        </form>

        <p className="mt-4 text-center text-sm text-slate-600">
          Don&apos;t have an account?{" "}
          <span
            onClick={() => setLogin && setLogin(false)}
            className="font-medium text-slate-900 hover:underline cursor-pointer"
          >
            Create one
          </span>
        </p>
      </div>
    </div>
  );
}

function Field({ label, id, name, type = "text", value, onChange, error }) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-slate-700 mb-1"
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
        className={`block w-full rounded-xl border px-3 py-2 text-slate-900 bg-slate-50 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${
          error ? "border-rose-300" : "border-slate-200"
        }`}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
      />
      {error && (
        <p id={`${id}-error`} className="mt-1 text-sm text-rose-600">
          {error}
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
        className="block text-sm font-medium text-slate-700 mb-1"
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
          className={`block w-full rounded-xl border px-3 py-2 pr-10 text-slate-900 bg-slate-50 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${
            error ? "border-rose-300" : "border-slate-200"
          }`}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-slate-500 hover:text-slate-700"
          aria-label={show ? "Hide password" : "Show password"}
        >
          {show ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
      {error && (
        <p id={`${id}-error`} className="mt-1 text-sm text-rose-600">
          {error}
        </p>
      )}
    </div>
  );
}
