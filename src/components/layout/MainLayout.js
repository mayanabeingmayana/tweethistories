'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from '../../context/ThemeContext';

// Navigation items for the sidebar
const navItems = [
  { label: 'Home', path: '/' },
  { label: 'Explore', path: '/explore' },
  { label: 'Notifications', path: '/notifications' },
  { label: 'Messages', path: '/messages' },
  { label: 'Profile', path: '/profile' },
];

export default function MainLayout({ children }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen" style={{ background: 'var(--background)' }}>
      <div className="container mx-auto max-w-2xl">
        {/* Main Content */}
        <main className="border" style={{ borderColor: 'var(--border)' }}>
          {children}
        </main>
      </div>
    </div>
  );
}