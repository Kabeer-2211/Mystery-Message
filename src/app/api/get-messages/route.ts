import { getServerSession, User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import mongoose from "mongoose";

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
    const userId = new mongoose.Types.ObjectId(user._id);
    try {
        const user = await UserModel.aggregate([
            { $match: { _id: userId } },
            { $unwind: '$messages' },
            { $sort: { 'messages.createdAt': -1 } },
            { $group: { _id: '$_id', messages: { $push: '$messages' } } },
        ]).exec();
        console.log(user)
        if (!user || user.length === 0) {
            return Response.json(
                { messages: user },
                {
                    status: 200,
                }
            );
        }
        return Response.json(
            { messages: user[0].messages },
            {
                status: 200,
            }
        );
    } catch (err) {
        console.log("Error in get messages", err);
        return Response.json({
            success: false,
            message: "Error in getting messages"
        }, { status: 500 });
    }
}