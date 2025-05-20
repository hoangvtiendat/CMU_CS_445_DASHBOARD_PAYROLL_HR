import nodemailer from "nodemailer";

(async () => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST as string,
    port: Number(process.env.EMAIL_PORT), // Convert to number
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  } as nodemailer.TransportOptions);

  try {
    const info = await transporter.sendMail({
      from: '"Trello Project" <nguyenduchuy2005hnh@gmail.com>',
      to: "nguyenduchuyhnh54@gmail.com", // email khác để test
      subject: "Test email",
      html: "<b>Hello! This is a test email.</b>",
    });

    console.log("✅ Email sent:", info.messageId);
  } catch (err) {
    console.error("❌ Email error:", err);
  }
})();