import express from "express"
import { JobController } from "./jobs.controller";
import validateRequest from "../../middleware/validateRequest";
import { JobValidation } from "./jobs.validation";
import { auth } from "../../middleware";
import { admin, employer, jobSeeker, superAdmin } from "../utils";
import { ApplicationController, ApplicationValidation } from "../application";
const router = express.Router()
router.get('/', auth(admin, superAdmin, jobSeeker, employer), JobController.getAllJobs)
router.post('/',auth(employer), validateRequest(JobValidation.jobCreateValidation), JobController.createNewJobs)
router.get('/:id',auth(admin, superAdmin, jobSeeker, employer), JobController.getJobById)
router.put('/:id',auth(employer),validateRequest(JobValidation.jobUpdateValidation), JobController.updateJobById)
router.delete('/:id',auth(admin, superAdmin,employer), JobController.deleteJobById)
router.post('/:id/apply',auth(jobSeeker),validateRequest(ApplicationValidation.applicationCreateValidation), ApplicationController.jobApply)
router.get('/:id/applications', auth(admin, superAdmin, employer), ApplicationController.applicationByJobId)
router.get('/application/:id', auth(admin, superAdmin, employer), ApplicationController.applicationById)
export const JobsRoutes = router;