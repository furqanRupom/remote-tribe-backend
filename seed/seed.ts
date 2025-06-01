import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
import bcrypt from "bcrypt"
async function seedSuperAdmin(){
    let hashedPassword = await bcrypt.hash('12345678',10)
    const isExit = await prisma.user.findUnique({where:{email:'9x9YH@example.com'}})
    if(isExit) throw new Error('Super admin already exist')
    await prisma.user.create({data:{email:'9x9YH@example.com',password:hashedPassword,name:'superadmin',role:'SUPER_ADMIN',isVerified:true}})
}

seedSuperAdmin()