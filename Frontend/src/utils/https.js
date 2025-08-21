import { getPublicBase } from "./publicBase.js";

const API = getPublicBase();

/**
 * Fetch wrapper that:
 * - attaches credentials by default
 * - safely parses JSON (falls back to raw text)
 * - throws rich errors with status + payload
 */
export async function request(path, options = {}) {
    const url = `${API}${path}`;
    const r = await fetch(url, {
        credentials: "include",
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...(options.headers || {}),
        },
    });

    const text = await r.text();
    let data = null;
    let parseErr = null;
    if (text) {
        try {
            data = JSON.parse(text);
        } catch (e) {
            parseErr = e;
        }
    }

    if (!r.ok) {
        const err = new Error(
            (data && (data.message || data.error)) || `HTTP ${r.status}`
        );
        err.status = r.status;
        err.payload = data ?? { raw: text };
        if (parseErr) err.parseError = parseErr.message;
        throw err;
    }

    return data;
}
