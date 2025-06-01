import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.join(process.cwd(), '.env') })

export const config = {
    port: process.env.PORT,
    db_url: process.env.DATABASE_URL,
    node_env:process.env.NODE_ENV,
    app_port: process.env.APP_PORT,
    app_host: process.env.APP_HOST,
    app_email: process.env.APP_EMAIL,
    app_pass: process.env.APP_PASS,
    access_token_secret: process.env.SECRET_ACCESS_TOKEN,
    refresh_token_secret: process.env.SECRET_REFRESH_TOKEN,
    access_token_exp: process.env.ACCESS_TOKEN_EXPIRY,
    refresh_token_exp: process.env.REFRESH_TOKEN_EXPIRY,
    is_production:process.env.IS_PRODUCTION
}