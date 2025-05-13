import { NextResponse } from 'next/server';

// In-memory storage for demo purposes
// In a real app, you'd use a database
let pendingTweets = [];

export async function POST(request) {
  try {
    const body = await request.json();
    console.log('Received tweet submission:', body);

    const { url, userId } = body;

    if (!url || !userId) {
      console.log('Missing required fields:', { url, userId });
      return NextResponse.json(
        { error: 'URL and userId are required' },
        { status: 400 }
      );
    }

    // Validate URL
    try {
      new URL(url);
    } catch (e) {
      console.log('Invalid URL:', url);
      return NextResponse.json(
        { error: 'Invalid URL' },
        { status: 400 }
      );
    }

    // Add to pending tweets
    const tweet = {
      id: Date.now().toString(),
      url,
      userId,
      timestamp: new Date().toISOString(),
      status: 'pending'
    };

    pendingTweets.push(tweet);
    console.log('Tweet added to pending:', tweet);

    return NextResponse.json(
      { message: 'Tweet submitted for approval', tweet },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error submitting tweet:', error);
    return NextResponse.json(
      { error: 'Failed to submit tweet: ' + error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(pendingTweets);
}