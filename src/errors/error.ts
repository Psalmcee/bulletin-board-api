import { NextFunction, Request, Response } from "express";

export function errorHandler (err: any, req: Request, res: Response, next: NextFunction) {
    console.log(err.stack)
    res.status(err.status).json(err.message)
}