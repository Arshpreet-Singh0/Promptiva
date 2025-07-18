import { NextFunction, Request, Response } from "express";
import ExpressError from "../utils/errorHandeler";
import { classifyPromptWithAI } from "../services/classifyPrompt";
import { prisma } from "../config/prisma";
import { sendToSqs } from "../utils/sendToSqs";

export const handleServicePrompt = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { prompt , sessionId } : {prompt : string, sessionId : string | null}= req.body;
    const userId = req.userId;

    const user = await prisma.user.findUnique({
      where: { id: Number(userId) },
    });

    if (!prompt || !userId || !user) {
      throw new ExpressError("Prompt and authentication required.", 400);
    }

    let session;
    if (sessionId) {
      session = await prisma.session.findUnique({
        where: { id: sessionId },
      });

      if (!session || session.userId !== user.id) {
        throw new ExpressError("Invalid or unauthorized session ID.", 403);
      }
    } else {
      session = await prisma.session.create({
        data: {
          userId: user.id,
          title: prompt.substring(0, 40),
        },
      });
    }

    await prisma.message.create({
      data: {
        sessionId: session.id,
        sender: "User",
        content: prompt,
      },
    });

    // 1. AI classification
    const aiResult = await classifyPromptWithAI(prompt); // { type, name, tone, error }

    if (aiResult.error) {
      return res.status(400).json({ success: false, message: aiResult.error });
    }

    // 2. Look up person by name and user
    const person = await prisma.person.findFirst({
      where: {
        name: {
          contains: aiResult.name,
          mode: "insensitive",
        },
        userId,
      },
    });

    if (!person) {
      return res.status(404).json({
        success: false,
        message: `No contact named '${aiResult.name}' found in your saved people.`,
      });
    }

    // 3. Ensure valid contact info based on type
    if (aiResult.type === "call") {
      if (!person.phone) {
        throw new ExpressError(
          `Phone number is missing for ${person.name}. Cannot place a call.`,
          400
        );
      }
    }

    if (aiResult.type === "email") {
      if (!person.email) {
        throw new ExpressError(
          `Email address is missing for ${person.name}. Cannot send an email.`,
          400
        );
      }
    }

    // 4. Construct message
    const message = {
      type: aiResult.type,
      tone: aiResult.tone || "neutral",
      name: person.name,
      to: aiResult.type === "call" ? person.phone : person.email,
      by: user.name,
      prompt,
      userId,
      sessionId : session.id
    };

    await prisma.message.create({
      data: {
        sessionId: session.id,
        sender: "AI",
        content: `Classified as ${aiResult.type} for ${person.name} with tone "${aiResult.tone}"`,
      },
    });

    // 5. Determine queue
    let queueUrl = "";
    if (aiResult.type === "call") {
      queueUrl = process.env.SQS_CALL_QUEUE_URL!;
    } else if (aiResult.type === "email") {
      queueUrl = process.env.SQS_EMAIL_QUEUE_URL!;
    } else {
      return res.status(400).json({ success: false, message: "Unknown action type." });
    }

    // 6. Send to SQS
    await sendToSqs(message, queueUrl);

    // 7. Respond
     res.status(200).json({
      success: true,
      message: `Prompt successfully queued.`,
      sessionId: session.id,
      queued: message,
      response : `Classified as ${aiResult.type} for ${person.name} with tone "${aiResult.tone}"`,
    });
  } catch (err) {
    next(err);
  }
};
