import UserModel, { User } from "@/model/User.model";
import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";

export async function DELETE(request: Request, { params }: { params: { messageid: string } }) {
    const messageId = (await params).messageid;
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
        console.log(user._id)
        const updatedResult = await UserModel.updateOne({ _id: user._id }, { $pull: { message: { _id: messageId } } })
        if (!updatedResult.modifiedCount || updatedResult.modifiedCount === 0) {
            return Response.json({
                success: false,
                message: "Message not found or already deleted"
            }, { status: 404 });
        }
        return Response.json({
            success: true,
            message: "Message deleted"
        }, { status: 200 });
    } catch (err) {
        console.log("Error in deleting message", err);
        return Response.json({
            success: false,
            message: "Error in deleting message"
        }, { status: 500 });
    }
}