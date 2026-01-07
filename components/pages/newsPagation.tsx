// components/news/NewsPagination.tsx
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface PaginationData {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}

interface NewsPaginationProps {
  pagination: PaginationData;
  onPageChange: (page: number) => void;
}

export default function NewsPagination({
  pagination,
  onPageChange,
}: NewsPaginationProps) {
  const getVisiblePages = () => {
    const current = pagination.page;
    const total = pagination.totalPages;
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (let i = 1; i <= total; i++) {
      if (
        i === 1 ||
        i === total ||
        (i >= current - delta && i <= current + delta)
      ) {
        range.push(i);
      }
    }

    let prev = 0;
    for (const i of range) {
      if (i - prev > 1) {
        rangeWithDots.push("ellipsis");
      }
      rangeWithDots.push(i);
      prev = i;
    }

    return rangeWithDots;
  };

  if (pagination.totalItems === 0 || pagination.totalPages <= 1) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 mb-16">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-sm text-gray-600">
          Showing{" "}
          <span className="font-medium">
            {(pagination.page - 1) * pagination.limit + 1}
          </span>{" "}
          to{" "}
          <span className="font-medium">
            {Math.min(
              pagination.page * pagination.limit,
              pagination.totalItems
            )}
          </span>{" "}
          of <span className="font-medium">{pagination.totalItems}</span>{" "}
          articles
        </div>

        <Pagination className="justify-end">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => onPageChange(Math.max(pagination.page - 1, 1))}
                className={
                  pagination.page <= 1
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer hover:bg-accent"
                }
              />
            </PaginationItem>

            {getVisiblePages().map((pageNum, index) => (
              <PaginationItem key={index}>
                {pageNum === "ellipsis" ? (
                  <PaginationEllipsis />
                ) : (
                  <PaginationLink
                    isActive={pagination.page === pageNum}
                    onClick={() =>
                      typeof pageNum === "number" && onPageChange(pageNum)
                    }
                    className="cursor-pointer hover:bg-accent"
                  >
                    {pageNum}
                  </PaginationLink>
                )}
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                onClick={() =>
                  onPageChange(
                    Math.min(pagination.page + 1, pagination.totalPages)
                  )
                }
                className={
                  pagination.page >= pagination.totalPages
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer hover:bg-accent"
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
