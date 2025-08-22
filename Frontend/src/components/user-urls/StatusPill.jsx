
export default function StatusPill({ status }) {
  const s = status || "active";
  const cfg = {
    active: { bg: "from-emerald-500 to-green-500", text: "text-white" },
    paused: { bg: "from-amber-500 to-orange-500", text: "text-white" },
    disabled: { bg: "from-slate-400 to-slate-500", text: "text-white" },
  };
  const label = s[0].toUpperCase() + s.slice(1);
  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold bg-gradient-to-br ${cfg[s].bg} ${cfg[s].text} shadow shadow-slate-300/40`}
    >
      <span className="w-2 h-2 rounded-full bg-white/90" />
      {label}
    </div>
  );
}
