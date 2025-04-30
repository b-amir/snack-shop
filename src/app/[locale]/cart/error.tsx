"use client";

import { ErrorBoundaryFallback } from "@/components/common/ErrorBoundaryFallback";

export default function CartErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <ErrorBoundaryFallback error={error} reset={reset} />;
}
