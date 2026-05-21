import { NextRequest, NextResponse } from 'next/server';
import { signInSchema } from '@/schemas/signInSchema';
import { ApiResponse } from '@/types/ApiResponse';

// Dummy user for demonstration. Replace with real user lookup and password check.
const DUMMY_USER = {
  _id: '1',
  username: 'ONE2310',
  email: 'one@one.com',
  password: 'password',
  isVerified: true,
  isAcceptingMessages: true,
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = signInSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, message: 'Invalid input' }, { status: 400 });
    }
    const { identifier, password } = parsed.data;
    // Simulate user lookup
    if ((identifier === DUMMY_USER.username || identifier === DUMMY_USER.email) && password === DUMMY_USER.password) {
      // Simulate JWT token
      const token = 'dummy-jwt-token';
      return NextResponse.json({
        success: true,
        message: 'Sign in successful',
        token,
        user: {
          _id: DUMMY_USER._id,
          username: DUMMY_USER.username,
          email: DUMMY_USER.email,
          isVerified: DUMMY_USER.isVerified,
          isAcceptingMessages: DUMMY_USER.isAcceptingMessages,
        },
      } as ApiResponse);
    }
    return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
