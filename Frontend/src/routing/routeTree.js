import { createRootRoute } from "@tanstack/react-router"
import RootLayout from "../RootLayout.jsx"
import { homepageRoute } from "./homepage.route.js"
import { dashboardRoute } from "./dashboard.route.js"
import { authRoute } from "./auth.route.js"
import { statsRoute } from "./stats.route.js"

export const rootRoute = createRootRoute({
    component: RootLayout
})

export const routeTree = rootRoute.addChildren([
    homepageRoute,
    dashboardRoute,
    authRoute,
    statsRoute
]) 