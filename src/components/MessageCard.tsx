'use client'

import React from 'react';
import axios, { AxiosError } from 'axios';
import dayjs from 'dayjs';
import { X } from 'lucide-react';
import { toast } from 'sonner';
import { Message } from '@/model/user.models';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Button } from './ui/button';
import { ApiResponse } from '@/types/ApiResponse';

import '@/app/CSS/laptop.css'

type MessageCardProps = {
    message: Message;
    onMessageDelete: (messageId: string) => void;
};

export function MessageCard({ message, onMessageDelete }: MessageCardProps) {
    const handleDeleteConfirm = async () => {
        try {
            const response = await axios.delete<ApiResponse>(
                `/api/delete-messages/${message._id}`
            );
            toast.success(response.data.message);
            if (typeof message._id === 'string') {
                onMessageDelete(message._id);
            }
            else {
                toast.error('🙁 Hmm… that message ID isn’t valid');
            }
        } 
        catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            toast.error(
                axiosError.response?.data.message ?? '⚠️ Message deletion failed.'
            );
        }
    };

    return (
        <Card className="CardContainer">
            <CardHeader className='CardContainerContent'>
                <div className="flex justify-between items-center">
                    <CardTitle>{message.content}</CardTitle>
                    <AlertDialog>
                        <AlertDialogTrigger asChild className='deleteButton'>
                            <Button variant="destructive">
                                <X className="w-3 h-3" />
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className='AlertDialogBox'>
                            <AlertDialogHeader>
                                <AlertDialogTitle>😬 Double-check — are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Be careful! This will permanently delete the message.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel className='CancelButton'>Cancel</AlertDialogCancel>
                                <AlertDialogAction className='ContinueButton' onClick={handleDeleteConfirm}>
                                    Continue
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
                <div className="text-sm">
                    {dayjs(message.createdAt).format('MMM D, YYYY h:mm A')}
                </div>
            </CardHeader>
            <CardContent></CardContent>
        </Card>
    );
}