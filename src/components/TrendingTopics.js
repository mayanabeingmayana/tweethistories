import { trends } from '../data/data';

export default function TrendingTopics() {
  return (
    <div className="bg-gray-50 rounded-xl p-4">
      <h2 className="font-bold text-xl mb-4">What's happening</h2>
      <div className="space-y-4">
        {trends.map((trend) => (
          <div key={trend.id} className="cursor-pointer hover:bg-gray-100 transition-colors p-2 rounded">
            <div className="font-bold">{trend.topic}</div>
            <div className="text-sm text-gray-500">{trend.tweetCount} Tweets</div>
          </div>
        ))}
      </div>
      <a
        href="#"
        className="text-blue-500 hover:text-blue-600 block mt-4 text-sm"
      >
        Show more
      </a>
    </div>
  );
}