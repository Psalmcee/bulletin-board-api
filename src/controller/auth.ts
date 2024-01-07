import { StatusCodes } from "http-status-codes";
import User  from "../model/User";
import { Request, Response } from "express";



interface User {
    avatar: string
    name: string,
    email: string,
    password: string,
    location: string,
    createJWT: () => string,
}

export const register = async (req: Request, res: Response) => {
    try {
        const user: User = await User.create({...req.body})   
        const token = user.createJWT()
        res.status(StatusCodes.CREATED).send(`<h1>Account registered successfully</h1>`/* {user: req.body, token} */)
        
    } catch (error: any) {
        res.status(StatusCodes.BAD_REQUEST).json(error.message)
    }
}

export const login = async (req: Request, res: Response) => {
    const {email, password} = req.body;

    if (!email || !password) {
        res.status(StatusCodes.BAD_REQUEST).send('Please provide email and password')
        return
    }

    const user = await User.findOne({email})
    if (!user) {
        res.status(StatusCodes.BAD_REQUEST).send('Invalid Email')
        return
    }
    const isPasswordCorrect = await user.comparePassword(password)
    if (!isPasswordCorrect) {
        res.status(StatusCodes.BAD_REQUEST).send('Incorrect Password')
        return
        
    }
    
    const token = user.createJWT()
    
    res.status(StatusCodes.ACCEPTED).send({msg: `<h1>Login successful...</h1>`, token});
}
