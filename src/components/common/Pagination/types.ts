export type PageNumber = number | "ellipsis";

export type PaginationDisplayProps = {
  pageNumbers: PageNumber[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isPending?: boolean;
  locale: string;
};

export type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  locale: string;
};

export type PaginationActionsProps = {
  currentPage: number;
  totalPages: number;
  locale: string;
};
