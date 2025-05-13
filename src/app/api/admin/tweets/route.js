import { promises as fs } from 'fs';
import path from 'path';

export async function GET() {
  try {
    const tweetsPath = path.join(process.cwd(), 'src', 'data', 'tweets.json');
    const tweetsData = JSON.parse(await fs.readFile(tweetsPath, 'utf8'));
    return new Response(JSON.stringify(tweetsData.pending), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching pending tweets:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}