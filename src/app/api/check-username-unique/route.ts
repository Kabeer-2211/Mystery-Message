import UserModel from "@/model/User.model";
import dbConnect from "@/lib/dbConnect";
import { z } from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";

const UsernameQuerySchema = z.object({
  username: usernameValidation,
});

export async function GET(request: Request) {
  await dbConnect();
  try {
    const { searchParams } = new URL(request.url);
    const queryParam = {
      username: searchParams.get("username"),
    };
    const result = UsernameQuerySchema.safeParse(queryParam);
    if (!result.success) {
      return Response.json(
        {
          success: false,
          message: result.error.format().username?._errors[0] || [],
        },
        { status: 404 }
      );
    }
    const { username } = result.data;
    const user = await UserModel.findOne({ username, isVerified: true });
    if (user) {
      return Response.json(
        {
          success: false,
          message: "Username is already taken",
        },
        { status: 404 }
      );
    }
    return Response.json(
      {
        success: true,
        message: "Username is available",
      },
      { status: 200 }
    );
  } catch (err) {
    console.log("Error checking username", err);
    return Response.json(
      { success: false, message: "Error checking username" },
      { status: 500 }
    );
  }
}
