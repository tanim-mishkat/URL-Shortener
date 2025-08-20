import axiosInstance from "../utils/axiosInstance";

export const createShortUrl = async (url, slug) => {
    const { data } = await axiosInstance.post("api/create", { url, slug });
    return data.shortUrl;
};

export const updateLinkStatus = async (id, status) => {
    const { data } = await axiosInstance.patch(`api/links/${id}/status`, { status });
    return data;
};

export const softDeleteLink = async (id) => {
    const { data } = await axiosInstance.delete(`api/links/${id}`);
    return data;
};

export const hardDeleteLink = async (id) => {
    const { data } = await axiosInstance.delete(`api/links/${id}/permanent`);
    return data;
};
