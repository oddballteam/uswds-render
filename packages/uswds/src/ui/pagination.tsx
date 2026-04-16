"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "../lib/cn";

function getPaginationRange(
  current: number,
  total: number,
): Array<number | "ellipsis"> {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  const pages: Array<number | "ellipsis"> = [];
  pages.push(1);
  if (current > 3) {
    pages.push("ellipsis");
  }
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }
  if (current < total - 2) {
    pages.push("ellipsis");
  }
  pages.push(total);
  return pages;
}

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange?: (page: number) => void;
  className?: string;
};

function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
}: PaginationProps) {
  const pages = getPaginationRange(currentPage, totalPages);

  return (
    <nav
      aria-label="Pagination"
      className={cn("flex items-center gap-1 font-sans", className)}
    >
      <button
        type="button"
        disabled={currentPage <= 1}
        onClick={() => onPageChange?.(currentPage - 1)}
        className="inline-flex items-center justify-center min-w-9 h-9 px-2 rounded-md text-primary hover:bg-primary-lighter disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Go to previous page"
      >
        <ChevronLeft className="size-4" aria-hidden="true" />
        <span className="sr-only sm:not-sr-only sm:ml-1">Previous</span>
      </button>

      {pages.map((page, idx) =>
        page === "ellipsis" ? (
          <span
            key={`ellipsis-${idx}`}
            className="px-2 text-base-dark"
            aria-hidden="true"
          >
            &hellip;
          </span>
        ) : (
          <button
            key={page}
            type="button"
            aria-current={page === currentPage ? "page" : undefined}
            onClick={() => onPageChange?.(page)}
            className={cn(
              "inline-flex items-center justify-center min-w-9 h-9 px-2 rounded-md",
              page === currentPage
                ? "bg-primary text-white"
                : "text-primary hover:bg-primary-lighter",
            )}
          >
            {page}
          </button>
        ),
      )}

      <button
        type="button"
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange?.(currentPage + 1)}
        className="inline-flex items-center justify-center min-w-9 h-9 px-2 rounded-md text-primary hover:bg-primary-lighter disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Go to next page"
      >
        <span className="sr-only sm:not-sr-only sm:mr-1">Next</span>
        <ChevronRight className="size-4" aria-hidden="true" />
      </button>
    </nav>
  );
}

export { Pagination, getPaginationRange };
