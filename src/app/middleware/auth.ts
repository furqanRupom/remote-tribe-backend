import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import ApiError from "./apiError";
import { verifyToken } from "../helpers/generateToken";
import { config } from "../config";
import { Secret } from "jsonwebtoken";
import { Role } from "@prisma/client";

export const auth = (...roles: Role[]) => {
    return async (req: Request & { user?: any }, res: Response, next: NextFunction) => {
        try {
            const token = req.headers.authorization?.split(' ')[1];
            if (!token) {
                throw new ApiError(httpStatus.UNAUTHORIZED, 'Token is missing');
            }

            const currentUser = verifyToken(token, config.access_token_secret as Secret);
            if (!currentUser) {
                throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid token');
            }

            // Check role if roles are passed
            if (roles.length && !roles.includes(currentUser.role)) {
                throw new ApiError(httpStatus.FORBIDDEN, 'You do not have permission');
            }

            req.user = currentUser;
            next();
        } catch (error) {
            next(error);
        }
    }
}
