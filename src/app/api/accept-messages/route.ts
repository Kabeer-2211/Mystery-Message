import { getServerSession, User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";

export async function GET() {
    await dbConnect();
    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;
    if (!session || !user) {
        return Response.json({
            success: false,
            message: "Not authenticated"
        }, { status: 401 });
    }
    try {
        const foundUser = await UserModel.findById(user._id);
        if (!foundUser) {
            return Response.json({
                success: false,
                message: "User not found"
            }, { status: 404 });
        }
        return Response.json({
            success: true,
            isAcceptingMessages: foundUser.isAcceptingMessage
        }, { status: 200 });
    } catch (err) {
        console.log("Error in get message status", err);
        return Response.json({
            success: false,
            message: "Error in getting message status"
        }, { status: 500 });
    }
}

export async function POST(request: Request) {
    await dbConnect();
    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;
    if (!session || !user) {
        return Response.json({
            success: false,
            message: "Not authenticated"
        }, { status: 401 });
    }
    const { isAcceptingMessages } = await request.json();
    try {
        const updatedUser = await UserModel.findByIdAndUpdate(user._id, { isAcceptingMessage: isAcceptingMessages }, { new: true });
        if (!updatedUser) {
            return Response.json({
                success: false,
                message: "User not found"
            }, { status: 404 });
        }
        return Response.json(
            {
                success: true,
                message: 'Message acceptance status updated successfully',
                updatedUser,
            },
            { status: 200 }
        );
    } catch (err) {
        console.log("Error in get message status", err);
        return Response.json({
            success: false,
            message: "Error in getting message status"
        }, { status: 500 });
    }
}