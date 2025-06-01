import prisma from "../../../prisma";
import QueryBuilder from "../../builder/querybuilder";
import logger from "../../logger/logger";
import ApiError from "../../middleware/apiError";
import { jobsSearchableFields } from "../jobs";
import httpStatus from "http-status";

class Service{
   
   async approveJob(id:string){
      logger.info(`Approving job with id ${id} attempt.`)
      const job = await prisma.job.findUnique({where:{id,isDeleted:false}})
      if(!job){
         logger.warn(`Job with id ${id} not found.`)
         throw new ApiError(httpStatus.NOT_FOUND,'Job not found')
      }
      const updatedJob = await prisma.job.update({where:{id},data:{isApproved:true}})
      logger.info(`Job with id ${id} approved successfully.`)
      return updatedJob
   }
}
export const AdminService = new Service()