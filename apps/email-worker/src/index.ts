import dotenv from "dotenv";
dotenv.config();

import {
  ReceiveMessageCommand,
  DeleteMessageCommand,
} from "@aws-sdk/client-sqs";
import { sqsClient } from "./config/sqsClient";
import { processMessage } from "./processor";

const pollQueue = async () => {
  const command = new ReceiveMessageCommand({
    QueueUrl: process.env.SQS_QUEUE_URL!,
    MaxNumberOfMessages: 1,
    WaitTimeSeconds: 10,
    VisibilityTimeout: 30,
  });

  try {
    const response = await sqsClient.send(command);
    const messages = response.Messages;

    if (!messages || messages.length === 0) {
      console.log("No messages in queue.");
      return;
    }

    for (const message of messages) {
      const body = JSON.parse(message.Body!);

      try {
        await processMessage(body);

        // Delete message after success
        await sqsClient.send(
          new DeleteMessageCommand({
            QueueUrl: process.env.SQS_QUEUE_URL!,
            ReceiptHandle: message.ReceiptHandle!,
          })
        );

        console.log("✅ Message deleted.");
      } catch (err) {
        console.error("❌ Error processing message:", err);
      }
    }
  } catch (err) {
    console.error("❌ SQS Polling failed:", err);
  }
};

//one initail call
pollQueue();

setInterval(pollQueue, 5000); // Poll every 5s
