import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { registerUser } from "../api/user.api";
import { useNavigate } from "@tanstack/react-router";

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

  function validate({ name, email, password, confirm, agree }) {
    const e = {};
    if (!name.trim()) e.name = "Required";
    if (!email.trim()) e.email = "Required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
      e.email = "Invalid email";
    if (!password) e.password = "Required";
    else if (password.length < 8) e.password = "Min 8 chars";
    if (!confirm) e.confirm = "Confirm password";
    else if (password !== confirm) e.confirm = "Passwords don't match";
    if (!agree) e.agree = "Accept terms";
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
      setMsg("Registered!");
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
            📝
          </div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Create your account
          </h1>
          <p className="text-sm text-slate-500">
            Minimal. Calm. Easy on the eyes.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <Field
            label="Full name"
            id="name"
            name="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={errors.name}
          />

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

          <PasswordField
            label="Confirm password"
            id="confirm"
            name="confirm"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            show={showPw2}
            setShow={setShowPw2}
            error={errors.confirm}
          />

          <div className="flex items-center gap-2">
            <input
              id="agree"
              name="agree"
              type="checkbox"
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-indigo-600"
            />
            <label htmlFor="agree" className="text-sm text-slate-600">
              I agree to the{" "}
              <a href="#" className="underline">
                Terms
              </a>{" "}
              and{" "}
              <a href="#" className="underline">
                Privacy Policy
              </a>
              .
            </label>
          </div>
          {errors.agree && (
            <p className="text-sm text-rose-600">{errors.agree}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-indigo-600 px-4 py-2.5 text-white font-medium shadow-sm hover:bg-indigo-700 transition disabled:opacity-60"
          >
            {loading ? "Registering..." : "Register"}
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
          Already have an account?{" "}
          <span
            onClick={() => setLogin?.(true)}
            className="font-medium text-slate-900 hover:underline cursor-pointer"
          >
            Sign in
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
