import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user.models";
import mongoose from "mongoose";
import { User } from "next-auth";
import { getServerSession } from "next-auth";
import { authOption } from "../auth/[...nextauth]/options";

export async function GET(request: Request) {
    await dbConnect();

    const session = await getServerSession(authOption);
    const _user: User = session?.user;
    if(!session || !_user) {
        return Response.json(
            {
                success: false,
                message: '🔐 Hold on! You need to authenticate first'
            }, { status : 401 }
        );
    }

    // MongoDB Pipelining
    const userId = new mongoose.Types.ObjectId(_user._id);
    try {
        const user = await UserModel.aggregate([
            { $match : { _id: userId }},
            { $unwind : '$messages' },
            { $sort : { 'messages.createdAt' : -1 }},
            { $group : { _id: '$_id', messages: { $push:'$messages' }}},
        ]).exec();

        if (!user || user.length === 0) {
            return Response.json(
                {
                    success: false,
                    message: '🤔 Hmm... that user does not seem to exist'
                }, { status : 404 }
            ); 
        }

        return Response.json(
            {
                messages: user[0].messages,
            }, { status : 200 }
        );
    }
    catch (error) {
        console.error('An unexpected error occured : ', error);
        return Response.json(
            {
                success: false,
                message: '🛠️ Server encountered an issue'
            }, { status : 500 }
        ); 
    }
}