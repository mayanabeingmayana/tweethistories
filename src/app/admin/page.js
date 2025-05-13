'use client';

import { useState, useEffect } from 'react';
import MainLayout from '../../components/layout/MainLayout';

export default function AdminPage() {
  const [pendingTweets, setPendingTweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPendingTweets();
  }, []);

  const fetchPendingTweets = async () => {
    try {
      const response = await fetch('/api/admin/tweets');
      if (!response.ok) throw new Error('Failed to fetch pending tweets');
      const data = await response.json();
      setPendingTweets(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (tweetId) => {
    try {
      const response = await fetch(`/api/admin/tweets/${tweetId}/approve`, {
        method: 'POST',
      });
      if (!response.ok) throw new Error('Failed to approve tweet');
      fetchPendingTweets(); // Refresh the list
    } catch (err) {
      setError(err.message);
    }
  };

  const handleReject = async (tweetId) => {
    try {
      const response = await fetch(`/api/admin/tweets/${tweetId}/reject`, {
        method: 'POST',
      });
      if (!response.ok) throw new Error('Failed to reject tweet');
      fetchPendingTweets(); // Refresh the list
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  return (
    <MainLayout>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
        <div className="space-y-4">
          {pendingTweets.length === 0 ? (
            <p>No pending tweets to review</p>
          ) : (
            pendingTweets.map((tweet) => (
              <div
                key={tweet.id}
                className="border rounded-lg p-4 space-y-2"
                style={{ borderColor: 'var(--border)' }}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">User ID: {tweet.userId}</p>
                    <a
                      href={tweet.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      {tweet.url}
                    </a>
                    <p className="text-sm text-gray-500">
                      Submitted: {new Date(tweet.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <div className="space-x-2">
                    <button
                      onClick={() => handleApprove(tweet.id)}
                      className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(tweet.id)}
                      className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </MainLayout>
  );
}