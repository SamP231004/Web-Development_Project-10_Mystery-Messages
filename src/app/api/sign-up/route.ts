import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user.models";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(request: Request) {
    await dbConnect()

    try {
        const {username, email, password} = await request.json();
        const existingVerifiedUserByUsername = await UserModel.findOne({
            username,
            isVerified: true,
        })

        if (existingVerifiedUserByUsername) {
            return Response.json (
                {
                    success: false,
                    message: '🙅‍♂️ Sorry, that username is taken',
                },
                { status : 400 }
            );
        }
        
        const existingUserByEmail = await UserModel.findOne({ email });
        let verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

        if (existingUserByEmail) {
            if (existingUserByEmail.isVerified) {
                return Response.json (
                    {
                        success: false,
                        message: '😌 Looks like this email is already registered. Try logging in!',
                    },
                    { status : 400 }
                )
            }
            else {
                const hashedPassword = await bcrypt.hash(password, 10);
                existingUserByEmail.password = hashedPassword;
                existingUserByEmail.verifyCode = verifyCode;
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
                await existingUserByEmail.save();
            }
        }
        else {
            const hashedPassword = await bcrypt.hash(password, 10);
            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + 1);

            const newUser = new UserModel({
                username,
                email,
                password: hashedPassword,
                verifyCode,
                verifyCodeExpiry: expiryDate,
                isVerified: false,
                isAcceptingMessages: true,
                messages: [],
            });
            await newUser.save();
        }

        const emailResponse = await sendVerificationEmail(
            email,
            username,
            verifyCode
        );
        if (!emailResponse.success) {
            return Response.json(
                {
                    success: false,
                    message: emailResponse.message,
                },
                { status : 500 }
            );
        }

        return Response.json(
            {
                success: true,
                message: "✨ Welcome aboard! Please verify your account to get started.",
            },
            { status : 201}
        );
    }
    catch (error) {
        console.error('Error registering user:', error);
        return Response.json(
            {
                success: false,
                message: '⚠️ Error registering user',
            },
            { status: 500 }
        );
    }
}