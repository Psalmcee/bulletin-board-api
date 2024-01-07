import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

export const errorHandlerMiddleware = (err: any, req: Request, res: Response, next: NextFunction ) => {
    type customError = {
        StatusCodes: number,
        msg: string
    }

    const customError: customError = {
        StatusCodes: err.StatusCodes || StatusCodes.INTERNAL_SERVER_ERROR,
        msg: err.message || 'Something went wrong try again later'
    };

    if (err.name === 'ValidationError') {
        customError.StatusCodes = 400;
        customError.msg = Object.values(err.errors).map((item: any) => item.message).join(',');
    }

    if (err.code && err.code === 11000) {
        customError.StatusCodes = 400;
        customError.msg = `Duplicate value entered for ${Object.keys(err.keyValue)} field, please choose another value`;
    }

    if (err.name === 'CastError') {
        customError.StatusCodes = 404;
        customError.msg = `No item found with id : ${err.value}`;
    }
    return res.status(customError.StatusCodes).json({ msg: customError.msg });
};