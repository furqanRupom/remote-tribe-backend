import { ZodError } from "zod";

import { config } from "../config";
import { Prisma } from "@prisma/client";
import { IErrorSources } from "../interface/Error";


class ErrorHandlers {
    handleZodError(error: ZodError) {
        let zodMessage: string = '';
        const errorSources: IErrorSources[] = error.issues.map(issue => {
            zodMessage += `${issue.message}.`;
            return {
                path: issue?.path[issue.path.length - 1],
                message: issue?.message,
            }
        });
        const statusCode = 400;
        return {
            statusCode,
            success: false,
            message: zodMessage.trim(),
            errorSources,
            stack: config.node_env === 'development' ? error?.stack : null,
        };
    }
    handleValidationError(error: Prisma.PrismaClientValidationError) {
        const errorSources: IErrorSources[] = [
            {
                path: '',
                message: error.message,
            },
        ];
        const statusCode = 400;
        return {
            statusCode,
            success: false,
            message: error.message,
            errorSources,
        };
    }
    handleDuplicateError(error: Prisma.PrismaClientKnownRequestError) {
        const errorSources: IErrorSources[] = Array.isArray(error?.meta?.target) ?
            error.meta.target.map((field: string) => ({
                path: field,
                message: `Already exists.`,
            })) :
            [];
        const statusCode = 409;
        return {
            statusCode,
            success: false,
            message: 'Already exits',
            errorSources,
        };
    }
    handleCastError(error: Prisma.PrismaClientKnownRequestError) {
        const errorSources: IErrorSources[] = [
            {
                path: '',
                message: 'Invalid data type provided.',
            },
        ];
        const statusCode = 400;
        return {
            statusCode,
            success: false,
            message: 'Cast Error',
            errorSources,
        };
    }

    handleNotFoundError(error: Prisma.PrismaClientKnownRequestError) {
        const errorSources: IErrorSources[] = [
            {
                path: '',
                message: 'No record found.',
            },
        ];
        const statusCode = 404;
        return {
            statusCode,
            success: false,
            message: 'No record found',
            errorSources,
        };
    }
}
export const ErrorHandler = new ErrorHandlers();
