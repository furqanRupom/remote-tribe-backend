import express from "express";
const router = express.Router();

import { AuthController } from "./auth.controller";
import validateRequest from "../../middleware/validateRequest";
import { AuthValidation } from "./auth.validation";
import { auth } from "../../middleware/auth";
import { Role } from "@prisma/client";
import { admin, employer, jobSeeker, superAdmin } from "../utils";
router.post('/register',validateRequest(AuthValidation.userRegistrationValidation), AuthController.userRegistration)
router.post('/verify', AuthController.confirmRegistration)
router.post('/login', AuthController.login)
router.post('/logout',auth(admin, superAdmin, jobSeeker, employer), AuthController.logout)
router.get('/profile', auth(admin, superAdmin, jobSeeker, employer), AuthController.profile)
router.post('/refresh', AuthController.refreshToken)
export const AuthRoute = router