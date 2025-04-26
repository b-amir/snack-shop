import { useState, ChangeEvent } from "react";

export function useProductFilters(
  initialPageSize = 8,
  initialSort = "date_desc"
) {
  const [sort, setSort] = useState(initialSort);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [page, setPage] = useState(1);

  function handleSortChange(e: ChangeEvent<HTMLSelectElement>) {
    setSort(e.target.value);
    setPage(1);
  }

  function handlePageSizeChange(e: ChangeEvent<HTMLSelectElement>) {
    setPageSize(Number(e.target.value));
    setPage(1);
  }

  function handlePageChange(newPage: number) {
    if (newPage >= 1) {
      setPage(newPage);
    }
  }

  return {
    sort,
    pageSize,
    page,
    handleSortChange,
    handlePageSizeChange,
    handlePageChange,
  };
}
