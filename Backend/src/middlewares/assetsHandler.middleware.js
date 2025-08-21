const assetNames = new Set(["favicon.ico", "robots.txt", "sitemap.xml"]);

export const assetsHandler = (req, res, next) => {
    if (assetNames.has(req.params.id)) {
        return next("route");
    }
    next();
};
