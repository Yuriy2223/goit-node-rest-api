import "dotenv/config";
import nodemailer from "nodemailer";

const transport = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: process.env.MAILTRAP_USERNAME,
    pass: process.env.MAILTRAP_PASSWORD,
  },
});

function sendMail(message) {
  return transport.sendMail(message);
}

export default { sendMail };

// const messageToTheUser = {
//   to: ["yuriy.shukan@gmail.com"],
//   from: "yuriy@gmail.com",
//   subject: "11111111111111111111111",
//   html: `<h1 style="color: red;">User verification by link</h1>`,
//   text: `Click my`,
// };

// transport.sendMail(messageToTheUser).then(console.log).catch(console.error);
