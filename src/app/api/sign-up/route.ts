import { NextRequest, NextResponse } from 'next/server';
import { signUpSchema } from '@/schemas/signUpSchema';
import { ApiResponse } from '@/types/ApiResponse';

// Dummy user store for demonstration. Replace with real DB logic.
const users: any[] = [];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = signUpSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, message: 'Invalid input' }, { status: 400 });
    }
    const { username, email, password } = parsed.data;
    // Check if user exists
    if (users.find(u => u.username === username || u.email === email)) {
      return NextResponse.json({ success: false, message: 'User already exists' }, { status: 409 });
    }
    // Add user to dummy store
    users.push({
      _id: (users.length + 1).toString(),
      username,
      email,
      password,
      isVerified: false,
      isAcceptingMessages: true,
    });
    return NextResponse.json({ success: true, message: 'Sign up successful! Please verify your email.' } as ApiResponse);
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
