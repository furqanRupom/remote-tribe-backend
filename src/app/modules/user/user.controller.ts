import BaseController from "../../shared/baseController";
import { UserService } from "./user.service";
import httpStatus from "http-status"

class Controller extends BaseController {
  allUsers = this.catchAsync(async (req, res, next) => {
    const result = await UserService.allUsers(req.query)
    this.sendResponse(res,{
        statusCode: httpStatus.OK,
        success:true,
        message:'Users fetched successfully',
        meta:result.meta,
        data:result.data,
    })
  });
  singleUser = this.catchAsync(async (req, res, next) => {
    const result = await UserService.singleUser(req.params.id)
    this.sendResponse(res,{
        statusCode: httpStatus.OK,
        success:true,
        message:'User fetched successfully',
        data:result,
    })
  })
  updateUser = this.catchAsync(async (req, res, next) => {
    const result = await UserService.updateUser(req.params.id,req.body)
    this.sendResponse(res,{
        statusCode: httpStatus.OK,
        success:true,
        message:'User updated successfully',
        data:result,
    })
  })
  deleteUser = this.catchAsync(async (req, res, next) => {
    const result = await UserService.deleteUser(req.params.id)
    this.sendResponse(res,{
        statusCode: httpStatus.OK,
        success:true,
        message:'User deleted successfully',
        data:result,
    })
  })
}
export const UserController = new Controller()