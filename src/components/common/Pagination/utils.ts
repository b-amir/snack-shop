import { PageNumber } from "./types";

export function calculatePageRange(
  currentPage: number,
  totalPages: number,
  maxPagesToShow: number = 5
): PageNumber[] {
  if (totalPages <= 1) return [];
  if (totalPages <= maxPagesToShow) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pageNumbers: PageNumber[] = [];
  const halfPagesToShow = Math.floor(maxPagesToShow / 2);

  let startPage = Math.max(1, currentPage - halfPagesToShow);
  let endPage = Math.min(totalPages, currentPage + halfPagesToShow);

  if (currentPage - halfPagesToShow <= 1) {
    endPage = maxPagesToShow - 1;
    startPage = 1;
  }

  if (currentPage + halfPagesToShow >= totalPages) {
    startPage = totalPages - maxPagesToShow + 2;
    endPage = totalPages;
  }

  pageNumbers.push(1);

  if (startPage > 2) {
    pageNumbers.push("ellipsis");
  }

  for (let i = startPage; i <= endPage; i++) {
    if (i > 1 && i < totalPages) {
      pageNumbers.push(i);
    }
  }

  if (endPage < totalPages - 1) {
    pageNumbers.push("ellipsis");
  }

  if (totalPages > 1) {
    pageNumbers.push(totalPages);
  }

  return pageNumbers;
}
