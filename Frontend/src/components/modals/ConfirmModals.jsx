import React from "react";
import { AlertTriangle, AlertCircle, Info } from "lucide-react";

export default function ConfirmModal({
  open,
  title = "Are you sure?",
  message = "",
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onClose,
  busy = false,
  variant = "danger", // danger, warning, info
}) {
  if (!open) return null;

  const variantStyles = {
    danger: {
      icon: <AlertTriangle className="h-6 w-6 text-red-600" />,
      iconBg: "bg-red-100",
      button:
        "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 focus:ring-red-100",
    },
    warning: {
      icon: <AlertCircle className="h-6 w-6 text-amber-600" />,
      iconBg: "bg-amber-100",
      button:
        "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 focus:ring-amber-100",
    },
    info: {
      icon: <Info className="h-6 w-6 text-blue-600" />,
      iconBg: "bg-blue-100",
      button:
        "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 focus:ring-blue-100",
    },
  };

  const currentVariant = variantStyles[variant] || variantStyles.danger;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className="fixed inset-0 bg-black/25 backdrop-blur-sm transition-opacity"
          onClick={busy ? undefined : onClose}
        />

        <div className="relative bg-white rounded-xl shadow-xl max-w-md w-full p-6 transform transition-all">
          <div className="flex items-start gap-4">
            <div
              className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${currentVariant.iconBg}`}
            >
              {currentVariant.icon}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {title}
              </h3>
              {message && (
                <p className="text-sm text-gray-600 leading-relaxed mb-6">
                  {message}
                </p>
              )}

              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={busy}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {cancelText}
                </button>
                <button
                  type="button"
                  onClick={onConfirm}
                  disabled={busy}
                  className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${currentVariant.button}`}
                >
                  {busy ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Working...
                    </>
                  ) : (
                    confirmText
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
