import mongoose from 'mongoose';
import { UserDocument, UserModel } from '../types/user-interface';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const UserSchema = new mongoose.Schema({
    /* avatar: {
        type: String,
        required: [true, 'please provide a avatar']
    }, */
    name: {
        type: String,
        required: [true, 'please provide a name']
    },
    email: {
        type: String,
        required: [true, 'please provide a valid email'],
        match: [/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'please include a valid email'],
        unique: true
    },
    location: {
        type: String,
        required: [true, 'please provide a location']
    },
    password: {
        type: String,
        required: [true, 'please provide a password'],
        minlength: [6, 'password must be at least 6 characters']
    },
    date: {
        type: Date,
        default: Date.now
    }, 
    token: {
        type: String,
        
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

//pre save returns the object that was saved and hash the password using bcrypt
 UserSchema.pre('save', async function() {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt)
});

//schema instance methods are used below to prevent sensitive algorithm from being exposed to the controllers and middlewares 

//createJWT is a method that generates a JWT token for the user. It takes the user's ID and name as input, and returns a JWT token.
UserSchema.methods.createJWT = function() {
    return jwt.sign({ userId: this._id, name: this.name }, process.env.JWT_SECRET!, {
        expiresIn: process.env.JWT_LIFETIME
    })
}

//comparePassword is a method that compares a candidate password with the user's password. It takes the candidate password as input, hashes it using bcrypt, and compares it to the user's password. It returns a boolean indicating whether the passwords match.
UserSchema.methods.comparePassword =  async function (candidatePassword: string) {
    const isMatch = await bcrypt.compare(candidatePassword, this.password)
    return isMatch
}

export default mongoose.model<UserDocument, UserModel>('User', UserSchema)