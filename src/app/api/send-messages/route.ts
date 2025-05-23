import UserModel from "@/model/user.models";
import dbConnect from "@/lib/dbConnect";
import mongoose from "mongoose";
// import { Message } from "@/model/user.models";

export async function POST(request: Request) {
    await dbConnect();
    const { username, content } = await request.json();

    try {
        const user = await UserModel.findOne({ username }).exec();
        if (!user) {
            return Response.json(
                { 
                    success: false,
                    message: '🙁 User does not seem to exist'
                }, { status: 404 }
            );
        }

        // Check if the user is accepting messages
        if (!user.isAcceptingMessages) {
            return Response.json(
                { 
                    success: false,
                    message: '🙁 Looks like this user is not accepting messages'
                }, { status: 403 }
            );
        }

        // Push the new message to the user's messages array
        console.log("content to add:", content);
        const newMessage = (user.messages as any).create({ content, createdAt: new Date() });
        user.messages.push(newMessage);
        await user.save();
        return Response.json(
            { 
                success: true,
                message: '🚀 Message sent successfully !'
            }, { status: 201 }
        );
    }
    catch(error) {
        console.error('Error adding message:', error);
        return Response.json(
            { 
                success: false,
                message: '🛠️ Server encountered an issue'
            }, { status: 500 }
        );
    }
}