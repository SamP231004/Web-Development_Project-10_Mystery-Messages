import UserModel from '@/model/user.models';
import { getServerSession } from 'next-auth/next';
import dbConnect from '@/lib/dbConnect';
import { User } from 'next-auth';
import { Message } from '@/model/user.models';
import { NextRequest } from 'next/server';
import { authOption } from '../../auth/[...nextauth]/options';

export async function DELETE(
    request: Request,
    { params }: { params: { messageid: string } }
) {
    const messageId = params.messageid;
    await dbConnect();
    const session = await getServerSession(authOption);
    const _user: User = session?.user;
    if (!session || !_user) {
        return Response.json(
            { 
                success: false, 
                message: '🚫 Access denied — user not authenticated.' 
            }, { status: 401 }
        );
    }

    try {
        const updateResult = await UserModel.updateOne(
            { _id: _user._id },
            { $pull: { messages: { _id: messageId } } }
        );

        if (updateResult.modifiedCount === 0) {
            return Response.json(
                { 
                    success: false,
                    message: '🕵️‍♂️ We looked everywhere, but that message is missing',
                }, { status: 404 }
            );
        }

        return Response.json(
            { 
                success: true,
                message: '😌 Message deleted successfully',
            }, { status: 200 }
        );
    } 
    catch (error) {
        console.error('Error deleting message:', error);
        return Response.json(
            { 
                success: false,
                message: '🙁 We couldn’t delete that message. Please try again later.', 
            }, { status: 500 }
        );
    }
}