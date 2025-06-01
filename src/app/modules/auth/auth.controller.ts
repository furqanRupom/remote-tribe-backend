import BaseController from "../../shared/baseController"
import httpStatus from "http-status"
import { AuthService } from "./auth.service"

class Controller extends BaseController {
    userRegistration = this.catchAsync(async (req, res, next) => {
        const result = await AuthService.userRegistration(req.body)
        this.sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'User registration successfully',
            data: result
        })
    })
    confirmRegistration = this.catchAsync(async (req, res, next) => {
        const result = await AuthService.confirmRegistration(req.body.code)
        this.sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'User verification successfully',
            data: result
        })
    })
    login = this.catchAsync(async (req, res, next) => {
        const result = await AuthService.login(req.body)
        const {accessToken,refreshToken} = result;
        res.cookie('accessToken', accessToken, { httpOnly: true, maxAge: 1000 * 60 * 15 });
        res.cookie('refreshToken', refreshToken, { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 7 });
        this.sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'User login successfully',
            data: result
        })
    })
    logout = this.catchAsync(async (req, res, next) => {
        if(!req.user) throw new Error('Token expired!')
         res.clearCookie('accessToken')
         res.clearCookie('refreshToken')
        this.sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'User logout successfully',
        })
    })
    profile = this.catchAsync(async (req, res, next) => {
       if(!req.user) throw new Error('Token expired!')
       const result = await AuthService.profile(req.user.id)
        this.sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'User profile successfully',
            data: result
        })
    })
    refreshToken = this.catchAsync(async(req, res, next) => {
        const result = await AuthService.refreshToken(req.cookies.refreshToken)
        const {accessToken,refreshToken} = result;
        res.cookie('accessToken', accessToken, { httpOnly: true, maxAge: 1000 * 60 * 15 });
        res.cookie('refreshToken', refreshToken, { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 7 });
        this.sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'User refresh token successfully',
            data: result
        })
    })
}

export const AuthController = new Controller()