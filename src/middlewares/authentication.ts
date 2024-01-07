import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { UnauthenticatedError } from "../errors/unauthenticated";

export const authenticationMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader: string | undefined = req.headers.authorization;

    //conditional statement to test if the authHeader is undefined or not starting with Bearer and throw an error if it is not valid. 
    //If it is valid, we extract the token from the authHeader and verify it using the JWT_SECRET environment variable.  
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new UnauthenticatedError('Invalid authorization header');
    }

    //If the token is valid, we extract the userId and name from the payload and set them as properties on the request object. 
    const token = authHeader.split(' ')[1];
    
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET!) as {userId: string, name: string}
        req.user = {userId: payload.userId, username: payload.name}
        
        //Finally, we call the next middleware function to continue the request processing.
        next()
        
        //if the authHeader is undefined or not starting with Bearer, throw an error
    } catch (error) {
        throw new UnauthenticatedError('Cannot verify user')
    }
}