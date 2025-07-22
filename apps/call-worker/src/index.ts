import dotenv from "dotenv";
dotenv.config();

import {
  ReceiveMessageCommand,
  DeleteMessageCommand,
} from "@aws-sdk/client-sqs";
import { sqsClient } from "./config/sqsClient";
import { processCall } from "./processor";

const pollQueue = async () => {
  const command = new ReceiveMessageCommand({
    QueueUrl: process.env.SQS_CALL_QUEUE_URL!,
    MaxNumberOfMessages: 10,
    WaitTimeSeconds: 10,
  });

  const response = await sqsClient.send(command);
  const messages = response.Messages || [];

  for (const message of messages) {
    try {
      const body = JSON.parse(message.Body!);
      console.log(body);
      
      await processCall(body);

      // Delete from queue after success
      const deleteCommand = new DeleteMessageCommand({
        QueueUrl: process.env.SQS_CALL_QUEUE_URL!,
        ReceiptHandle: message.ReceiptHandle!,
      });
      await sqsClient.send(deleteCommand);
    } catch (error) {
      console.error("❌ Error processing call:", error);
    }
  }

  setTimeout(pollQueue, 2000);
};

pollQueue();
