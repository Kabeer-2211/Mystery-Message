import mongoose, { Schema, Document } from "mongoose";

export interface Message extends Document {
    content: string;
    createdAt: Date
}

const MessageSchema: Schema<Message> = new Schema({
    content: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now()
    }
});

export interface User extends Document {
    username: string;
    email: string;
    password: string;
    verifyCode: string;
    verifyCodeExpiry: Date;
    isVerified: boolean;
    isAcceptingMessage: boolean;
    message: Message[]
}

const UserSchema: Schema<User> = new Schema({
    username: {
        type: String,
        required: [true, "username is required"],
        trim: true,
        unique: true
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'email is required'],
        match: [/.+\@.+\..+/, 'please use a valid email address']
    },
    password: {
        type: String,
        required: [true, 'password is required']
    },
    verifyCode: {
        type: String,
        required: [true, 'verify code is required']
    },
    verifyCodeExpiry: {
        type: Date,
        required: [true, 'verify code expiry is required']
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isAcceptingMessage: {
        type: Boolean,
        default: true
    },
    message: [MessageSchema],
});

// const MessageModel = (mongoose.models.message as mongoose.Model<Message>) || mongoose.model<Message>('message', MessageSchema);
const UserModel = (mongoose.models.user as mongoose.Model<User>) || mongoose.model<User>('user', UserSchema);
export default UserModel;