import React from "react";
import Card from "@/components/ui/Card";
import styles from "./styles.module.css";

interface SkeletonProps {
  count?: number;
  className?: string;
  containerClassName?: string;
  layout?: "grid" | "related" | "default" | "cartIcon" | "cartEmpty";
}

const Skeleton: React.FC<SkeletonProps> = ({
  count = 1,
  className = "",
  containerClassName = "",
  layout = "default",
}) => {
  let containerStyle = "";
  if (layout === "grid") containerStyle = styles.grid;
  else if (layout === "related") containerStyle = styles.relatedProductsGrid;

  if (layout === "cartIcon") {
    return (
      <div className={`${styles.cartIconSkeleton} ${className}`}>
        <div className={styles.cartIconPulse}></div>
      </div>
    );
  }

  if (layout === "cartEmpty") {
    return (
      <div className={`${styles.cartEmptyContainer} ${className}`}>
        <div className={styles.cartEmptyContentWrapper}>
          <div className={styles.cartEmptyItemsSection}>
            <div className={styles.cartEmptyPageTitle} />
            <div
              className={`${styles.cartEmptySkeleton} ${containerClassName}`}
            >
              <div className={styles.cartEmptyPulse}></div>
              <div className={styles.cartEmptyPulse}></div>
              <div className={styles.cartEmptyPulse}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${containerStyle} ${containerClassName}`}>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className={layout === "grid" ? styles.gridItem : undefined}
        >
          <Card className={`${styles.skeleton} ${className}`}>
            <div className={styles.skeletonImage} />
            <div className={styles.skeletonTitle} />
            <div className={styles.skeletonPrice} />
            <div className={styles.skeletonDescription} />
            <div className={styles.skeletonButton} />
          </Card>
        </div>
      ))}
    </div>
  );
};

export default Skeleton;
