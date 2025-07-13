// utils/sendToSqs.ts
import { SendMessageCommand } from "@aws-sdk/client-sqs";
import { sqsClient } from "../config/sqsClient";

export const sendToSqs = async (message: any) => {
  const params = {
    QueueUrl: process.env.SQS_QUEUE_URL!,
    MessageBody: JSON.stringify(message),
  };

  const command = new SendMessageCommand(params);
  try {
    await sqsClient.send(command);
  } catch (error) {
    console.log(error);
    
  }
};
