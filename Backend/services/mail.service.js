const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendVerificationEmail(to, otp) {
  const mailOptions = {
    from: `"Yatu Rides" <${process.env.EMAIL_USER}>`,
    to: to,
    subject: 'Verify Your Email for Yatu Rides',
    text: `Your verification OTP is: ${otp}. It is valid for 10 minutes.`,
    html: `<b>Your verification OTP is: ${otp}</b>. It is valid for 10 minutes.`,
  };

  try {
    let info = await transporter.sendMail(mailOptions);
    console.log('Message sent: %s', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Could not send verification email.');
  }
}

async function sendPasswordResetEmail(to, otp) {
  const mailOptions = {
    from: `"Yatu Rides" <${process.env.EMAIL_USER}>`,
    to: to,
    subject: 'Password Reset Request for Yatu Rides',
    text: `You requested a password reset. Your OTP is: ${otp}. It is valid for 10 minutes.`,
    html: `<b>You requested a password reset. Your OTP is: ${otp}</b>. It is valid for 10 minutes.`,
  };

  try {
    let info = await transporter.sendMail(mailOptions);
    console.log('Message sent: %s', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw new Error('Could not send password reset email.');
  }
}

async function sendLoginOtpEmail(to, otp) {
  const mailOptions = {
    from: `"Yatu Rides" <${process.env.EMAIL_USER}>`,
    to: to,
    subject: 'Your Login OTP for Yatu Rides',
    text: `Your login OTP is: ${otp}. It is valid for 10 minutes.`,
    html: `<b>Your login OTP is: ${otp}</b>. It is valid for 10 minutes.`,
  };

  try {
    let info = await transporter.sendMail(mailOptions);
    console.log('Message sent: %s', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending login OTP email:', error);
    throw new Error('Could not send login OTP email.');
  }
}

module.exports = { sendVerificationEmail, sendPasswordResetEmail, sendLoginOtpEmail };
