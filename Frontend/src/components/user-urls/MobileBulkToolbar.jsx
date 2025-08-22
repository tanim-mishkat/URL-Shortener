
import MovePicker from "./MovePicker.jsx";

export default function MobileBulkToolbar({
  inline = false,
  hasSelection,
  count,
  mutateBatch,
  clearSel,
  folders = [],
  onPickMove,
  allSelectedOnPage = false,
  toggleAllOnPage = () => {},
}) {
  if (!hasSelection) return null;

  const outerClass = inline
    ? "lg:hidden"
    : "fixed bottom-3 inset-x-3 z-[100] lg:hidden";
  const innerStyle = inline
    ? undefined
    : { paddingBottom: "env(safe-area-inset-bottom)" };

  return (
    <div className={outerClass}>
      <div
        className="rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200 shadow-xl px-3 py-2"
        style={innerStyle}
      >
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-slate-700">
            <span className="font-semibold">{count}</span> selected
          </span>

          {/* NEW: Select all / Unselect all */}
          <button
            onClick={toggleAllOnPage}
            className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-xs"
            title={
              allSelectedOnPage
                ? "Unselect all on this page"
                : "Select all on this page"
            }
          >
            {allSelectedOnPage ? "Unselect all" : "Select all"}
          </button>

          <div className="ml-auto flex flex-wrap gap-2">
            <button
              onClick={() => mutateBatch("pause")}
              className="px-3 py-1.5 rounded-xl text-white text-xs bg-gradient-to-br from-amber-500 to-orange-500"
            >
              Pause
            </button>
            <button
              onClick={() => mutateBatch("resume")}
              className="px-3 py-1.5 rounded-xl text-white text-xs bg-gradient-to-br from-emerald-500 to-green-500"
            >
              Resume
            </button>
            <button
              onClick={() => mutateBatch("disable")}
              className="px-3 py-1.5 rounded-xl text-white text-xs bg-slate-600"
            >
              Disable
            </button>
            <button
              onClick={() => mutateBatch("hardDelete")}
              className="px-3 py-1.5 rounded-xl text-white text-xs bg-gradient-to-br from-red-500 to-pink-500"
              title="Permanently delete selected"
            >
              Delete
            </button>

            <MovePicker folders={folders} onPick={onPickMove} />

            <button
              onClick={clearSel}
              className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-xs"
            >
              Clear
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
