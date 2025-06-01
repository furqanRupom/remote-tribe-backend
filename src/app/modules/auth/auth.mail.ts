import EmailSender from "../../mailer/emailSender"
import { EmailTemplates } from "../../mailer/emailTemplates"

class Mail {
   async sendUserVerificationMail(payload:{name:string,email:string,token:string}) {
       const emailTemplate = EmailTemplates.registrationEmail(payload.name,payload.token)
       return await EmailSender(payload.email,'Verify your email',emailTemplate)
    }
  async sendConfirmationMail(payload:{name:string,email:string}) {
       const emailTemplate = EmailTemplates.confirmationEmail(payload.name)
       return await EmailSender(payload.email,'Email Verification Success',emailTemplate)
    }
}

export const AuthMail = new Mail()