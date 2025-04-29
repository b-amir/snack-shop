// Define the possible layout options
export type SkeletonLayout =
  | "grid"
  | "related"
  | "default"
  | "cartIcon"
  | "cartPage";

// Props for the main Skeleton dispatcher component
export interface SkeletonProps {
  count?: number;
  className?: string; // Class applied to individual skeleton items or specific layout wrappers
  containerClassName?: string; // Class applied to the outermost container (e.g., grid)
  layout?: SkeletonLayout;
}

// Props specifically for the Product Card Skeleton
export interface SkeletonProductCardProps {
  className?: string; // Class applied to the Card component
}

// Props for the Cart Icon Skeleton
export interface SkeletonCartIconProps {
  className?: string; // Class applied to the main div wrapper
}

// Props for the Cart Page Skeleton
export interface SkeletonCartPageProps {
  className?: string; // Class applied to the outermost container
  containerClassName?: string; // Class applied to the inner skeleton items container
}
