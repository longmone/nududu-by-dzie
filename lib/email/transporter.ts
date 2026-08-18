import nodemailer from "nodemailer";

export function getGmailTransporter() {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;

  if (!user || !pass) {
    throw new Error("Email is not configured (missing GMAIL_USER/GMAIL_APP_PASSWORD).");
  }

  return {
    user,
    transporter: nodemailer.createTransport({
      service: "gmail",
      auth: { user, pass },
    }),
  };
}
