import React from "react";
import { PaginationProps } from "./types";
import { calculatePageRange } from "./utils";
import { PaginationDisplay } from "./PaginationDisplay";

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  locale,
}: PaginationProps) {
  const pageNumbers = calculatePageRange(currentPage, totalPages);

  if (pageNumbers.length === 0) return null;

  return (
    <PaginationDisplay
      pageNumbers={pageNumbers}
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={onPageChange}
      locale={locale}
    />
  );
}
