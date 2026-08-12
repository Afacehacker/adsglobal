const nodemailer = require('nodemailer');

// Initialize Transporter with Multi-level Fail-Safe Strategy
let transporter = null;

const createTransporter = async () => {
  if (transporter) return transporter;

  const smtpUser = process.env.SMTP_USER || 'janiellaton7@gmail.com';
  const smtpPass = (process.env.SMTP_PASS || 'ksbb gvcz wcdk wfjw').replace(/\s+/g, '');

  try {
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
      connectionTimeout: 3000,
      greetingTimeout: 3000,
      socketTimeout: 3000
    });
    console.log('Primary Gmail SMTP Transporter initialized for:', smtpUser);
    return transporter;
  } catch (err) {
    console.error('Gmail SMTP initialization error:', err.message);
    return null;
  }
};

/**
 * Send 6-digit Verification OTP to user's email with 3s Safety Cap
 */
const sendVerificationOTP = async (toEmail, otpCode, userName = 'Valued User') => {
  console.log(`\n==================================================`);
  console.log(`[EMAIL OTP VERIFICATION CODE FOR ${toEmail}]: ${otpCode}`);
  console.log(`==================================================\n`);

  const sendPromise = new Promise(async (resolve) => {
    try {
      const activeTransporter = await createTransporter();
      const smtpUser = process.env.SMTP_USER || 'janiellaton7@gmail.com';
      const fromAddress = process.env.FROM_EMAIL || `"ADSGLOBAL Security" <${smtpUser}>`;

      const htmlContent = `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8fafc; border-radius: 16px;">
          <div style="background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 800; letter-spacing: 1px;">ADSGLOBAL</h1>
            <p style="color: #e0e7ff; margin: 5px 0 0 0; font-size: 13px;">Package Forwarding & Worldwide Classified Ads</p>
          </div>

          <div style="background-color: #ffffff; padding: 30px; border-radius: 0 0 12px 12px; border: 1px solid #e2e8f0;">
            <h2 style="color: #1e293b; margin-top: 0; font-size: 18px;">Email Verification Code</h2>
            <p style="color: #475569; font-size: 14px; line-height: 1.6;">Hi <strong>${userName}</strong>,</p>
            <p style="color: #475569; font-size: 14px; line-height: 1.6;">Thank you for creating an account on ADSGLOBAL. Please enter the 6-digit verification code below to verify your email and complete your registration:</p>

            <div style="margin: 30px 0; text-align: center;">
              <span style="display: inline-block; background-color: #ede9fe; border: 2px dashed #7c3aed; color: #6d28d9; font-size: 32px; font-weight: 900; letter-spacing: 8px; padding: 15px 30px; border-radius: 12px;">
                ${otpCode}
              </span>
            </div>

            <p style="color: #64748b; font-size: 12px; text-align: center;">This code is valid for 15 minutes. If you did not initiate this request, please ignore this email.</p>
            
            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 25px 0;" />
            
            <p style="color: #94a3b8; font-size: 11px; text-align: center; margin: 0;">
              Support: janiellaton7@gmail.com | © ${new Date().getFullYear()} ADSGLOBAL Ltd. All rights reserved.
            </p>
          </div>
        </div>
      `;

      if (activeTransporter) {
        await activeTransporter.sendMail({
          from: fromAddress,
          to: toEmail,
          subject: `${otpCode} is your ADSGLOBAL Email Verification Code`,
          html: htmlContent,
        });
        console.log(`OTP Email successfully delivered to ${toEmail}`);
      }
      resolve({ success: true, otpCode });
    } catch (err) {
      console.error('sendVerificationOTP Error:', err.message);
      resolve({ success: true, otpCode });
    }
  });

  const timeoutPromise = new Promise((resolve) => {
    setTimeout(() => {
      console.warn('sendVerificationOTP Safety Cap Timeout (3s)');
      resolve({ success: true, otpCode });
    }, 3000);
  });

  return Promise.race([sendPromise, timeoutPromise]);
};

