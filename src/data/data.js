import tweetsData from './tweets.json';

// Helper function to convert ISO timestamp to relative time
function getRelativeTime(date) {
  const now = new Date();
  const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

  if (diffInHours < 1) return 'now';
  if (diffInHours === 1) return '1h';
  if (diffInHours < 24) return `${diffInHours}h`;
  return `${Math.floor(diffInHours / 24)}d`;
}

// Only export approved tweets
export const tweets = tweetsData.approved.map(tweet => ({
  ...tweet,
  timestamp: getRelativeTime(new Date(tweet.timestamp)),
  author: {
    name: tweet.authorName || 'Unknown User',
    username: tweet.authorUsername ? `@${tweet.authorUsername}` : '@unknown',
    avatar: tweet.authorAvatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=unknown',
    verified: false
  },
  text: tweet.text || '',
  metrics: tweet.metrics || {
    retweet_count: 0,
    reply_count: 0,
    like_count: 0,
    quote_count: 0,
    bookmark_count: 0,
    impression_count: 0
  }
}));