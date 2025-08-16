import axiosInstance from "../utils/axiosInstance.js";

export const loginUser = async (password, email) => {
    const { data } = await axiosInstance.post("api/auth/login", { email, password });
    if (data) {
        console.log("logged in user", data)
    }
    return data;
}
export const registerUser = async (name, password, email) => {
    const { data } = await axiosInstance.post("api/auth/register", { name, email, password });
    console.log("data 2", data)
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

export const getAllUserUrls = async () => {
    const { data } = await axiosInstance.get("api/user/urls");
    return data;
}