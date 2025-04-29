import React from "react";
import styles from "./styles.module.css";
import { SkeletonCartIconProps } from "./types";

export const SkeletonCartIcon: React.FC<SkeletonCartIconProps> = ({
  className = "",
}) => {
  return (
    <div className={`${styles.cartIconSkeleton} ${className}`}>
      <div className={styles.cartIconPulse}></div>
    </div>
  );
};
