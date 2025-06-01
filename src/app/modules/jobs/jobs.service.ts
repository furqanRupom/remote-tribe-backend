import { Job } from "@prisma/client"
import prisma from "../../../prisma"
import QueryBuilder from "../../builder/querybuilder"
import logger from "../../logger/logger"
import ApiError from "../../middleware/apiError"
import httpStatus from "http-status"
import { admin, checkRoleUser, employer, jobSeeker, superAdmin } from "../utils"
import { jobsSearchableFields } from "./jobs.utils"

class Service {
    async getAllJobs(postedById: string, query: Record<string, unknown>) {
        let filterObj: Record<string, unknown> = {}
        const isEmployer = await checkRoleUser(postedById, [employer])
        const isJobSeeker = await checkRoleUser(postedById, [jobSeeker])
        if(isEmployer){
            filterObj.postedById = postedById

        }
        if(isJobSeeker){
            filterObj.isApproved = true
            filterObj.isDeleted = false
        }
        const result = new QueryBuilder(prisma.job, query)
            .search(jobsSearchableFields)
            .filter(filterObj, ['tags'])
            .sort()
            .paginate()
        
        if(isJobSeeker){
            result.include({ postedBy: { select: { name: true, email: true } } })
        }
        if(isEmployer){
            result.include({applications:true})
        }
        return {
            data: await result.execute(),
            meta: await result.countTotal()
        }
    }
    async createNewJobs(postedById: string, payload: Job) {
        logger.info(`Creating new job for user ${postedById} attempt.`)
        try {
            logger.info(`Job created successfully for user ${postedById}`)
            const job = await prisma.job.create({ data: { ...payload, postedById } })
            return job
        } catch (error: any) {
            logger.error(`Failed to create job for user ${postedById}: ${error.message}`)
            throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Job creation failed')
        }

    }
    async getJobById(id: string) {
        logger.info(`Fetching job with id ${id} attempt.`)
        const job = await prisma.job.findUnique({ where: { id } })
        if (!job) {
            logger.warn(`Job with id ${id} not found.`)
            throw new ApiError(httpStatus.NOT_FOUND, 'Job not found')
        }
        logger.info(`Job with id ${id} found.`)
        return job
    }
    async updateJobById(id: string, payload: Partial<Job>) {
        logger.info(`Updating job with id ${id} attempt.`)
        const isExit = await prisma.job.findUnique({ where: { id } })
        if (!isExit) {
            logger.warn(`Job with id ${id} not found.`)
            throw new ApiError(httpStatus.NOT_FOUND, 'Job not found')
        }
        try {
            const job = await prisma.job.update({ where: { id }, data: payload })
            logger.info(`Job with id ${id} updated successfully.`)
            return job
        } catch (error: any) {
            logger.error(`Failed to update job with id ${id}: ${error.message}`)
            throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Job update failed')
        }

    }
    async deleteJobById(id: string) {
        logger.info(`Deleting job with id ${id} attempt.`)
        const isDeleted = await prisma.job.findUnique({ where: { id, isDeleted: true } })
        if (isDeleted) {
            logger.warn(`Job with id ${id} already deleted.`)
            throw new ApiError(httpStatus.BAD_REQUEST, "Job already deleted.")
        }
        try {
            await prisma.job.update({ where: { id }, data: { isDeleted: true } });
            logger.info(`Job with id ${id} deleted successfully.`)
            return null
        } catch (error: any) {
            logger.error(`Failed to delete job with id ${id}: ${error.message}`)
            throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Job delete failed')
        }
    }
}
export const JobService = new Service()