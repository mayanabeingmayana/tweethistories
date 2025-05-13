import { NextResponse } from 'next/server';

// In-memory storage for demo purposes
// In a real app, you'd use a database
let pendingTweets = [];
let approvedTweets = [];

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

    // Create tweet object
    const tweet = {
      id: Date.now().toString(),
      url,
      userId,
      timestamp: new Date().toISOString(),
      status: 'approved' // Automatically set to approved
    };

    // Add to both pending and approved lists (for admin interface and display)
    pendingTweets.push(tweet);
    approvedTweets.push(tweet);

    console.log('Tweet added:', tweet);

    return NextResponse.json(
      { message: 'Tweet added successfully', tweet },
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
  // Return approved tweets for display
  return NextResponse.json(approvedTweets);
}