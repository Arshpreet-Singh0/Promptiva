import { NextFunction, Request, Response } from "express";
import ExpressError from "../utils/errorHandeler";
import { prisma } from "../config/prisma";

export const addPerson = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, email, phone } = req.body;
    const userId = req.userId;

    if (!userId) throw new ExpressError("Unauthorized", 401);
    if (!name || (!email && !phone)) {
      throw new ExpressError("All fields are required", 400);
    }

    await prisma.person.create({
      data: { name, email, phone, userId },
    });

    res.status(200).json({ message: "Person added successfully", success: true });
  } catch (error) {
    next(error);
  }
};

export const updatePerson = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const personId = req.params.id;
    const { name, email, phone } = req.body;
    const userId = req.userId;

    if (!userId) throw new ExpressError("Unauthorized", 401);

    const person = await prisma.person.findUnique({
      where: { id: personId },
    });

    if (!person || person.userId !== userId) {
      throw new ExpressError("Person not found or access denied", 404);
    }

    await prisma.person.update({
      where: { id: personId },
      data: { name, email, phone },
    });

    res.status(200).json({ message: "Person updated successfully", success: true });
  } catch (error) {
    next(error);
  }
};

export const deletePerson = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const personId = req.params.id;
    const userId = req.userId;

    if (!userId) throw new ExpressError("Unauthorized", 401);

    const person = await prisma.person.findUnique({
      where: { id: personId },
    });

    if (!person || person.userId !== userId) {
      throw new ExpressError("Person not found or access denied", 404);
    }

    await prisma.person.delete({
      where: { id: personId },
    });

    res.status(200).json({ message: "Person deleted successfully", success: true });
  } catch (error) {
    next(error);
  }
};

export const getAllPersons = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.userId;

    if (!userId) throw new ExpressError("Unauthorized", 401);

    const people = await prisma.person.findMany({
      where: { userId },
    });

    res.status(200).json({ data: people, success: true });
  } catch (error) {
    next(error);
  }
};

export const getPersonById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const personId = req.params.id;
    const userId = req.userId;

    if (!userId) throw new ExpressError("Unauthorized", 401);

    const person = await prisma.person.findUnique({
      where: { id: personId },
    });

    if (!person || person.userId !== userId) {
      throw new ExpressError("Person not found or access denied", 404);
    }

    res.status(200).json({ data: person, success: true });
  } catch (error) {
    next(error);
  }
};
