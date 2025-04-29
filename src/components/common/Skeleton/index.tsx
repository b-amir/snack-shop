import React from "react";
import styles from "./styles.module.css";
import { SkeletonProps } from "./types";
import { SkeletonProductCard } from "./SkeletonProductCard";
import { SkeletonCartIcon } from "./SkeletonCartIcon";
import { SkeletonCartPage } from "./SkeletonCartPage";

const Skeleton: React.FC<SkeletonProps> = ({
  count = 1,
  className = "",
  containerClassName = "",
  layout = "default",
}) => {
  if (layout === "cartIcon") {
    return <SkeletonCartIcon className={className} />;
  }

  if (layout === "cartPage") {
    return (
      <SkeletonCartPage
        className={className}
        containerClassName={containerClassName}
      />
    );
  }

  const wrapperClasses = [
    layout === "grid" ? styles.grid : "",
    layout === "related" ? styles.relatedProductsGrid : "",
    containerClassName,
  ]
    .filter(Boolean)
    .join(" ");

  const skeletons = Array.from({ length: count }).map((_, index) => (
    <div
      key={index}
      className={layout === "grid" ? styles.gridItem : undefined}
    >
      <SkeletonProductCard className={className} />
    </div>
  ));

  if (wrapperClasses) {
    return <div className={wrapperClasses}>{skeletons}</div>;
  }

  return <>{skeletons}</>;
};

export default Skeleton;
