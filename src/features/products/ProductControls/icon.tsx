import React from "react";

interface IconProps {
  className?: string;
}

export function SortIcon({ className = "" }: IconProps) {
  return (
    <svg
      className={className}
      width="18"
      height="18"
      viewBox="0 0 1920 1920"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1549.418 299.605V1429.62l203.915-204.032L1920 1392.255l-488.451 488.57-488.57-488.57 166.668-166.667 204.032 204.032V299.605h235.74ZM488.57 160l488.57 488.57-166.67 166.548-204.031-203.914v1129.898h-235.74V611.204L166.668 815.12 0 648.569 488.57 160Z"
        fillRule="evenodd"
      />
    </svg>
  );
}

export function GridViewIcon({ className = "" }: IconProps) {
  return (
    <svg
      className={className}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="4" y="4" width="7" height="7" rx="1" />
      <rect x="4" y="13" width="7" height="7" rx="1" />
      <rect x="13" y="4" width="7" height="7" rx="1" />
      <rect x="13" y="13" width="7" height="7" rx="1" />
    </svg>
  );
}
