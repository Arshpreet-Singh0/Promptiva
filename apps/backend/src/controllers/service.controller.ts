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
    const { prompt } = req.body;
    const userId = req.userId;

    const user = await prisma.user.findUnique({
      where : {
        id : Number(userId)
      }
    })

    if (!prompt || !userId || !user) {
      throw new ExpressError("Prompt and authentication required.", 400);
    }


    // 1. AI classification
    const aiResult = await classifyPromptWithAI(prompt); // expected: { type, name, tone, error }
    console.log(aiResult);
    

    if (aiResult.error) {
      return res.status(400).json({ success: false, message: aiResult.error });
    }

    // 2. Search for person in DB
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

    // 3. Construct message and send to SQS
    const message = {
      type: aiResult.type,
      tone: aiResult.tone || "neutral",
      name: person.name,
      to: person.email || person.phone,
      by : user.name,
      prompt,
      userId,
    };

    await sendToSqs(message);

    // 4. Success response
    res.status(200).json({
      success: true,
      message: "Prompt successfully queued.",
      queued: message,
    });
  } catch (err) {
    next(err);
  }
};
