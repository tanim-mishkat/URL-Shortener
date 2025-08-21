import axiosInstance from "../utils/axiosInstance";

export const fetchTimeseries = async (linkId, params = {}) => {
    const { data } = await axiosInstance.get(`/api/analytics/${linkId}/timeseries`, { params });
    return data; // { series: [{day,total}], range:{start,end} }
};

export const fetchBreakdown = async (linkId, params = {}) => {
    const { data } = await axiosInstance.get(`/api/analytics/${linkId}/breakdown`, { params });
    return data; // { dimension, rows: [{label,count}], range:{start,end} }
};
