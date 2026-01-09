// components/news/NewsLoadingState.tsx
export default function NewsLoadingState() {
  return (
    <div className="mb-16">
      <div className="flex flex-col items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-gray-600">Loading news articles...</p>
      </div>
    </div>
  );
}
