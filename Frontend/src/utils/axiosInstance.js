import axios, { isAxiosError } from "axios";

const axiosInstance = axios.create({
    baseURL: "http://localhost:5000/",
    timeout: 10000, // 10s
});

// Response interceptor for error handling
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        let message = "An unexpected error occurred.";

        if (error.code === "ECONNABORTED") {
            message = "Request timed out. Please try again.";
        }
        else if (error.response) {
            const status = error.response.status;
            const serverMsg = error.response.data?.message;

            switch (status) {
                case 400:
                    message = serverMsg || "Bad request. Please check your input.";
                    break;
                case 401:
                    message = serverMsg || "Unauthorized. Please log in.";
                    break;
                case 403:
                    message = serverMsg || "Forbidden. You don't have permission to access this resource.";
                    break;
                case 404:
                    message = serverMsg || "Not found. The requested resource doesn't exist.";
                    break;
                case 409:
                    message = serverMsg || "Conflict. The request could not be completed due to a conflict.";
                    break;
                case 422:
                    message = serverMsg || "Validation failed. Please check your input.";
                    break;
                case 429:
                    message = serverMsg || "Too many requests. Please slow down.";
                    break;
                case 500:
                    message = serverMsg || "Internal server error. Please try again later.";
                    break;
                case 502:
                    message = serverMsg || "Bad gateway. Please try again.";
                    break;
                case 503:
                    message = serverMsg || "Service unavailable. Please try again later.";
                    break;
                case 504:
                    message = serverMsg || "Gateway timeout. Please try again.";
                    break;
                default:
                    message = serverMsg || `Error ${status}`;
            }
        }
        else if (error.request) {
            message = "No response from server. Check your connection.";
        }
        else {
            message = error.message;
        }

        console.error("API Error:", message);
        return Promise.reject({
            isAxiosError: true,
            message: error.response?.data?.message || error.message,
            status: error.response?.status,
            data: error.response?.data
        });
    }
);


export default axiosInstance;
