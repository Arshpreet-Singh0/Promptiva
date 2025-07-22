import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import { twiml } from "twilio"; // ✅ Correct import
import { twilioClient } from "./config/twilio";
// import { generateAIResponse } from "./utils/ai"; // (optional) If using AI model

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // ✅ Needed for Twilio POST body

// ✅ Health check
app.get("/", (_req, res) => {
  res.send("Call worker is running.");
});

// ✅ TwiML endpoint for initial call
app.post("/twiml", (req: Request, res: Response) => {
  console.log("📞 Incoming call to /twiml");

  const response = new twiml.VoiceResponse();
  const prompt =
    (req.query.prompt as string) ||
    "Hello! This is a call from your assistant. Please speak after the beep.";

  // Speak the prompt
  response.say({ voice: "alice" }, prompt);

  // Gather speech input
  const gather = response.gather({
    input: ["speech"],
    action: "/gather",
    method: "POST",
    timeout: 5,
    speechTimeout: "auto",
  });

  gather.say("I'm listening...");

  // In case no speech is gathered
  response.say("Sorry, I didn’t hear anything. Goodbye.");
  response.hangup();

  res.type("text/xml").send(response.toString());
});

// ✅ Handle speech results
app.post("/gather", async (req: Request, res: Response) => {
  console.log("🎙️ Speech gathered from user:", req.body?.SpeechResult);

  const response = new twiml.VoiceResponse();
  const speech = req.body?.SpeechResult;

  if (!speech) {
    response.say("Sorry, I didn’t catch that.");
    response.redirect("/twiml");
    return res.type("text/xml").send(response.toString());
  }

  // 🧠 Use AI response (replace with actual AI call)
  // const aiReply = await generateAIResponse(speech);
  const aiReply = `You said: ${speech}. I'm still listening.`;

  response.say({ voice: "alice" }, aiReply);

  // Continue the conversation
  response.redirect("/twiml");

  res.type("text/xml").send(response.toString());
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚀 Call worker listening at http://localhost:${PORT}`);
});
