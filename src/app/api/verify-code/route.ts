import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user.models";

export async function POST(request: Request) {
    await dbConnect();
    try {
        const { username, code } = await request.json();
        const decodedUsername = decodeURIComponent(username);
        const user = await UserModel.findOne({ username : decodedUsername });

        if (!user) {
            return Response.json (
                {
                    success: false,
                    message : '🤷 User not found'
                }, { status : 404 }
            );
        }

        // Check if the OTP (code) is correct and not expired
        const isCodeValid = user.verifyCode === code;
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

        if (isCodeValid && isCodeNotExpired) {
            // Update the user's verification status
            user.isVerified = true;
            await user.save();

            return Response.json (
                {
                    success: true,
                    message : '🎉 Account verified successfully!'
                }, { status : 200 }
            );
        }
        else if (!isCodeNotExpired) {
            // Code has expired
            return Response.json(
                {
                    success: false,
                    message: '⏰ Verification code has expired. Please sign up again to get a new one.',
                }, { status: 400 }
            );
        }
        else {
            // Code is incorrect
            return Response.json(
                { 
                    success: false, 
                    message: '🔐 Wrong verification code, please try again' 
                }, { status: 400 }
            );
        }
    }
    catch(error) {
        console.error('Error verifying user:', error);
        return Response.json(
            { 
                success: false, 
                message: '⚠️ Error verifying user' 
            }, { status: 500 }
        );
    }
}