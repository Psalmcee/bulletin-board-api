import { Request, Response } from "express";
import User from "../model/User";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

export const forgotPassword = async (req: Request, res: Response) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(404).send({
            message: "Email not found"
        })
    }
    const resetToken = jwt.sign({ email }, process.env.JWT_SECRET!, { expiresIn: "1h" })
    user.token = resetToken
    await user.save()
    res.json(user.token)

    //sending a mail to the user's email for authorization
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD
        },
        tls: {
            rejectUnauthorized: false,
        },
        port: 465,
        host: "smtp.gmail.com",
    })

    const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: "Password Reset",
        html: `Click <a href="http://localhost:5555/v1/api/account/reset-password/${user.id}/${user.token}">Here</a> to change your password.`
    }

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error)
        } else {
            console.log("Email sent: " /* + info.response */)
        }
    })
}

export const getResetToken = async (req: Request, res: Response) => {
    const { id, token } = req.params;
    try {
        const user = await User.findById({ _id: id });
        if (!user) {
            return res.status(408).send({
                message: "User not found"
            })
        }

        jwt.verify(token, process.env.JWT_SECRET!)
        res.redirect(`http://localhost:3000/reset-password/${id}/${token}`)
    } catch (error: any) {
        console.log(error.message)
    }
}

export const resetPassword = async (req: Request, res: Response) => {

    const { id, token } = req.params;
    const { password } = req.body;

    try {
        jwt.verify(token, process.env.JWT_SECRET!)

        const user = await User.findById({ _id: id });

        if (!user) {
            return res.status(400).send({
                message: "Invalid or expired token"
            })
        }

        user.password = await password
        user.token = null;
        await user.save();

        res.json({
            message: "Password reset successful",
            user: { user: user.email, id: user._id }
        })
    } catch (error) {
        console.log(error)
    }
}