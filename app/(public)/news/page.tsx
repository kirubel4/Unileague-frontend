
const NEWS = [
  {
    id: 1,
    title: "Championship Final Set for December 15th",
    summary: "The most anticipated match of the season approaches.",
    date: "2 hours ago",
    tag: "Breaking",
  },
  {
    id: 2,
    title: "Star Player Joins Software FC",
    summary: "Major signing strengthens the squad.",
    date: "5 hours ago",
    tag: "Transfer",
  },
];

export default function NewsPage() {
  return (
    <div className="max-w-5xl mx-auto py-12 px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {NEWS.map((item) => (
          <div key={item.id} className="bg-white rounded-lg shadow p-6">
            <span className="inline-block mb-2 px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-700">
              {item.tag}
            </span>
            <h2 className="text-xl font-semibold mb-2">{item.title}</h2>
            <p className="mb-2 text-gray-600">{item.summary}</p>
            <div className="text-sm text-gray-400">{item.date}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
