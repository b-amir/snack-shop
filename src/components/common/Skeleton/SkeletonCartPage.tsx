import React from "react";
import styles from "./styles.module.css";
import { SkeletonCartPageProps } from "./types";

export const SkeletonCartPage: React.FC<SkeletonCartPageProps> = ({
  className = "",
  containerClassName = "",
}) => {
  return (
    <div className={`${styles.cartPageContainer} ${className}`}>
      <div className={styles.cartPageContentWrapper}>
        <div className={styles.cartPageItemsSection}>
          <div className={styles.cartPagePageTitle} />
          <div className={`${styles.cartPageSkeleton} ${containerClassName}`}>
            <div className={styles.cartPagePulse}></div>
            <div className={styles.cartPagePulse}></div>
            <div className={styles.cartPagePulse}></div>
          </div>
        </div>
      </div>
    </div>
  );
};
