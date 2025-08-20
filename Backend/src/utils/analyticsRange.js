// UTC truncate to day
export const toDayUTC = (d) => new Date(Date.UTC(
    d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()
));

export const parseRangeFromQuery = (query) => {
    const { from, to } = query || {};
    const end = to ? new Date(to) : new Date();
    const start = from ? new Date(from) : new Date(end.getTime() - 29 * 86400000); // 30d default
    return { start: toDayUTC(start), end: toDayUTC(end) };
};

export const validateDimension = (dim = "country") => {
    const ok = ["country", "referrer", "device"];
    if (!ok.includes(dim)) throw new Error("Invalid dimension");
    return dim;
};
