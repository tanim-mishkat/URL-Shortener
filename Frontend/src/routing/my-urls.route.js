import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "./routeTree";
import MyUrlsPage from "../pages/MyUrlsPage";
import { checkAuth } from "../utils/helper";

export const myUrlsRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/my-urls',
    component: MyUrlsPage,
    beforeLoad: checkAuth,
})