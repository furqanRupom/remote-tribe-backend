import { NextFunction, Request, Response } from 'express'
import { ZodError } from 'zod'

import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import { Prisma } from '@prisma/client'
import httpStatus from 'http-status'
import { JsonWebTokenError } from 'jsonwebtoken'
import { IErrorSources } from '../interface/Error'
import ApiError from './apiError'
import { ErrorHandler } from '../errors/Error'
import logger from '../logger/logger'

class GlobalErrorHandler {
    handlers(error: any, req: Request, res: Response, next: NextFunction) {
        let statusCode = 500
        let message = 'Internal Server Error'
        let errorSources: IErrorSources[] = [
            { path: '', message: error.message || message },
        ]

        if (error instanceof ApiError) {
            statusCode = error?.statusCode
            message = error.message
            errorSources = [{ path: '', message: error.message }]
        } else if (error instanceof JsonWebTokenError) {
            statusCode = httpStatus.FORBIDDEN
            message = error.message
            errorSources = [{ path: '', message: error.message }]
        } else if (error instanceof ZodError) {
            const simplifiedError = ErrorHandler.handleZodError(error)
            statusCode = simplifiedError.statusCode
            message = simplifiedError.message
            errorSources = simplifiedError.errorSources
        } else if (error.code === 'P2025') {
            statusCode = httpStatus.NOT_FOUND
            message = error.message
            errorSources = [{ path: '', message: error.message }]
        } else if (error instanceof PrismaClientKnownRequestError) {
            if (error.code === 'P2002') {
                const simplifiedError = ErrorHandler.handleDuplicateError(error)
                statusCode = simplifiedError.statusCode
                message = simplifiedError.message
                errorSources = simplifiedError.errorSources
            } else if (error.code === 'P2003') {
                const simplifiedError = ErrorHandler.handleCastError(error)
                statusCode = simplifiedError.statusCode
                message = simplifiedError.message
                errorSources = simplifiedError.errorSources
            } else if (error.code === 'P2025') {
                const simplifiedError = ErrorHandler?.handleNotFoundError(error)
                statusCode = simplifiedError.statusCode
                message = simplifiedError.message
                errorSources = simplifiedError.errorSources
            }
        } else if (error instanceof Prisma.PrismaClientValidationError) {
            const simplifiedError = ErrorHandler.handleValidationError(error)
            statusCode = simplifiedError.statusCode
            message = simplifiedError.message
            errorSources = simplifiedError.errorSources
        }
        if (statusCode === 500) {
            return res.status(statusCode).json({
                success: false,
                message: error.message
            })
        }
        return res.status(statusCode).json({
            success: false,
            message: message,
            errorSources: errorSources || {
                path: '',
                message: message,
            },
        })

    }
}

const globalErrorHandlers = new GlobalErrorHandler()
export const globalErrorHandler = (
    error: any,
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    logger.error({
        message: error.message,
        stack: error.stack,
        path: req.path,
        method: req.method,
        ip: req.ip,
      });
    globalErrorHandlers.handlers(error, req, res, next)
}
