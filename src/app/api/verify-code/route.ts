import UserModel from "@/model/User.model";
import dbConnect from "@/lib/dbConnect";

export async function POST(request: Request) {
  await dbConnect();
  try {
    const { username, code } = await request.json();
    const decodedUsername = decodeURIComponent(username);
    const user = await UserModel.findOne({ username: decodedUsername });
    if (!user) {
      return Response.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }
    const isValidCode = user.verifyCode === code;
    const verifyCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();
    if (isValidCode && verifyCodeNotExpired) {
      user.isVerified = true;
      await user.save();
      return Response.json(
        { success: true, message: "User verified" },
        { status: 200 }
      );
    }
    return Response.json(
      { success: false, message: "code invalid or expired" },
      { status: 404 }
    );
  } catch (err) {
    console.log("Error verifying code", err);
    return Response.json(
      { success: false, message: "Error verifying code" },
      { status: 500 }
    );
  }
}
