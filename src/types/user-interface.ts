import { Document, Model } from "mongoose";

export interface UserDocument extends Document {
    avatar: string,
    name: string,
    email: string,
    location: string,
    password: string,
    token?: string | null,
    createJWT: () => string,
    comparePassword: (candidatePassword: string) => Promise<boolean>
}

export interface UserModel extends Model<UserDocument> {
    build(attrs: UserDocument): UserDocument;
  }