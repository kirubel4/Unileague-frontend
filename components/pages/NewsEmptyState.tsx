// components/news/NewsEmptyState.tsx
import { Newspaper } from "lucide-react";

interface NewsEmptyStateProps {
  searchTerm: string;
  clearSearch: () => void;
}

export default function NewsEmptyState({
  searchTerm,
  clearSearch,
}: NewsEmptyStateProps) {
  return (
    <div className="text-center py-12">
      <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
        <Newspaper className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="font-medium text-gray-900 mb-2">
        {searchTerm ? "No articles found" : "No articles available"}
      </h3>
      <p className="text-sm text-gray-600 mb-4">
        {searchTerm
          ? `No articles match "${searchTerm}"`
          : "Check back later for news updates"}
      </p>
      {searchTerm && (
        <button
          onClick={clearSearch}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Clear search
        </button>
      )}
    </div>
  );
}
