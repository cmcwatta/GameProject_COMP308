/**
 * Email Service - Handles email notifications
 * Provides an alternative delivery method for important notifications
 */

export class EmailService {
  /**
   * Send email notification
   * NOTE: This is a template. Configure with your email service (Nodemailer, SendGrid, AWS SES, etc.)
   */
  static async sendEmail(userEmail, subject, htmlContent, plainTextContent) {
    try {
      // TODO: Configure with actual email service
      // Example with nodemailer:
      // const transporter = nodemailer.createTransport({
      //   service: config.email.service,
      //   auth: {
      //     user: config.email.user,
      //     pass: config.email.password
      //   }
      // });
      //
      // const mailOptions = {
      //   from: config.email.from,
      //   to: userEmail,
      //   subject: subject,
      //   html: htmlContent,
      //   text: plainTextContent
      // };
      //
      // await transporter.sendMail(mailOptions);

      console.log(`📧 Email queued for ${userEmail}: ${subject}`);
      return { success: true, email: userEmail };
    } catch (error) {
      console.error('❌ Error sending email:', error);
      throw error;
    }
  }

  /**
   * Send issue update email
   */
  static async sendIssueUpdateEmail(userEmail, issueTitle, newStatus) {
    const subject = `Issue Update: ${issueTitle}`;
    const htmlContent = `
      <h2>Issue Status Updated</h2>
      <p>The issue "<strong>${issueTitle}</strong>" has been updated to <strong>${newStatus}</strong>.</p>
      <p><a href="http://localhost:5173/issues">View Issue</a></p>
    `;
    const plainText = `Issue "${issueTitle}" has been updated to ${newStatus}`;

    return this.sendEmail(userEmail, subject, htmlContent, plainText);
  }

  /**
   * Send urgent alert email
   */
  static async sendUrgentAlertEmail(userEmail, area, issueTitle) {
    const subject = `🚨 URGENT ALERT: ${area}`;
    const htmlContent = `
      <h2 style="color: red;">⚠️ URGENT ALERT</h2>
      <p>A critical issue has been reported in <strong>${area}</strong>:</p>
      <p><strong>${issueTitle}</strong></p>
      <p><a href="http://localhost:5173/issues">View Details</a></p>
    `;
    const plainText = `URGENT: ${issueTitle} in ${area}`;

    return this.sendEmail(userEmail, subject, htmlContent, plainText);
  }

  /**
   * Send volunteer match email
   */
  static async sendVolunteerMatchEmail(userEmail, issueTitle, location) {
    const subject = `Volunteer Opportunity: ${issueTitle}`;
    const htmlContent = `
      <h2>Volunteer Opportunity</h2>
      <p>You have been matched with a volunteer opportunity:</p>
      <p><strong>${issueTitle}</strong></p>
      <p><strong>Location:</strong> ${location}</p>
      <p><a href="http://localhost:5173/volunteer">View Opportunity</a></p>
    `;
    const plainText = `Volunteer opportunity: ${issueTitle} at ${location}`;

    return this.sendEmail(userEmail, subject, htmlContent, plainText);
  }

  /**
   * Send digest email (summary of notifications from past day/week)
   */
  static async sendDigestEmail(userEmail, notifications) {
    const subject = 'Your Notification Digest';
    let htmlItems = '';
    
    notifications.forEach(notif => {
      htmlItems += `
        <li>
          <strong>${notif.title}</strong><br/>
          ${notif.message}<br/>
          <small>${new Date(notif.createdAt).toLocaleString()}</small>
        </li>
      `;
    });

    const htmlContent = `
      <h2>Your Notification Digest</h2>
      <p>You have <strong>${notifications.length}</strong> notifications:</p>
      <ul>${htmlItems}</ul>
      <p><a href="http://localhost:5173/notifications">View All Notifications</a></p>
    `;
    const plainText = `You have ${notifications.length} notifications`;

    return this.sendEmail(userEmail, subject, htmlContent, plainText);
  }

  /**
   * Send welcome email to new user
   */
  static async sendWelcomeEmail(userEmail, userName, userRole) {
    const subject = 'Welcome to Civic Engagement Platform';
    const htmlContent = `
      <h2>Welcome, ${userName}!</h2>
      <p>Thank you for joining our Civic Engagement Platform as a <strong>${userRole}</strong>.</p>
      <p>You can now:</p>
      <ul>
        <li>Report and track local issues</li>
        <li>Participate in community discussions</li>
        <li>Receive real-time notifications</li>
      </ul>
      <p><a href="http://localhost:5173">Get Started</a></p>
    `;
    const plainText = `Welcome to Civic Engagement Platform, ${userName}!`;

    return this.sendEmail(userEmail, subject, htmlContent, plainText);
  }
}

export default EmailService;
