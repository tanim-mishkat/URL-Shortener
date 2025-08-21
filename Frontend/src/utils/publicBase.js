export const getPublicBase = function getPublicBase() {
    const env = (import.meta?.env?.VITE_API_BASE || "").trim();
    if (env) return env.replace(/\/$/, "");

    if (typeof window !== "undefined" && window.location.port === "5173") {
        return "http://localhost:5000";
    }
    return "";
}