/**
 * Send Welcome Email immediately after email verification & registration
 */
const sendWelcomeEmail = async (toEmail, userName = 'Valued Member') => {
  const sendPromise = new Promise(async (resolve) => {
    try {
      const activeTransporter = await createTransporter();
      const smtpUser = process.env.SMTP_USER || 'janiellaton7@gmail.com';
      const fromAddress = process.env.FROM_EMAIL || `"ADSGLOBAL Team" <${smtpUser}>`;

      const htmlContent = `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8fafc; border-radius: 16px;">
          <div style="background: linear-gradient(135deg, #10b981 0%, #0d9488 100%); padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 800;">Welcome to ADSGLOBAL! 🎉</h1>
            <p style="color: #d1fae5; margin: 5px 0 0 0; font-size: 13px;">Your Account Has Been Verified Successfully</p>
          </div>

          <div style="background-color: #ffffff; padding: 30px; border-radius: 0 0 12px 12px; border: 1px solid #e2e8f0;">
            <h2 style="color: #0f172a; margin-top: 0; font-size: 18px;">Hello ${userName},</h2>
            <p style="color: #334155; font-size: 14px; line-height: 1.6;">
              Welcome aboard! Your ADSGLOBAL account is now fully active and verified. You are ready to start sending gift packages to family and friends abroad or posting high-converting classified ad campaigns worldwide!
            </p>

            <div style="background-color: #f0fdf4; border-left: 4px solid #10b981; padding: 15px; margin: 20px 0; border-radius: 4px;">
              <h3 style="color: #065f46; margin: 0 0 8px 0; font-size: 14px;">What You Can Do Now:</h3>
              <ul style="color: #166534; font-size: 13px; margin: 0; padding-left: 20px; line-height: 1.8;">
                <li><strong>Send Gifts Abroad:</strong> Order authentic foodstuffs, electronics, apparel & gift baskets for loved ones in the UK, USA, Canada & Europe.</li>
                <li><strong>Post Ads Worldwide:</strong> Launch targeted classified ad campaigns in any city across 18+ countries.</li>
                <li><strong>Prepaid COIN Wallet:</strong> Fund your wallet with Naira or COINS (1 COIN = ₦1) for instant order execution.</li>
              </ul>
            </div>

            <div style="text-align: center; margin: 30px 0;">
              <a href="https://adsglobal-backend.onrender.com" style="display: inline-block; background-color: #4f46e5; color: #ffffff; text-decoration: none; font-weight: 800; font-size: 14px; padding: 12px 28px; border-radius: 10px;">
                Go to Your Dashboard →
              </a>
            </div>

            <p style="color: #64748b; font-size: 12px; line-height: 1.5;">
              Need help? Contact our official support team at <a href="mailto:janiellaton7@gmail.com" style="color: #4f46e5;">janiellaton7@gmail.com</a>.
            </p>

            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 25px 0;" />

            <p style="color: #94a3b8; font-size: 11px; text-align: center; margin: 0;">
              © ${new Date().getFullYear()} ADSGLOBAL Logistics & Advertising Ltd. All rights reserved.
            </p>
          </div>
        </div>
      `;

      if (activeTransporter) {
        await activeTransporter.sendMail({
          from: fromAddress,
          to: toEmail,
          subject: `Welcome to ADSGLOBAL, ${userName}! 🎁`,
          html: htmlContent,
        });
      }
      resolve({ success: true });
    } catch (err) {
      console.error('sendWelcomeEmail Error:', err.message);
      resolve({ success: true });
    }
  });

  const timeoutPromise = new Promise((resolve) => {
    setTimeout(() => resolve({ success: true }), 3000);
  });

  return Promise.race([sendPromise, timeoutPromise]);
};

module.exports = {
  sendVerificationOTP,
  sendWelcomeEmail,
};
