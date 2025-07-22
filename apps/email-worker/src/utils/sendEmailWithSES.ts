import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import dotenv from "dotenv";
dotenv.config();

const sesClient = new SESClient({
  region: process.env.AWS_REGION || "us-east-1",
});

export const sendEmailWithSES = async ({
  to,
  subject,
  body,
  by
}: {
  to: string;
  subject: string;
  body: string;
  by : string
}) => {
  to = to.replace(/\s+/g, '').toLowerCase();
  by = by.replace(/\s+/g, '').toLowerCase();
  
  
  
  const params = {
    Destination: {
      ToAddresses: [to.trim()],
    },
    Message: {
      Body: {
        Text: {
          Charset: "UTF-8",
          Data: body,
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: subject,
      },
    },
    Source: `${by.trim()}@${process.env.SES_EMAIL_FROM?.trim()!}`,
  };

  const command = new SendEmailCommand(params);
  await sesClient.send(command);
  console.log(`✅ Email sent to ${to}`);
};
