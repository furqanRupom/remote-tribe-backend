class Templates {
  private mailHeader() {
    return `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>RemoteTribe - Remote Jobs Platform</title>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
      
      body {
        font-family: 'Inter', Arial, sans-serif;
        background-color: #f8fafc;
        margin: 0;
        padding: 0;
        color: #334155;
        line-height: 1.6;
      }
      .container {
        max-width: 600px;
        margin: 0 auto;
        background: white;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.05);
        overflow: hidden;
      }
      .header {
        background-color: #3b82f6;
        padding: 24px;
        text-align: center;
      }
      .logo {
        color: white;
        font-size: 28px;
        font-weight: 700;
        letter-spacing: -0.5px;
        text-decoration: none;
      }
      .content {
        padding: 32px;
      }
      .footer {
        text-align: center;
        font-size: 14px;
        color: #64748b;
        padding: 24px;
        background-color: #f1f5f9;
      }
      .button {
        display: inline-block;
        background-color: #1e293b;
        color: white !important;
        text-decoration: none;
        padding: 12px 24px;
        border-radius: 6px;
        font-weight: 500;
        margin: 16px 0;
      }
      .button:hover {
        background-color: #0f172a;
      }
      .code-box {
        background: #f8fafc;
        padding: 16px;
        font-size: 24px;
        font-weight: bold;
        letter-spacing: 4px;
        text-align: center;
        border-radius: 6px;
        margin: 24px 0;
        border: 1px dashed #cbd5e1;
        color: #f97316;
      }
      .divider {
        height: 1px;
        background-color: #e2e8f0;
        margin: 24px 0;
      }
      h1 {
        color: #1e293b;
        font-size: 24px;
        margin-top: 0;
      }
      p {
        margin-bottom: 16px;
      }
      .text-muted {
        color: #64748b;
      }
      .text-center {
        text-align: center;
      }
      .login-info {
        background: #f8fafc;
        border-radius: 6px;
        padding: 16px;
        margin: 16px 0;
      }
      .login-info strong {
        color: #1e293b;
      }
    </style>
  </head>
  <body>
    <div class="container">`;
  }

  private mailFooter() {
    return `
      <div class="footer">
        <p class="text-muted">© ${new Date().getFullYear()} RemoteTribe. All rights reserved.</p>
        <p class="text-muted">Helping you find the best remote jobs worldwide</p>
        <div style="margin-top: 16px;">
          <a href="https://remotetribe.com" style="color: #f97316; text-decoration: none; margin: 0 8px;">Website</a>
          <a href="https://remotetribe.com/jobs" style="color: #f97316; text-decoration: none; margin: 0 8px;">Browse Jobs</a>
          <a href="https://remotetribe.com/support" style="color: #f97316; text-decoration: none; margin: 0 8px;">Support</a>
          <a href="https://remotetribe.com/unsubscribe" style="color: #f97316; text-decoration: none; margin: 0 8px;">Unsubscribe</a>
        </div>
        <p class="text-muted" style="margin-top: 16px; font-size: 12px;">
          This is an automated message. If you didn't expect this email, you can safely ignore it.
        </p>
      </div>
    </div>
  </body>
  </html>`;
  }

  private mailContainer(content: string): string {
    return `
      <div class="header">
        <a href="https://remotetribe.com" class="logo">RemoteTribe</a>
      </div>
      <div class="content">
        ${content}
      </div>`;
  }

  public generateEmail(content: string): string {
    return this.mailHeader() + this.mailContainer(content) + this.mailFooter();
  }

  // ✅ Template: Registration Email with Verification Code
  public registrationEmail(name: string, code: string): string {
    const content = `
        <h1>Welcome to RemoteTribe, ${name}!</h1>
        <p>We're excited to have you join our community of remote professionals and companies.</p>
        <p>To complete your registration, please verify your email with the following code:</p>
        <div class="code-box">${code}</div>
        <p class="text-muted">This code will expire in 10 minutes.</p>
        <div class="divider"></div>
        <p>After verification, you can:</p>
        <ul>
          <li>Create your professional profile</li>
          <li>Save favorite remote jobs</li>
          <li>Get matched with ideal positions</li>
        </ul>
        <p>Need help? <a href="https://remotetribe.com/support" style="color: #3b82f6;">Contact our support team</a></p>
      `;
    return this.generateEmail(content);
  }

  // ✅ Template: Confirmation After Verification
  public confirmationEmail(name: string): string {
    const content = `
        <h1>Welcome aboard, ${name}!</h1>
        <p>Your email has been successfully verified and your RemoteTribe account is now active.</p>
        <p>Start exploring thousands of remote jobs from companies worldwide that match your skills and preferences.</p>
        <div class="text-center">
          <a href="https://remotetribe.com/jobs" class="button">Browse Remote Jobs</a>
        </div>
        <div class="divider"></div>
        <h2>Next Steps</h2>
        <p><strong>1. Complete your profile</strong> - Increase your chances by adding your skills, experience, and preferences.</p>
        <p><strong>2. Set up job alerts</strong> - Get notified when new jobs matching your criteria are posted.</p>
        <p><strong>3. Connect with employers</strong> - Many companies search our database for candidates.</p>
      `;
    return this.generateEmail(content);
  }

  // ✅ Template: Login Notification
  public loginNotificationEmail(name: string, location: string, time: string, device: string): string {
    const content = `
        <h1>New login detected</h1>
        <p>Hello ${name},</p>
        <p>We noticed a recent login to your RemoteTribe account:</p>
        <div class="login-info">
          <p><strong>Location:</strong> ${location}</p>
          <p><strong>Time:</strong> ${time}</p>
          <p><strong>Device:</strong> ${device}</p>
        </div>
        <p>If this was you, no action is required. If you don't recognize this activity, please secure your account immediately.</p>
        <div class="text-center">
          <a href="https://remotetribe.com/reset-password" class="button" style="background-color: #ef4444;">Reset Password</a>
        </div>
        <div class="divider"></div>
        <p class="text-muted">For your security, we recommend:</p>
        <ul>
          <li>Using a strong, unique password</li>
          <li>Enabling two-factor authentication</li>
          <li>Updating passwords regularly</li>
        </ul>
      `;
    return this.generateEmail(content);
  }

  // ✅ Template: New Job Alert
  public jobAlertEmail(name: string, jobs: Array<{ title: string, company: string, location: string, url: string }>): string {
    let jobsList = jobs.map(job => `
        <div style="margin-bottom: 16px; padding-bottom: 16px; border-bottom: 1px solid #e2e8f0;">
          <h3 style="margin: 0 0 4px 0;"><a href="${job.url}" style="color: #3b82f6; text-decoration: none;">${job.title}</a></h3>
          <p style="margin: 0; color: #64748b;">${job.company} • ${job.location}</p>
        </div>
      `).join('');

    const content = `
        <h1>New remote jobs matching your profile</h1>
        <p>Hi ${name},</p>
        <p>We found ${jobs.length} new remote opportunities that match your skills and preferences:</p>
        ${jobsList}
        <div class="text-center" style="margin-top: 24px;">
          <a href="https://remotetribe.com/jobs" class="button">View All Jobs</a>
        </div>
        <div class="divider"></div>
        <p><a href="https://remotetribe.com/profile/alerts" style="color: #3b82f6;">Adjust your job alert preferences</a> or <a href="https://remotetribe.com/unsubscribe" style="color: #3b82f6;">unsubscribe</a> from these alerts.</p>
      `;
    return this.generateEmail(content);
  }

  // ✅ Template: Application Confirmation
  public applicationConfirmation(name: string, jobTitle: string, company: string): string {
    const content = `
        <p>Hi ${name},</p>
        <p>Thank you for applying to <strong>${jobTitle}</strong> at <strong>${company}</strong> through RemoteTribe.</p>
        <div class="text-center">
          <a href="https://remotetribe.com/jobs" class="button">Find More Jobs</a>
        </div>
        <div class="divider"></div>
        <h2>What's next?</h2>
        <p><strong>1. Track your application</strong> - View status in your <a href="https://remotetribe.com/dashboard" style="color: #3b82f6;">dashboard</a></p>
        <p><strong>2. Prepare for interviews</strong> - Check our <a href="https://remotetribe.com/resources/interview-tips" style="color: #3b82f6;">interview guide</a></p>
        <p><strong>3. Keep applying</strong> - The average remote job seeker applies to 20-30 positions</p>
        <div class="divider"></div>
        <p>Good luck with your application! We're rooting for you.</p>
      `;
    return this.generateEmail(content);
  }
}

export const EmailTemplates = new Templates();