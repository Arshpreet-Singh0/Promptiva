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
  const params = {
    Destination: {
      ToAddresses: [to],
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
    Source: `${by}@${process.env.SES_EMAIL_FROM!}`,
  };

  const command = new SendEmailCommand(params);
  await sesClient.send(command);
  console.log(`✅ Email sent to ${to}`);
};
