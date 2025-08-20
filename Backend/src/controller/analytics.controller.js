import { getTimeseriesForLink, getBreakdownForLink } from "../services/analytics.service.js";

export const timeseriesController = async (req, res, next) => {
    try {
        const { linkId } = req.params;
        const payload = await getTimeseriesForLink(req.user._id, linkId, req.query);
        res.json(payload);
    } catch (e) {
        next(e);
    }
};

export const breakdownController = async (req, res, next) => {
    try {
        const { linkId } = req.params;
        const payload = await getBreakdownForLink(req.user._id, linkId, req.query);
        res.json(payload);
    } catch (e) {
        next(e);
    }
};
