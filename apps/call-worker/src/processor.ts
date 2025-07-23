import { twilioClient } from "./config/twilio";

export const processCall = async (data: any) => {
  console.log("🔔 Making call to:", data.to);

  const call = await twilioClient.calls.create({
    to: `+91${data.to}`,
    from: process.env.TWILIO_PHONE_NUMBER!,
    url: `${process.env.API_URL}?prompt=${encodeURIComponent(data.prompt)}`,
  });

  console.log("✅ Call initiated. SID:", call.sid);
};
