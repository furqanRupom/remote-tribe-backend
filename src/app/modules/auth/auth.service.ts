import prisma from "../../../prisma"
import { config } from "../../config"
import {  verifyToken } from "../../helpers/generateToken"
import { deleteCache, getCache, setCache } from "../../redis"
import { generateSixDigitCode } from "../../shared"
import { AuthMail } from "./auth.mail"
import bcrypt from "bcrypt"
import httpStatus from "http-status"
import { generateAuthTokens } from "./auth.utils"
import { Secret } from "jsonwebtoken"
import ApiError from "../../middleware/apiError"
import logger from "../../logger/logger"

class Service {
    async userRegistration(payload: { name: string, email: string, password: string }) {
        logger.info(`Registration attempt for email - ${payload.email}`)
        const user = await prisma.user.findUnique({ where: { email: payload.email } })
        if(user){
            logger.warn(`Registration failed - User already exits : ${user.email}`)
            throw new ApiError(httpStatus.CONFLICT, 'User already exists')
        }
        
        const code = generateSixDigitCode()
        logger.debug(`Generated verification code for ${payload.email}: ${code}`);
        try {
            setCache(code, payload, 60 * 10)
            logger.debug(`Verification code cached for ${payload.email}`);
            await AuthMail.sendUserVerificationMail({ ...payload, token: code })
            logger.info(`Verification email sent to ${payload.email}`);
        } catch (error:any) {
            logger.error(`Failed to process registration for ${payload.email}: ${error.message}`);
            throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Registration processing failed');
        }

    }
    async confirmRegistration(code: string) {
        logger.info(`Registration confirmation attempt with code: ${code}`);
        const user = await getCache(code)
        if (!user) {
            logger.warn(`Invalid verification code attempt: ${code}`);
            throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid verification code')
        }
        try {
            user.password = await bcrypt.hash(user.password, 10);
            await prisma.user.create({ data: { ...user, isVerified: true } });
            logger.info(`User created successfully: ${user.email}`);
            await AuthMail.sendConfirmationMail({ name: user.name, email: user.email });
            await deleteCache(code)
            logger.debug(`Confirmation email sent to ${user.email}`);
        } catch (error:any) {
            logger.error(`Failed to confirm registration for ${user.email}: ${error.message}`);
            throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Registration confirmation failed');
        }

    }
    async login(payload: { email: string, password: string }) {
        logger.info(`Login attempt for email: ${payload.email}`);
       const user = await prisma.user.findUnique({ where: { email: payload.email,isVerified: true } })
       if(!user) {
        logger.warn(`Login failed - User not found or not verified: ${payload.email}`);
        throw new ApiError(httpStatus.NOT_FOUND,'User not found')
       }
        const isPasswordMatch = await bcrypt.compare(payload.password, user.password)
        if(!isPasswordMatch) {
            logger.warn(`Login failed - Invalid password for user: ${user.email}`)
            throw new ApiError(httpStatus.UNAUTHORIZED,'Invalid password')
        }
        try {
            const { accessToken, refreshToken } = generateAuthTokens({
                id: user.id,
                role: user.role
            });

            logger.info(`Successful login for user: ${user.email}`);
            logger.debug(`Generated tokens for user ${user.id}`);

            return { accessToken, refreshToken };
        } catch (error:any) {
            logger.error(`Token generation failed for ${user.email}: ${error.message}`);
            throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Login processing failed');
        }
    }
    async profile(id:string) {
        logger.info(`Profile attempt for id: ${id}`);
        const user = await prisma.user.findUnique({ where: { id,isVerified: true,isDeleted: false } })
        if(!user) {
            logger.warn(`Profile failed - User not found : ${id}`);
            throw new ApiError(httpStatus.NOT_FOUND,'User not found')
        }
        const {password,...rest} = user
        return rest
    }
    async refreshToken(refreshToken:string) {
        logger.info(`Refresh token attempt.`);
        const userInfo = verifyToken(refreshToken, config.refresh_token_secret as Secret)
        if(!userInfo) {
            logger.warn("Invalid refresh token attempt.")
            throw new ApiError(httpStatus.UNAUTHORIZED,'Invalid refresh token')
        }
        try {
            const user = await prisma.user.findUniqueOrThrow({
                where: { id: userInfo.id }
            });
            logger.debug(`Found user for refresh token: ${user.email}`);

            const { accessToken, refreshToken: refreshToken1 } = generateAuthTokens({
                id: user.id,
                role: user.role
            });

            logger.info(`Tokens refreshed successfully for user: ${user.email}`);
            return { accessToken, refreshToken: refreshToken1 };
        } catch (error:any) {
            logger.error(`Token refresh failed for user ID ${userInfo.id}: ${error.message}`);
            throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Token refresh failed');
        }
    }
   

}

export const AuthService = new Service()