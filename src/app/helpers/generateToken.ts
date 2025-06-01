
import jwt, { JwtPayload, Secret } from "jsonwebtoken"
export const generateToken = (payload: JwtPayload) => {

    const accessToken = jwt.sign({ id: payload.id, role: payload.role }, payload.token as string, {
        algorithm: 'HS256',
        expiresIn: payload.expDate
    });

    return accessToken;
}


export const verifyToken = (token: string, secret: Secret) => {
    return jwt.verify(token, secret) as JwtPayload;
}