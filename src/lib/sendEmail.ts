import nodemailer from "nodemailer";

export async function sendEmail({
  to,
  subject,
  body,
  attachments = [],
}: {
  to: string | string[];
  subject: string;
  body: string;
  attachments?: any[];
}) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: 465,
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await new Promise((resolve, reject) => {
    transporter.verify((error, success) => {
      if (error) {
        console.error("Transporter verification failed:", error);
        reject(error);
      } else {
        console.log("Transporter is ready:", success);
        resolve(success);
      }
    });
  });

  const info = await new Promise((resolve, reject) => {
    transporter.sendMail(
      {
        from: process.env.SMTP_FROM_EMAIL,
        to,
        subject,
        text: body,
        attachments,
      },
      (err, result) => {
        if (err) {
          console.error("Error sending email:", err);
          reject(err);
        } else {
          resolve(result);
        }
      },
    );
  });

  console.log("📨 Email sent:", (info as any).messageId);
  return info;
}
