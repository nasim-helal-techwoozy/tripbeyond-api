export const emailTemplate = ({
  agent,
  companyName,
  agentID,
  password,
  senderEmail,
  headingName,
  titleLabel,
  passwordLabel,
  loginLink,
}) => {
  const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
          <div style="background-color: #0C254D; padding: 10px; border-radius: 10px 10px 0 0;">
            <h2 style="color: white; text-align: center; margin: 0;">Welcome to ${companyName}</h2>
          </div>
          <div style="padding: 20px;">
            <p style="font-size: 18px; color: #333;">Dear <strong style="text-transform:capitalize">${agent.orgName}</strong>,</p>
            <p style="font-size: 16px; color: #333;">
            Welcome to ${companyName}. <br/>
               ${headingName}
            </p>
            <p style="font-size: 16px; color: #333;">
              <strong>${titleLabel}:</strong> ${agentID}<br />
              <strong>${passwordLabel}:</strong> ${password}
            </p>
            <p style="font-size: 16px; color: #333;">
              You can now access your agent dashboard and start using your account.
            </p>
            <div style="text-align: center; margin: 20px 0;">
              <a href=${loginLink} style="background-color: #F6931D; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-size: 16px;">
                Go for login
              </a>
            </div>
            <p style="font-size: 16px; color: #333;">
              If you have any questions or need assistance, feel free to reach out to us at any time.
            </p>
            <p style="font-size: 16px; color: #333;">
              Best regards,<br />
              The ${companyName} Team 
            </p>
            <p style="font-size: 20px; color: #333;">
              Contact Us: <br/>
              <p style="font-size: 16px; color: #333;">
             <a href="tel:+8801322882293">01322882293</a>, <a href="tel:0248812109">02-48812109</a>  <br/>
              Email: ${senderEmail}      
          </div>
          <div style="background-color: #f1f1f1; padding: 10px; text-align: center; border-radius: 0 0 10px 10px; font-size: 12px; color: #777;">
            © 2024 ${companyName}. All rights reserved.<br />
            <a href="https://${companyName.split(' ').join('').toLowerCase()}.com/unsubscribe" style="color: #777; text-decoration: none;">Unsubscribe</a> | <a href="https://${companyName.split(' ').join('').toLowerCase()}.com/privacy" style="color: #777; text-decoration: none;">Privacy Policy</a>
          </div>
        </div>`;

  return html;
};
