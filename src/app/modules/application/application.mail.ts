import EmailSender from "../../mailer/emailSender"
import { EmailTemplates } from "../../mailer/emailTemplates"

class Mail {
   async sendJobApplicationMail(payload:{name:string,title:string,company:string,email:string}) {
       const emailTemplate = EmailTemplates.applicationConfirmation(payload.name,payload.title,payload.company
       )
       return await EmailSender(payload.email,'Application submitted successfully',emailTemplate)
    }
 
}

export const ApplicationMail = new Mail()