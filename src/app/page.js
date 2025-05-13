'use client';

import { useState, useEffect } from 'react';
import MainLayout from '../components/layout/MainLayout';
import Tweet from '../components/Tweet';
import TweetModal from '../components/TweetModal';
import { useTheme } from '../context/ThemeContext';
import { getApprovedTweets } from '@/lib/storage';

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const [tweets, setTweets] = useState([]);

  useEffect(() => {
    // Load approved tweets
    setTweets(getApprovedTweets());
  }, []);

  return (
    <MainLayout>
      <div className="border-b p-4 flex justify-between items-center" style={{ borderColor: 'var(--border)' }}>
        <h1 className="text-xl font-medium" style={{ color: 'var(--foreground)' }}>tweetHistories</h1>
        <div className="flex items-center space-x-2">
          <button
            onClick={toggleTheme}
            className="flex items-center justify-center space-x-1 sm:space-x-2 rounded-full py-2 sm:py-2 px-4 sm:px-4 text-sm sm:text-base transition-all transform hover:scale-105"
            style={{
              background: 'var(--primary)',
              color: 'white'
            }}
          >
            <span>{theme === 'light' ? '🌙' : '☀️'}</span>
            <span className="hidden sm:inline">toggle</span>
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="text-white rounded-full px-4 sm:px-6 py-2 sm:py-2 text-sm sm:text-base transition-all transform hover:scale-105"
            style={{
              background: 'var(--primary)',
              ':hover': { background: 'var(--primary-hover)' }
            }}
          >
            share
          </button>
        </div>
      </div>

      {/* Tweet Feed */}
      <div>
        {tweets.map((tweet) => (
          <Tweet key={tweet.id} tweet={tweet} />
        ))}
      </div>

      <TweetModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </MainLayout>
  );
}
