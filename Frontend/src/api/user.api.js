import axiosInstance from "../utils/axiosInstance";

export const loginUser = async (password, email) => {
    const { data } = await axiosInstance.post("api/auth/login", { email, password });
    console.log("data 1", data)
    return data;
}
export const registerUser = async (name, password, email) => {
    const { data } = await axiosInstance.post("api/auth/register", { name, email, password });
    console.log("data 2", data)
    return data;
}


export const logoutUser = async () => {
    const { data } = await axiosInstance.get("api/auth/logout");
    return data;
}