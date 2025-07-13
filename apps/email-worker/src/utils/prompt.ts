export const GENERATE_EMAIL_CONTENT_PROMPT = ({
  name,
  details,
  tone = "professional",
  by = "anonymous"
}: {
  name: string;
  details: string;
  tone?: string;
  by ? : string
}) => `
You are a helpful assistant writing emails.

Write a clear and polite email to **${name}** using the following details:
"${details}"

Tone: ${tone}

Sent by : ${by}

Respond ONLY in the following JSON format:
{
  "subject": "subject line here",
  "body": "full email message here"
}
`;
