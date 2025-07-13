import { NextFunction, Request, Response } from "express";
import ExpressError from "../utils/errorHandeler";
import jwt, { JwtPayload } from "jsonwebtoken";

export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies?.token;
        if (!token) {
            throw new ExpressError("Authentication token is missing", 401);
        }

        const decode = jwt.decode(token) as JwtPayload;
        if (!decode) {
            throw new ExpressError("Invalid authentication token", 401);
        }

        req.userId = decode.userId;

        next();
    } catch (error) {
        next(error);
    }
}