import { Request, Response, NextFunction } from "express";
import { prisma } from "../config/prisma";

export const getAllSessions = async (req: Request, res: Response, next: NextFunction) : Promise<void> => {
  try {
    const userId = req.userId;

    const sessions = await prisma.session.findMany({
      where: { userId: Number(userId) },
      orderBy: { startedAt: "desc" },
      select: {
        id: true,
        title: true,
        startedAt: true,
        endedAt: true
      },
    });

    res.status(200).json({ success: true, sessions });
  } catch (err) {
    next(err);
  }
};

export const getSessionMessages = async (req: Request, res: Response, next: NextFunction) : Promise<void> => {
  try {
    const userId = req.userId;
    const { sessionId } = req.params;

    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      include: {
        user: true,
        messages: {
          orderBy: { timestamp: "asc" },
          select: {
            id: true,
            sender: true,
            content: true,
            timestamp: true,
          },
        },
      },
    });

    if (!session || session.userId !== Number(userId)) {
      res.status(403).json({ success: false, message: "Unauthorized or invalid session." });
      return;
    }

    res.status(200).json({
      success: true,
      sessionId: session.id,
      title: session.title,
      startedAt: session.startedAt,
      messages: session.messages,
    });
  } catch (err) {
    next(err);
  }
};
