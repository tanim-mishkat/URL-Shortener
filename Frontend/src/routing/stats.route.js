import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "./routeTree";
import StatsPage from "../pages/StatsPage";
import { checkAuth } from "../utils/helper";

export const statsRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/stats/$linkId",
    component: StatsPage,
    beforeLoad: checkAuth,
});
