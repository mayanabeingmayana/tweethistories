import { promises as fs } from 'fs';
import path from 'path';

export async function POST(request) {
  try {
    const { url, userId } = await request.json();

    // Validate required fields
    if (!url || !userId) {
      return new Response(JSON.stringify({ error: 'URL and userId are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Read the current tweets file
    const tweetsPath = path.join(process.cwd(), 'src', 'data', 'tweets.json');
    const tweetsData = JSON.parse(await fs.readFile(tweetsPath, 'utf8'));

    // Create new tweet object
    const newTweet = {
      id: Date.now().toString(),
      userId,
      url,
      timestamp: new Date().toISOString(),
      approved: false
    };

    // Add to pending section
    tweetsData.pending.push(newTweet);

    // Write back to file
    await fs.writeFile(tweetsPath, JSON.stringify(tweetsData, null, 2));

    return new Response(JSON.stringify(newTweet), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error handling tweet submission:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}