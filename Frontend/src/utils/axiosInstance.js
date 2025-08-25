import axios, { isAxiosError } from "axios";

const axiosInstance = axios.create({
    baseURL: "VITE_API_BASE/",
    timeout: 10000, // 10s
    withCredentials: true
});

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        let friendlyMessage = "An unexpected error occurred.";

        if (error.code === "ECONNABORTED") {
            friendlyMessage = "Request timed out. Please try again.";
        } else if (error.response) {
            const status = error.response.status;
            const serverMsg = error.response.data?.message;
            switch (status) {
                case 400: friendlyMessage = serverMsg || "Bad request. Please check your input."; break;
                case 401: friendlyMessage = serverMsg || "Unauthorized. Please log in."; break;
                case 403: friendlyMessage = serverMsg || "Forbidden. You don't have permission to access this resource."; break;
                case 404: friendlyMessage = serverMsg || "Not found. The requested resource doesn't exist."; break;
                case 409: friendlyMessage = serverMsg || "This email is already registered. Try signing in instead."; break;
                case 422: friendlyMessage = serverMsg || "Validation failed. Please check your input."; break;
                case 429: friendlyMessage = serverMsg || "Too many requests. Please slow down."; break;
                case 500: friendlyMessage = serverMsg || "Internal server error. Please try again later."; break;
                case 502: friendlyMessage = serverMsg || "Bad gateway. Please try again."; break;
                case 503: friendlyMessage = serverMsg || "Service unavailable. Please try again later."; break;
                case 504: friendlyMessage = serverMsg || "Gateway timeout. Please try again."; break;
                default: friendlyMessage = serverMsg || `Error ${status}`;
            }
        } else if (error.request) {
            friendlyMessage = "No response from server. Check your connection.";
        } else {
            friendlyMessage = error.message;
        }

        console.error("API Error:", friendlyMessage);

        return Promise.reject({
            isAxiosError: true,
            status: error.response?.status,
            message: error.response?.data?.message || error.message,
            data: error.response?.data,
            friendlyMessage,
        });
    }
);

export default axiosInstance;
