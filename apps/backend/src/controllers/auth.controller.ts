import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { JWT_SECRET } from "../utils/constant";
import { NextFunction, Request, Response } from "express";
import { loginSchema, signupSchema } from "../validations/authValidations";
import { prisma } from "../config/prisma"
import ExpressError from "../utils/errorHandeler";
import { success } from "zod/v4";

const generateRefreshToken = (id: string | number) => {
  return jwt.sign({ userId : id }, JWT_SECRET, { expiresIn: "1d" }); // Longer expiration
};

// Register User
export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const parsedData = signupSchema.safeParse(req.body);

    if (!parsedData.success) {
      const messages = parsedData.error.issues.map((e) => `${e.path.join('.')}: ${e.message}`);
      throw new ExpressError(messages.join(', '), 400);
    }

    const { name, email, password } = parsedData.data;

    const userExists = await prisma.user.findUnique({
        where : {
            email
        }
    })
    if (userExists) {
        throw new ExpressError("User already exists with this email", 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10); // Hash password before saving
    
    const user = await prisma.user.create({
        data : {
            name,
            email,
            password: hashedPassword,
        }
    })

    const refreshToken = generateRefreshToken(user.id);

    // Send refresh token as an httpOnly cookie
    res.cookie("token", refreshToken, {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week expiration
    });

    const constructedUser = {
      id: user.id,
      name: user.name,
      email: user.email,
    };

    res.status(201).json({
      success: true,
      message: "signup successfull.",
      user: constructedUser,
    });
  } catch (error) {
    next(error);
  }
};

// Login User
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Validate request body
    const parsedData = loginSchema.safeParse(req.body);

    // If validation fails, return the first error
    if (!parsedData.success) {
      const messages = parsedData.error.issues.map((e) => `${e.path.join('.')}: ${e.message}`);
      throw new ExpressError(messages.join(', '), 400);
    }

    const { email, password } = parsedData.data;

    const user = await prisma.user.findUnique({
        where : {
            email
        }
    })

    if (!user) {
      throw new ExpressError("User not found.", 404);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new ExpressError("Invalid credentials.", 401);
      return;
    }

    const refreshToken = generateRefreshToken(user.id);

    // Set the refresh token in an HTTP-only cookie
    res.cookie("token", refreshToken, {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week expiration
    });

    const constructedUser = {
      id: user.id,
      name: user.name,
      email: user.email,
    };

    res.status(200).json({
      success: true,
      message: "Login successful",
      user: constructedUser,
    });
  } catch (error) {
    next(error);
  }
};

export const verifyUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await prisma.user.findUnique({
        where : {
            id : req.userId
        }
    });

    if (!user) {
        throw new ExpressError("User not found", 404);
    }
    res.json({user, success : true});
  } catch (error) {
    next(error);
  }
};

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      secure: process.env.NODE_ENV === "production",
    });
    res.status(200).json({ message: "Logout successful" , success : true});
  } catch (error) {
    next(error);
  }
}
