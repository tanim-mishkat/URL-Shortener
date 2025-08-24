export default function ConfirmModal({
  open,
  title = "Are you sure?",
  message = "",
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onClose,
  busy = false,
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div
        className="absolute inset-0 bg-slate-900/50"
        onClick={busy ? undefined : onClose}
      />
      <div className="relative z-[101] w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
        {message ? (
          <p className="mt-2 text-sm text-slate-600">{message}</p>
        ) : null}
        <div className="mt-6 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            disabled={busy}
            className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={busy}
            className="px-4 py-2 rounded-xl text-white bg-gradient-to-br from-red-500 to-pink-500 hover:scale-[1.02] active:scale-[0.98] transition disabled:opacity-50 shadow shadow-rose-500/25"
          >
            {busy ? "Working…" : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
