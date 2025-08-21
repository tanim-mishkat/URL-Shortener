import { getTimeseriesForLink, getBreakdownForLink } from "../services/analytics.service.js";

export const timeseriesController = async (req, res) => {
    const { linkId } = req.params;
    const payload = await getTimeseriesForLink(req.user._id, linkId, req.query);
    return res.json(payload);
};

export const breakdownController = async (req, res) => {
    const { linkId } = req.params;
    const payload = await getBreakdownForLink(req.user._id, linkId, req.query);
    return res.json(payload);
};
