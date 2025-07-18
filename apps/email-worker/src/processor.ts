import { sendEmailWithSES } from "./utils/sendEmailWithSES";
import { generateEmailContent } from "./utils/generateEmailWithAI";
import { prisma } from "./config/prisma";

export const processMessage = async (data: any) => {
  console.log("Processing message:", data);

  if (data.type === "email") {
    const { subject, body } = await generateEmailContent({
      name: data.name,
      details: data.prompt,
      tone: data.tone,
      by: data.by,
    });

    // Send the email
    await sendEmailWithSES({
      to: data.to,
      subject,
      body,
      by: data.by,
    });

    // Store the generated email body as an AI message in DB
    if (data.sessionId) {
      await prisma.message.create({
        data: {
          sessionId: data.sessionId,
          sender: "AI",
          content: `✉️ Subject: ${subject}\n\n${body}`,
        },
      });
    }
  } else if (data.type === "call") {
    console.log("🔔 Simulating a call to", data.name);

  }
};
