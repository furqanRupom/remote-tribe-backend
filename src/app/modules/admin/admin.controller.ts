import BaseController from "../../shared/baseController";
import { AdminService } from "./admin.service";
import httpStatus from "http-status";

class Controller extends BaseController {
  approveJob = this.catchAsync(async (req, res, next) => {
    const result = await AdminService.approveJob(req.params.id);
    this.sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Job approved successfully',
      data: result,
    });
  })
}
export const AdminController = new Controller()