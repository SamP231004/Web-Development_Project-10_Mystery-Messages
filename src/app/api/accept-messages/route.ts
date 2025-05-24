import { getServerSession } from "next-auth";
import { authOption } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user.models";
import { User } from "next-auth";

export async function POST(request: Request) {
    await dbConnect();

    const session = await getServerSession(authOption);
    const user: User = session?.user;
    if (!session || !session.user) {
        return Response.json(
            { 
                success: false, 
                message: '🔐 Authentication required to proceed' 
            }, { status: 401 }
        );
    }

    const userId = user._id;
    const { acceptMessages } = await request.json();

    try {
        // Update the user's message acceptance status
        const updateUser = await UserModel.findByIdAndUpdate(
            userId,
            { isAcceptingMessages: acceptMessages },
            { new: true }
        );
        if (!updateUser) {
            // User not found
            return Response.json(
                { 
                    success: false, 
                    message: '🙁 Unable to find user to update message acceptance status' 
                }, { status: 404 }
            );
        }

        // Successfully updated message acceptance status
        return Response.json(
            { 
                success: true, 
                message: '😊 Message acceptance status updated successfully' ,
                updateUser,
            }, { status: 200 }
        );
    }
    catch (error) {
        console.error('Error updating message acceptance status:', error);
        return Response.json(
            { 
                success: false, 
                message: '😟 Error updating message acceptance status' ,
            }, { status: 500 }
        );
    }
}

export async function GET() {
    await dbConnect();

    const session = await getServerSession(authOption);
    const user: User = session?.user;
    if (!session || !session.user) {
        return Response.json(
            { 
                success: false, 
                message: '🔐 Authentication required to proceed' 
            }, { status: 401 }
        );
    }

    try {
        // Retrieve the user from the database using the ID
        const foundUser = await UserModel.findById(user._id);
        if (!foundUser) {
            // User not found
            return Response.json(
                { 
                    success: false, 
                    message: '🙁 Unable to find user' 
                }, { status: 404 }
            );
        }

        // Return the user's message acceptance status
        return Response.json(
            { 
                success: true, 
                isAcceptingMessages: foundUser.isAcceptingMessages,
            }, { status: 200 }
        );
    }
    catch (error) {
        console.error('Error retrieving message acceptance status:', error);
        return Response.json(
            { 
                success: false, 
                message: '⚠️ Error retrieving message acceptance status' ,
            }, { status: 500 }
        );
    }
}