import React from "react";
import styles from "./TextArea.module.scss";
import clsx from "clsx";

import { TextAreaProps } from "@/types/ui"; // ✅ 타입 분리하여 관리

const TextArea = ({ 
  label, 
  placeholder, 
  value, 
  onChange, 
  rows = 4, 
  disabled = false, 
  error, 
  maxLength, 
  fullWidth = false, 
  className 
}: TextAreaProps) => {
  return (
    <div className={clsx(styles.wrapper, { [styles.fullWidth]: fullWidth }, className)}>
      {label && <label className={styles.label}>{label}</label>}
      <textarea
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        rows={rows}
        disabled={disabled}
        maxLength={maxLength}
        className={clsx(styles.textarea, { [styles.error]: error })}
        aria-label={label || placeholder} // ✅ 접근성 고려
      />
      {maxLength && (
        <p className={styles.charCount}>
          {value.length} / {maxLength}
        </p>
      )}
      {error && <p className={styles.errorMessage}>{error}</p>}
    </div>
  );
};

export default TextArea;
