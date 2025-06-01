import logger from "../../logger/logger";
import ApiError from "../../middleware/apiError";
import BaseController from "../../shared/baseController";
import { ApplicationService } from "./application.service";
import httpStatus from "http-status";

class Controller extends BaseController {
   jobApply = this.catchAsync(async (req, res, next) => {
      if (!req.user) {
         logger.warn("Unauthorized user: please login");
         throw new ApiError(httpStatus.UNAUTHORIZED, "Unauthorized user: please login");
      }
      const result = await ApplicationService.jobApply(req.user.id, req.params.id, req.body);
      this.sendResponse(res, {
         statusCode: httpStatus.OK,
         success: true,
         message: 'Job applied successfully',
         data: result,
      });
   });
   myApplications = this.catchAsync(async (req, res, next) => {
      if (!req.user) {
         logger.warn("Unauthorized user: please login");
         throw new ApiError(httpStatus.UNAUTHORIZED, "Unauthorized user: please login");
      }
      const result = await ApplicationService.myApplications(req.user.id);
      this.sendResponse(res, {
         statusCode: httpStatus.OK,
         success: true,
         message: 'Applications fetched successfully',
         data: result,
      });
   });
   applicationByJobId = this.catchAsync(async (req, res, next) => {
      const result = await ApplicationService.applicationByJobId(req.params.id,req.query);
      this.sendResponse(res, {
         statusCode: httpStatus.OK,
         success: true,
         message: 'Application fetched successfully',
         data: result,
      });
   });
   applicationById = this.catchAsync(async (req, res, next) => {
      const result = await ApplicationService.applicationById(req.params.id);
      this.sendResponse(res, {
         statusCode: httpStatus.OK,
         success: true,
         message: 'Application fetched successfully',
         data: result,
      });
   });   
}
export const ApplicationController = new Controller()