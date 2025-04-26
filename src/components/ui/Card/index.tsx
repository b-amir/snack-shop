import React from "react";
import styles from "./styles.module.css";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ children, className, ...props }) => {
  return (
    <div className={`${styles.card} ${className || ""}`} {...props}>
      {children}
    </div>
  );
};

export default Card;
