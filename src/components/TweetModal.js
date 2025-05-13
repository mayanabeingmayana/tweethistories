'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function TweetModal({ isOpen, onClose }) {
  const [url, setUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' | 'error' | null
  const [isValidUrl, setIsValidUrl] = useState(true);

  const validateUrl = (input) => {
    try {
      new URL(input);
      return true;
    } catch {
      return false;
    }
  };

  // Close modal on escape key press
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!url.trim() || !isValidUrl) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/tweets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: url.trim(),
          userId: '1', // Using John Doe's ID for demo
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit tweet');
      }

      setSubmitStatus('success');
      setTimeout(() => {
        setUrl('');
        setSubmitStatus(null);
        onClose();
      }, 1500);
    } catch (error) {
      console.error('Error submitting tweet:', error);
      setSubmitStatus('error');
      setTimeout(() => setSubmitStatus(null), 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="w-full max-w-lg relative overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-0">
          {isSubmitting && (
            <div className="flex items-center space-x-2 text-sm font-medium" style={{ color: 'var(--primary)' }}>
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>Posting...</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex space-x-3">
            <div className="flex-1">
              <div className="flex space-x-2">
                <input
                  type="url"
                  value={url}
                  onChange={(e) => {
                    const input = e.target.value;
                    setUrl(input);
                    setIsValidUrl(validateUrl(input));
                  }}
                  className="flex-1 rounded-full text-xl h-12 bg-transparent placeholder-black dark:placeholder-white px-4 border border-blue-500 outline-none"
                  placeholder="Enter URL to share"
                  style={{ color: 'var(--foreground)' }}
                />
                <button
                  onClick={handleSubmit}
                  disabled={!url.trim() || !isValidUrl || isSubmitting}
                  className="text-white rounded-full px-6 py-2 font-bold transition-all transform hover:scale-105 disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed flex items-center space-x-2"
                  style={{
                    background: 'var(--primary)',
                    ':hover': { background: 'var(--primary-hover)' }
                  }}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <span>Posting...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                      <span>Tweet</span>
                    </>
                  )}
                </button>
              </div>
              {!isValidUrl && url.length > 0 && (
                <p className="text-sm mt-2 flex items-center space-x-1" style={{ color: 'var(--error)' }}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Please enter a valid URL</span>
                </p>
              )}
            </div>
          </div>

          {/* Status Messages */}
          <AnimatePresence>
            {submitStatus && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className={`mt-4 p-4 rounded-xl text-center flex items-center justify-center space-x-2 ${
                  submitStatus === 'success'
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                    : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                }`}
              >
                {submitStatus === 'success' ? (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Tweet added successfully!</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Error submitting tweet. Please try again.</span>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}