import { NextResponse } from 'next/server';
import { getPendingTweets } from '@/lib/storage';

// In-memory storage for demo purposes
// In a real app, you'd use a database
let pendingTweets = [];

export async function GET(request) {
  // Basic auth check
  const authHeader = request.headers.get('authorization');
  console.log('Auth header received:', authHeader ? 'Present' : 'Missing');

  if (!authHeader || !authHeader.startsWith('Basic ')) {
    console.log('Invalid auth header format');
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const base64Credentials = authHeader.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [username, password] = credentials.split(':');

    console.log('Attempting login with:', {
      providedUsername: username,
      providedPassword: password ? '****' : 'missing',
      expectedUsername: process.env.ADMIN_USERNAME,
      expectedPassword: process.env.ADMIN_PASSWORD ? '****' : 'missing'
    });

    // Check if environment variables are set
    if (!process.env.ADMIN_USERNAME || !process.env.ADMIN_PASSWORD) {
      console.error('Environment variables not set:', {
        hasUsername: !!process.env.ADMIN_USERNAME,
        hasPassword: !!process.env.ADMIN_PASSWORD
      });
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    // Check credentials against environment variables
    if (username !== process.env.ADMIN_USERNAME || password !== process.env.ADMIN_PASSWORD) {
      console.log('Invalid credentials');
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    console.log('Authentication successful');
    return NextResponse.json(getPendingTweets());
  } catch (error) {
    console.error('Error in admin auth:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 401 }
    );
  }
}