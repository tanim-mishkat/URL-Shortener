export const getPublicBase = () =>
    import.meta.env.VITE_PUBLIC_BASE || "http://localhost:5000";
