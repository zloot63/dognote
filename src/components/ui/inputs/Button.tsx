import React from "react";
import styles from "./Button.module.scss";
import { ButtonProps } from "@/types/ui";
import clsx from "clsx";

const Button = ({ children, onClick, variant = "primary", size = "medium", disabled = false, className }: ButtonProps) => {
  return (
    <button
      className={clsx(styles.button, styles[variant], styles[size], className)}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;