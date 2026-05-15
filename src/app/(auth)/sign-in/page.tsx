'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signInSchema } from '@/schemas/signInSchema';
import { toast } from 'sonner';
import axios, { AxiosError } from 'axios';
import { ApiResponse } from '@/types/ApiResponse';
import { useAuth } from '@/context/AuthProvider';

import '@/app/CSS/laptop.css';

export default function SignInForm() {
  const router = useRouter();
  const { signIn } = useAuth();

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: 'ONE2310',
      password: 'password',
    },
  });

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    try {
      const response = await axios.post<ApiResponse>('/api/auth/sign-in', data);
      if (!response.data.token || !response.data.user) {
        toast.error('Sign in failed. Please try again.');
        return;
      }

      signIn(response.data.token, response.data.user);
      toast.success('Successfully signed in! Redirecting...');
      setTimeout(() => {
        router.replace('/dashboard');
      }, 1000);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data.message ?? 'Oops! Incorrect username or password');
    }
  };

  return (
    <div className="SignInContainer">
      <div className="SignInBox">
        <div className="SignInUpperPart">
          <h1>
            Welcome Back to Mystery Messages
          </h1>
          <p>Sign in to keep your conversations secret</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="identifier"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='formLabel'>Email/Username</FormLabel>
                  <Input {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='formLabel'>Password</FormLabel>
                  <Input type="password" {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">
              Sign In
            </Button>
          </form>
        </Form>
        <div className='SignInLowerPart'>
          <p>
            Not a member yet?{' '}
            <Link href="/sign-up" className='SignInLowerPartLink'>
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
