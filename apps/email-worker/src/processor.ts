import { sendEmailWithSES } from "./utils/sendEmailWithSES";
import { generateEmailContent } from "./utils/generateEmailWithAI";

export const processMessage = async (data: any) => {
  console.log("Processing message:", data);

  if (data.type === "email") {
    const { subject, body } = await generateEmailContent({
      name: data.name,
      details: data.prompt,
      tone: data.tone,
      by : data.by
    });

    await sendEmailWithSES({
      to: data.to,
      subject,
      body,
    });
  } else if (data.type === "call") {
    console.log("🔔 Simulating a call to", data.name);
  }
};
