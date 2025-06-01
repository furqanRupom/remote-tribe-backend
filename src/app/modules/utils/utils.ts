import { Role } from "@prisma/client"
import prisma from "../../../prisma"

export function buildSelectObject(fields: string[]): Record<string, true> {
    return fields.reduce((acc, field) => {
        acc[field] = true
        return acc
    }, {} as Record<string, true>)
}



export const RoleMap = {
    superAdmin: Role.SUPER_ADMIN,
    admin: Role.ADMIN,
    employer: Role.EMPLOYER,
    jobSeeker: Role.JOB_SEEKER,
} as const

export type FriendlyRole = keyof typeof RoleMap
export const { superAdmin, admin, employer, jobSeeker } = RoleMap


export async function getUser(id:string){
    return await prisma.user.findUnique({where:{id,isDeleted:false,isVerified:true}})
}

export async function getJob(id:string){
    return await prisma.job.findUnique({where:{id,isDeleted:false,isApproved:true}})
}
export async function getApplication(id:string){
    return await prisma.application.findUnique({where:{id}})
}
export async function checkRoleUser(id:string,role:Role[]){
    return await prisma.user.findUnique({where:{id,role:{in:role}}})
}