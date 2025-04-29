import React from "react";
import Card from "@/components/ui/Card";
import styles from "./styles.module.css";
import { SkeletonProductCardProps } from "./types";

export const SkeletonProductCard: React.FC<SkeletonProductCardProps> = ({
  className = "",
}) => {
  return (
    <Card className={`${styles.skeleton} ${className}`}>
      <div className={styles.skeletonImage} />
      <div className={styles.skeletonTitle} />
      <div className={styles.skeletonPrice} />
      <div className={styles.skeletonDescription} />
      <div className={styles.skeletonButton} />
    </Card>
  );
};
