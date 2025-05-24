import { NextRequest, NextResponse } from 'next/server';
import UserModel from '@/model/user.models';
import { getServerSession } from 'next-auth/next';
import dbConnect from '@/lib/dbConnect';
import { authOption } from '../../auth/[...nextauth]/options';

export async function DELETE(request: NextRequest) {
    await dbConnect();

    const session = await getServerSession(authOption);
    const _user = session?.user;
    if (!session || !_user) {
        return NextResponse.json(
            { 
                success: false, 
                message: '🚫 Access denied — user not authenticated.' 
            }, { status: 401 }
        );
    }

    const url = new URL(request.url);
    const messageId = url.pathname.split('/').pop();

    if (!messageId) {
        return NextResponse.json(
            { 
                success: false,
                message: 'Message ID is required.',
            }, { status: 400 }
        );
    }

    try {
        const updateResult = await UserModel.updateOne(
            { _id: _user._id },
            { $pull: { messages: { _id: messageId } } }
        );

        if (updateResult.modifiedCount === 0) {
            return NextResponse.json(
                { 
                    success: false,
                    message: '🕵️‍♂️ We looked everywhere, but that message is missing',
                }, { status: 404 }
            );
        }

        return NextResponse.json(
            { 
                success: true,
                message: '😌 Message deleted successfully',
            }, { status: 200 }
        );
    } 
    catch (error) {
        console.error('Error deleting message:', error);
        return NextResponse.json(
            { 
                success: false,
                message: '🙁 We couldn’t delete that message. Please try again later.', 
            }, { status: 500 }
        );
    }
}