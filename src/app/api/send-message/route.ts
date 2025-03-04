import UserModel from "@/model/User.model";
import dbConnect from "@/lib/dbConnect";
import { Message } from "@/model/User.model";

export async function POST(request: Request) {
    await dbConnect();
    const { username, content } = await request.json();
    try {
        const user = await UserModel.findOne({ username });
        if (!user) {
            return Response.json({
                success: false,
                message: "User not found"
            }, { status: 404 });
        }
        if (!user.isAcceptingMessage) {
            return Response.json({
                success: false,
                message: "User is not accepting messages"
            }, { status: 403 });
        }
        user.message.push({ content, createdAt: new Date() } as Message);
        await user.save();
        return Response.json({
            success: true,
            message: "Message sent successfully"
        }, { status: 201 });
    } catch (err) {
        console.log("Error in sending message", err)
        return Response.json({
            success: false,
            message: "Error in sending message"
        }, { status: 500 });
    }
}