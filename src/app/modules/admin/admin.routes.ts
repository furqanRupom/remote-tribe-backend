import express from "express"
import { AdminController } from "./admin.controller";
import { auth } from "../../middleware";
import { admin, superAdmin } from "../utils";
const router = express.Router()
router.patch('/jobs/:id/approve',auth(admin,superAdmin), AdminController.approveJob)
export const AdminRoutes = router;