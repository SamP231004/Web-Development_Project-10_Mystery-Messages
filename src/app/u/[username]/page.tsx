'use client';

import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { CardHeader, CardContent, Card } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import * as z from 'zod';
import { ApiResponse } from '@/types/ApiResponse';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { messageSchema } from '@/schemas/messageSchema';

import '@/app/CSS/laptop.css'

export default function SendMessage() {
    const params = useParams<{ username: string }>();
    const username = params.username;

    const form = useForm<z.infer<typeof messageSchema>>({
        resolver: zodResolver(messageSchema),
    });

    const messageContent = form.watch('content');
    const [isLoading, setIsLoading] = useState(false);
    const [isSuggestLoading, setIsSuggestLoading] = useState(false);
    const [suggestedMessages, setSuggestedMessages] = useState<string[]>([]);

    const onSubmit = async (data: z.infer<typeof messageSchema>) => {
        setIsLoading(true);
        try {
            const response = await axios.post<ApiResponse>('/api/send-messages', {
                ...data,
                username,
            });

            toast.success(response.data.message);
            form.reset({ ...form.getValues(), content: '' });
        } 
        catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            toast.error(axiosError.response?.data.message ?? '🙁 Message not sent — give it another go');
        } 
        finally {
            setIsLoading(false);
        }
    };

    const fetchSuggestedMessages = async () => {
        setIsSuggestLoading(true);
        try {
            const res = await fetch('/api/suggest-messages', { method: 'POST' });
            const data = await res.json();
            setSuggestedMessages(data.messages);
        } 
        catch (error) {
            console.error('Error fetching messages:', error);
            toast.error('😕 Oops! We couldn’t get suggested messages');
        } 
        finally {
            setIsSuggestLoading(false);
        }
    };

    const handleMessageClick = (message: string) => {
        form.setValue('content', message);
    };

    return (
        <div className="PublicContainer">
            <h1>Public Profile Link</h1>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                        control={form.control}
                        name="content"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className='formLabel'>Send Anonymous Message to @{username}</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Write your anonymous message here"
                                        className="resize-none"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="flex justify-center">
                        {isLoading ? (
                            <Button disabled>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Please wait
                            </Button>
                        ) : (
                            <Button type="submit" className='sendItButton' disabled={isLoading || !messageContent}>
                                Send It
                            </Button>
                        )}
                    </div>
                </form>
            </Form>

            <div className="space-y-4 my-8">
                <div className="space-y-2">
                    <Button
                        onClick={fetchSuggestedMessages}
                        className="suggestMessages"
                        disabled={isSuggestLoading}
                    >
                        {isSuggestLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Loading...
                            </>
                        ) : (
                            'Suggest Messages (Ask Gemini)'
                        )}
                    </Button>
                    <p className='clickToSelect'>Click on any message below to select it.</p>
                </div>

                <Card className='SuggestMessagesContainer'>
                    <CardHeader>
                        <h3 className="text-xl font-semibold">Messages</h3>
                    </CardHeader>
                    <CardContent className="flex flex-col space-y-4">
                        {suggestedMessages.length > 0 ? (
                            suggestedMessages.map((message, index) => (
                                <Button
                                    key={index}
                                    variant="outline"
                                    className="geminiSuggestedMessages"
                                    onClick={() => handleMessageClick(message)}
                                >
                                    {message}
                                </Button>
                            ))
                        ) : (
                            <p className="text-muted-foreground">No suggestions yet. Click &quot;Suggest Messages&quot; to get started.</p>
                        )}
                    </CardContent>
                </Card>
            </div>

            <Separator className="my-6" />

            <div className="OnBoardContainer">
                <div>Get Your Message Board</div>
                <Link href="/sign-up">
                    <Button>Create Your Account</Button>
                </Link>
            </div>
        </div>
    );
}