import { Request, Response } from "express";
import User from "../model/User";
import  jwt  from "jsonwebtoken";
import nodemailer from "nodemailer";

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
    //user.expires = new Date(Date.now() + 3600000) //1 hr
    await user.save()   
    res.json(user.token)
    console.log(`Click <a href="http://localhost:5555/account/reset-password/${user.token}">Here</a> to get your password token`)

    //sending a mail to the user's email for authorization
    /* const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "XXXXXXXXXXXXXXXXXXXXXXXXXX",
            pass: "XXXXXXXXXXXXXXXXXXXXXXXXXX"
        },
        tls: {
            rejectUnauthorized: false,
        },
        port: 465,
        host: "smtp.gmail.com",
    })

    const mailOptions = {
        from: "XXXXXXXXXXXXXXXXXXXXXXXXXX",
        to: email,
        subject: "Password Reset",
        text: `Click <a href="http://localhost:5555/account/reset-token/${user.token}">Here</a> to reset your password`
        //html: "<a href='XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'>Click Here</a> to reset your password`
    }

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error)
        } else {
            console.log("Email sent: " + info.response)
        }
    }) */
}

 export const getResetToken = async (req: Request, res: Response) => {
    const { token } = req.params;
    const user = await User.findOne({ token });
    if (!user) {
        return res.status(408).send({
            message: "Invalid or expired token"
        })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!)
        //console.log(decoded)
        res.send('reset link clicked Click <a href="http://localhost:3000/reset-password/${token}">Here</a> to reset your password')
        console.log(`Click <a href="http://localhost:3000/reset-password/${token}">Here</a> to reset your password`)
    } catch (error: any) {
        console.log(error.message)
    }
} 

export const resetPassword = async (req: Request, res: Response) => {
    const { token } = req.params;
    const { password } = req.body;
   /*  const decoded = jwt.verify(token, process.env.JWT_SECRET!)
    console.log(decoded) */

    console.log(req.params)
    const user = await User.findOne({ token });

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
}