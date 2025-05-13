import Image from 'next/image';
import { useState, useEffect } from 'react';

export default function Tweet({ tweet }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
  return (
    <a href={tweet.originalUrl} target="_blank" rel="noopener noreferrer">
      <article className="border-b border-gray-200 p-4 cursor-pointer">
      <div className="flex space-x-3">
        <div className="flex-shrink-0">
          <Image
            src={tweet.author.avatar}
            alt={tweet.author.name}
            width={48}
            height={48}
            className="rounded-full"
          />
        </div>
        <div className="flex-1">
          <div className="flex items-center space-x-1">
            <h2 className="font-bold">{tweet.author.name}</h2>
            {tweet.author.verified && (
              <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .494.083.964.237 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484zm-6.616-3.334l-4.334 6.5c-.145.217-.382.334-.625.334-.143 0-.288-.04-.416-.126l-.115-.094-2.415-2.415c-.293-.293-.293-.768 0-1.06s.768-.294 1.06 0l1.77 1.767 3.825-5.74c.23-.345.696-.436 1.04-.207.346.23.44.696.21 1.04z"/>
              </svg>
            )}
            <span className="text-gray-500">{tweet.author.username}</span>
            <span className="text-gray-500">·</span>
            <span className="text-gray-500">{tweet.timestamp}</span>
          </div>
          <p className="mt-1">{tweet.text}</p>
          {tweet.media && tweet.media.length > 0 && (
            <div className={`grid gap-2 mt-3 ${tweet.media.length === 1 ? 'grid-cols-1' : 'grid-cols-2'} rounded-2xl overflow-hidden`}>
              {tweet.media.map((media, index) => (
                <div key={index} className="relative aspect-square overflow-hidden">
                  {media.type === 'gif' ? (
                    isClient ? (
                      <video
                        src={media.url}
                        alt="Tweet GIF"
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-100 animate-pulse" />
                    )
                  ) : (
                    <Image
                      src={media.url}
                      alt="Tweet media"
                      fill
                      className="object-cover"
                    />
                  )}
                </div>
              ))}
            </div>
          )}
          <div className="flex justify-between mt-3 text-gray-500 max-w-md">
            <button className="flex items-center space-x-2 hover:text-blue-500">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span>{tweet.metrics.reply_count}</span>
            </button>
            <button className="flex items-center space-x-2 hover:text-green-500">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>{tweet.metrics.retweet_count}</span>
            </button>
            <button className="flex items-center space-x-2 hover:text-red-500">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span>{tweet.metrics.like_count}</span>
            </button>
            <button className="flex items-center space-x-2 hover:text-blue-500">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <span>{tweet.metrics.impression_count}</span>
            </button>
          </div>
        </div>
      </div>
    </article>
    </a>
  );
}