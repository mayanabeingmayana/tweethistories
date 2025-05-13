import { promises as fs } from 'fs';
import path from 'path';

// Function to extract tweet ID from URL
function extractTweetId(url) {
  // Handle both twitter.com and x.com URLs
  const match = url.match(/(?:twitter\.com|x\.com)\/\w+\/status\/(\d+)/);
  return match ? match[1] : null;
}

// Function to fetch tweet metadata
async function fetchTweetMetadata(tweetUrl) {
  try {
    const tweetId = extractTweetId(tweetUrl);
    if (!tweetId) {
      console.error('Failed to extract tweet ID from URL:', tweetUrl);
      return null;
    }

    const response = await fetch(`https://api.twitter.com/2/tweets/${tweetId}?tweet.fields=public_metrics,author_id,attachments&expansions=author_id,attachments.media_keys&user.fields=name,profile_image_url,username&media.fields=type,url,preview_image_url,variants`, {
      headers: {
        'Authorization': `Bearer ${process.env.TWITTER_BEARER_TOKEN}`
      }
    });

    // Handle rate limits
    if (response.status === 429) {
      const resetTime = response.headers.get('x-rate-limit-reset');
      console.error(`Rate limit exceeded. Reset at: ${new Date(parseInt(resetTime) * 1000).toISOString()}`);
      return null;
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Twitter API response not OK:', {
        status: response.status,
        headers: Object.fromEntries(response.headers.entries()),
        error: errorText
      });
      return null;
    }

    const data = await response.json();

    if (!data.data || !data.includes?.users?.length) {
      console.error('Invalid Twitter API response structure:', data);
      return null;
    }

    // Process media attachments if present
    const mediaItems = [];
    if (data.data.attachments?.media_keys && data.includes?.media) {
      for (const mediaKey of data.data.attachments.media_keys) {
        const mediaItem = data.includes.media.find(m => m.media_key === mediaKey);
        if (mediaItem) {
          if (mediaItem.type === 'animated_gif' && mediaItem.variants?.length > 0) {
            // Find the highest bitrate variant for the GIF
            const highestBitrateVariant = mediaItem.variants.reduce((prev, current) => {
              return (!prev || (current.bit_rate && current.bit_rate > prev.bit_rate)) ? current : prev;
            }, null);

            mediaItems.push({
              type: 'gif',
              url: highestBitrateVariant?.url || mediaItem.preview_image_url
            });
          } else {
            mediaItems.push({
              type: mediaItem.type,
              url: mediaItem.url || mediaItem.preview_image_url
            });
          }
        }
      }
    }

    return {
      authorName: data.includes.users[0].name,
      authorUsername: data.includes.users[0].username,
      authorAvatar: data.includes.users[0].profile_image_url,
      text: data.data.text,
      metrics: {
        retweet_count: data.data.public_metrics?.retweet_count || 0,
        reply_count: data.data.public_metrics?.reply_count || 0,
        like_count: data.data.public_metrics?.like_count || 0,
        quote_count: data.data.public_metrics?.quote_count || 0,
        impression_count: data.data.public_metrics?.impression_count || 0
      },
      media: mediaItems,
      originalUrl: tweetUrl
    };
  } catch (error) {
    console.error('Error fetching tweet metadata:', error);
    return null;
  }
}

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

    // Move tweet from pending to approved
    const tweet = tweetsData.pending[tweetIndex];

    // Fetch tweet metadata
    const metadata = await fetchTweetMetadata(tweet.url);

    // Enhance tweet object with metadata
    const enhancedTweet = {
      ...tweet,
      approved: true,
      approvedAt: new Date().toISOString(),
      authorName: metadata?.authorName || 'Unknown',
      authorUsername: metadata?.authorUsername || 'unknown',
      authorAvatar: metadata?.authorAvatar || '',
      text: metadata?.text || '',
      metrics: metadata?.metrics || {
        like_count: 0,
        retweet_count: 0,
        reply_count: 0,
        view_count: 0
      },
      media: metadata?.media || [],
      originalUrl: metadata?.originalUrl || tweet.url
    };

    tweetsData.approved.push(enhancedTweet);
    tweetsData.pending.splice(tweetIndex, 1);

    // Save changes
    await fs.writeFile(tweetsPath, JSON.stringify(tweetsData, null, 2));

    return new Response(JSON.stringify(tweet), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error approving tweet:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}