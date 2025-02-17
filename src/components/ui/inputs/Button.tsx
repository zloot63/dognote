import React from "react";
import styles from "./Button.module.scss";
import { ButtonProps } from "@/types/ui";
import clsx from "clsx";

const Button = ({ children, onClick, variant = "primary", size = "medium", disabled = false, className, fullWidth = false }: ButtonProps) => {
  return (
    <button
      type="button"
      className={clsx(styles.button, styles[variant], styles[size], fullWidth && styles.fullWidth, className)}
      onClick={onClick}
      disabled={disabled}
      aria-label={typeof children === "string" ? children : undefined} // 텍스트 버튼일 때 자동 적용
    >
      {children}
    </button>
  );
};

export default Button;