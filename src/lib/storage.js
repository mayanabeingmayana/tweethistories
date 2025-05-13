// In-memory storage for demo purposes
// In a real app, you'd use a database
let pendingTweets = [];
let approvedTweets = [];

export function addPendingTweet(tweet) {
  // Automatically approve the tweet
  const approvedTweet = {
    ...tweet,
    status: 'approved'
  };
  approvedTweets.push(approvedTweet);
  return approvedTweet;
}

export function getPendingTweets() {
  return pendingTweets;
}

export function getApprovedTweets() {
  return approvedTweets;
}

export function removePendingTweet(id) {
  pendingTweets = pendingTweets.filter(tweet => tweet.id !== id);
}