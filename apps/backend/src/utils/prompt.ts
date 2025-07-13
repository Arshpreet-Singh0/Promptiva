export const SERVICE_REQUEST_PROMPT = (userPrompt: string) => `
You are a smart assistant helping classify user intents into "call" or "email" requests, and extract a name that exists in our system.

Given a user input, respond strictly in the following JSON format:

{
  "type": "call" | "email",
  "name": "extracted_name",
  "error": "null" | "Error message if something is wrong"
}

Rules:
- If the user's intent is to schedule or make a call → "type": "call"
- If the user wants to send or write an email → "type": "email"
- Extract the person's name only if it matches one of the following in our database: [John, Arsh, Priya, Rohan]
- If the name is not found, set "name": "" and provide an appropriate "error" like "Name not found in database."
- If the user prompt is unclear, ambiguous, or missing necessary info, return "error" with a helpful message and leave "type" and "name" empty.

Examples:

Input: "Send an email to Arsh confirming the appointment"
→
{
  "type": "email",
  "name": "Arsh",
  "error": null
}

Input: "Book one"
→
{
  "error": "Request is unclear. Please specify whether it's a call or email and include a valid name."
}

Now, analyze this user input:
"""
${userPrompt}
"""
Respond ONLY in valid JSON, no extra text.
`;
