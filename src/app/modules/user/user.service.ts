import { User } from "@prisma/client";
import prisma from "../../../prisma"
import QueryBuilder from "../../builder/querybuilder"
import logger from "../../logger/logger"
import ApiError from "../../middleware/apiError";
import httpStatus from "http-status"
import { buildSelectObject } from "../utils";
import { userSelectableFields } from "./user.utils";
import { JsonArray, JsonObject } from "@prisma/client/runtime/library";

class Service {
   async allUsers(query:Record<string,unknown>){
      logger.info('Fetching all users attempt.');
       const queryBuilder = new QueryBuilder(prisma.user,query)
       .search(['name','email','phone'])
       .filter()
       .sort()
       .paginate()
       .select(buildSelectObject(userSelectableFields))
       return {
           data: await queryBuilder.execute(),
           meta: await queryBuilder.countTotal()
       }
   }
   async singleUser(id:string){
      logger.info(`Fetching user with id ${id} attempt.`)
      const user = await prisma.user.findUnique({where:{id}})
      if(!user) {
         logger.warn(`User with id ${id} not found.`)
         throw new ApiError(httpStatus.NOT_FOUND,'User not found')
      }
      logger.info(`User with id ${id} found.`)
      return user
   }
   async updateUser(id:string,payload:Partial<User>):Promise<Partial<User>>{
    logger.info(`Updating user with id ${id} attempt.`)
    const isExit = await prisma.user.findUnique({where:{id,isVerified:true,isDeleted: false}})
    if(!isExit) {
        logger.warn(`User with id ${id} not found.`)
        throw new ApiError(httpStatus.NOT_FOUND,'User not found')
    }
    try {
        const user = await prisma.user.update({ where: { id }, data: {...payload,links:payload.links ?? {}} })
        logger.info(`User with id ${id} updated successfully.`)
      const {password, ...rest} = user
      return rest
    } catch (error:any) {
        logger.error(`Failed to update user with id ${id}: ${error.message}`)
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR,'User update failed')
    }
   }
   async deleteUser(id:string){
    logger.info(`Deleting user with id ${id} attempt.`)
    const isDeleted = await prisma.user.findUnique({where:{id,isDeleted: true}})
    if(isDeleted){
        logger.warn(`User with id ${id} already deleted.`)
        throw new ApiError(httpStatus.BAD_REQUEST,"User already deleted.")
    }
    try {
        await prisma.user.update({ where: { id }, data: { isDeleted: true } });
        logger.info(`User with id ${id} deleted successfully.`)
        return null
    } catch (error:any) {
        logger.error(`Failed to delete user with id ${id}: ${error.message}`)
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR,'User delete failed')
    }


   }
}
export const UserService = new Service()