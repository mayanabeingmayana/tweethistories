import { promises as fs } from 'fs';
import path from 'path';

export async function POST(request, { params }) {
  try {
    const { id } = await params;
    const tweetsPath = path.join(process.cwd(), 'src', 'data', 'tweets.json');
    const tweetsData = JSON.parse(await fs.readFile(tweetsPath, 'utf8'));

    // Find the tweet in pending
    const tweetIndex = tweetsData.pending.findIndex(t => t.id === id);
    if (tweetIndex === -1) {
      return new Response(JSON.stringify({ error: 'Tweet not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Remove tweet from pending
    tweetsData.pending.splice(tweetIndex, 1);

    // Save changes
    await fs.writeFile(tweetsPath, JSON.stringify(tweetsData, null, 2));

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error rejecting tweet:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}