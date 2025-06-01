import nodemailer from 'nodemailer'
import { config } from '../config'
import logger from '../logger/logger'

const EmailSender = async (
    email: string | undefined,
    subject: string,
    htmlContent: string,
) => {
    logger.info(`Sending email attempt to - ${email}`);
    try {
       
        const transporter = nodemailer.createTransport({
            host: config.app_host,
            port: Number(config.app_port),
            secure: true,
            auth: {
                user: config.app_email,
                pass: config.app_pass,
            },
        })
        await transporter.verify()
        const mailOptions = {
            from: `"RemoteTribe" <${config.app_email}>`,
            to: email,
            subject: subject,
            html: htmlContent,
        }
        const info = await transporter.sendMail(mailOptions)
        if(info) logger.info(`Email sent to - ${email}`);
    } catch (error) {
        logger.error(`Error sending email to - ${email}`);
    }
}
export default EmailSender