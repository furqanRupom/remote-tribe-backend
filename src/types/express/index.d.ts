import { string } from "zod";

interface IUser{
    id:string
    role:string
}

declare global {
    namespace Express {
        interface Request {
            user?: IUser; 
        }
    }
}
