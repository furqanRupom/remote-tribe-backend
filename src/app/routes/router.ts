import { AuthRoute } from "../modules/auth"
import express from "express"
import { UserRoutes } from "../modules/user"
import { JobsRoutes } from "../modules/jobs"
import { AdminRoutes } from "../modules/admin"
const router = express.Router()
const routes = [
    {
        path: '/auth',
        route: AuthRoute
    },
    {
        path:"/users",
        route:UserRoutes
    },
    {
        path:"/jobs",
        route:JobsRoutes
    },
    {
        path:"/admin",
        route:AdminRoutes
    }
]
routes.forEach((route: { path: string; route: any; }) => {
    router.use(route.path, route.route)
})
export default router