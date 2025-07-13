
import { generateText } from "ai";
import { openrouter } from "@openrouter/ai-sdk-provider";
import { SERVICE_REQUEST_PROMPT } from "../utils/prompt";

export async function classifyPromptWithAI(prompt : string){

  const { text } = await generateText({
    model: openrouter("anthropic/claude-3-haiku"),
    prompt : SERVICE_REQUEST_PROMPT(prompt)
  });

  return JSON.parse(text);
}