import axiosInstance from "../utils/axiosInstance";

export const fetchTimeseries = async (linkId, params = {}) => {
    const { data } = await axiosInstance.get(`/api/analytics/${linkId}/timeseries`, { params });
    return data;
};

export const fetchBreakdown = async (linkId, params = {}) => {
    const { data } = await axiosInstance.get(`/api/analytics/${linkId}/breakdown`, { params });
    return data;
};
