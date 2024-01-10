import { Request, Response } from "express";
import User from "../model/User";
import  jwt  from "jsonwebtoken";

export const forgotPassword = async (req: Request, res: Response) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(404).send({
            message: "Email not found"
        })
    }
    const resetToken = jwt.sign({email}, process.env.JWT_SECRET!, {expiresIn: "1h"})
    user.token = resetToken
    //user.expires = new Date(Date.now() + 3600000)
    await user.save()
    console.log(user.name, user.token)
    
    res.send("Password reset link sent to your email")
}

export const getResetToken = async (req: Request, res: Response) => {
    const { token } = req.params;
    const user = await User.findOne({ token });
    if (!user) {
        return res.status(408).send({
            message: "Invalid or expired token"
        })
    }
    res.send({
        message: "Valid token"
    })
}

export const resetPassword = async (req: Request, res: Response) => {
    const { token } = req.params;
    const { password } = req.body;
    const user = await User.findOne({ token });
    if (!user) {
        return res.status(404).send({
            message: "Invalid or expired token"
        })
    }
    user.password = await password
    user.token = null;
    await user.save();
    res.send({
        message: "Password reset successful",
         user: { user: user.email, id: user._id }
    })
}