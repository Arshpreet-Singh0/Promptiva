import { generateText } from "ai";
import { openrouter } from "@openrouter/ai-sdk-provider";
import { GENERATE_EMAIL_CONTENT_PROMPT } from "./prompt";

export async function generateEmailContent({
  name,
  details,
  tone,
  by
}: {
  name: string;
  details: string;
  tone?: string;
  by? : string
}): Promise<{ subject: string; body: string }> {
  const { text } = await generateText({
    model: openrouter("anthropic/claude-3-haiku"),
    prompt: GENERATE_EMAIL_CONTENT_PROMPT({ name, details, tone, by }),
  });

  try {
    return JSON.parse(text.trim());
  } catch (err) {
    console.error("❌ Failed to parse AI response:", text);
    throw new Error("Failed to generate structured email content.");
  }
}
