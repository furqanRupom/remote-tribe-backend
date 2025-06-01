import express from "express"
import { UserController } from "./user.controller";
import { auth } from "../../middleware";
import { Role } from "@prisma/client";
import validateRequest from "../../middleware/validateRequest";
import { UserValidation } from "./user.validation";
import { admin, employer, jobSeeker, superAdmin } from "../utils";
import { ApplicationController } from "../application";
const router = express.Router()
router.get('/',UserController.allUsers)
router.get('/:id',auth(admin,superAdmin),UserController.singleUser)
router.put('/:id',validateRequest(UserValidation.userUpdateValidation),auth(admin,superAdmin,employer,jobSeeker),UserController.updateUser)
router.delete('/:id',auth(admin,superAdmin),UserController.deleteUser)
router.get('/me/applications',auth(jobSeeker),ApplicationController.myApplications)

export const UserRoutes = router;