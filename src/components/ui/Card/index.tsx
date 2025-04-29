import React from "react";
import styles from "./styles.module.css";
import { CardProps } from "./types";

const Card: React.FC<CardProps> = ({ children, className = "", ...props }) => {
  const cardClasses = [styles.card, className].filter(Boolean).join(" ");

  return (
    <div className={cardClasses} {...props}>
      {children}
    </div>
  );
};

export default Card;
