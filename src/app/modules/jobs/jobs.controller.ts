import logger from "../../logger/logger";
import ApiError from "../../middleware/apiError";
import BaseController from "../../shared/baseController";
import { JobService } from "./jobs.service";
import httpStatus from "http-status";

class Controller extends BaseController {
   getAllJobs = this.catchAsync(async (req, res, next) => {
     if(!req.user){
        logger.warn('Unauthorized user: please login')
        throw new ApiError(httpStatus.UNAUTHORIZED,'Unauthorized user: please login')
     }
      const result = await JobService.getAllJobs(req.user.id,req.query);
      this.sendResponse(res, {
         statusCode: httpStatus.OK,
         success: true,
         message: 'Jobs fetched successfully',
         meta: result.meta,
         data: result.data,
      });
   });
   createNewJobs = this.catchAsync(async (req, res, next) => {
     if(!req.user) {
        logger.warn('Unauthorized user: please login')
         throw new ApiError(httpStatus.UNAUTHORIZED,'Unauthorized user: please login')
    }
      const result = await JobService.createNewJobs(req.user.id, req.body);
      this.sendResponse(res, {
         statusCode: httpStatus.OK,
         success: true,
         message: 'Job created successfully',
         data: result,
      });
   });
   getJobById = this.catchAsync(async (req, res, next) => {
      const result = await JobService.getJobById(req.params.id);
      this.sendResponse(res, {
         statusCode: httpStatus.OK,
         success: true,
         message: 'Job fetched successfully',
         data: result,
      });
   });
   updateJobById = this.catchAsync(async (req, res, next) => {
      const result = await JobService.updateJobById(req.params.id, req.body);
      this.sendResponse(res, {
         statusCode: httpStatus.OK,
         success: true,
         message: 'Job updated successfully',
         data: result,
      });
   });
   deleteJobById = this.catchAsync(async (req, res, next) => {
      const result = await JobService.deleteJobById(req.params.id);
      this.sendResponse(res, {
         statusCode: httpStatus.OK,
         success: true,
         message: 'Job deleted successfully',
         data: result,
      });
   });
}
export const JobController = new Controller()