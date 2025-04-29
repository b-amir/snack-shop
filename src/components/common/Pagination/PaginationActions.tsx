"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { PaginationActionsProps } from "./types";
import { calculatePageRange } from "./utils";
import { PaginationDisplay } from "./PaginationDisplay";

export function PaginationActions({
  currentPage,
  totalPages,
  locale,
}: PaginationActionsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const pageNumbers = calculatePageRange(currentPage, totalPages);

  if (pageNumbers.length === 0) return null;

  const createQueryString = (name: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(name, value);
    return params.toString();
  };

  const handlePageChange = (page: number) => {
    if (isPending || page < 1 || page > totalPages) return;
    startTransition(() => {
      router.push(pathname + "?" + createQueryString("page", String(page)));
    });
  };

  return (
    <PaginationDisplay
      pageNumbers={pageNumbers}
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={handlePageChange}
      isPending={isPending}
      locale={locale}
    />
  );
}
