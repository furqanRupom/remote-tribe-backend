import { config } from "../../config";
import { generateToken } from "../../helpers/generateToken";

interface TokenPayload {
    id: string;
    role: string;
}



export function generateAuthTokens(
    payload: TokenPayload,
  
) {
    const accessToken = generateToken({
        id: payload.id,
        role: payload.role,
        token: config.access_token_secret,
        expDate: config.access_token_exp,
    });

    const refreshToken = generateToken({
        id: payload.id,
        role: payload.role,
        token: config.refresh_token_secret,
        expDate: config.refresh_token_exp,
    });

    return { accessToken, refreshToken };
}
