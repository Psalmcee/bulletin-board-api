import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export const authenticationMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader: string | undefined = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new Error('Invalid authorization header');
    }

    const token = authHeader.split(' ')[1];
    
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET!) as {userId: string, username: string, email: string}
        req.body.user = {userId: payload.userId, username: payload.username, email: payload.email}
        next()
    } catch (error) {
        throw new Error('Cannot verify user')
    }
}
