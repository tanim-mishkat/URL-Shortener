import axiosInstance from "../utils/axiosInstance.js";
import { request } from "../utils/https.js";



export const loginUser = async (password, email) => {
    const { data } = await axiosInstance.post("api/auth/login", { email, password });
    return data;
}
export const registerUser = async (name, password, email) => {
    const { data } = await axiosInstance.post("api/auth/register", { name, email, password });
    return data;
}


export const logoutUser = async () => {
    try {
        const res = await axiosInstance.post("/api/auth/logout", {}, { withCredentials: true });

        if (!res?.data) {
            throw new Error("Logout failed: No response from server.");
        }

        return res.data;
    } catch (err) {
        if (err.response?.data?.message) {
            throw new Error(`Logout failed: ${err.response.data.message}`);
        }
        throw new Error("Something went wrong while logging out. Please try again.");
    }
};

export const getCurrentUser = async () => {
    const { data } = await axiosInstance.get("api/auth/me");
    return data;
}

export async function getAllUserUrls(filters = {}) {
    const usp = new URLSearchParams();
    if (filters.folderId) usp.set("folderId", filters.folderId);
    if (filters.tag) usp.set("tag", String(filters.tag).trim());
    if (filters.q) usp.set("q", String(filters.q).trim());
    return request(`/api/user/urls?${usp.toString()}`);
}