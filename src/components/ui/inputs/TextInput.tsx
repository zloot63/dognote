import React from "react";
import styles from "./TextInput.module.scss";
import clsx from "clsx";

import { TextInputProps } from "@/types/ui"; // ✅ 타입을 분리하여 관리

const TextInput = ({ 
  label, 
  placeholder, 
  value, 
  onChange, 
  type = "text", 
  disabled = false, 
  error, 
  fullWidth = false, 
  className 
}: TextInputProps) => {
  return (
    <div className={clsx(styles.wrapper, { [styles.fullWidth]: fullWidth }, className)}>
      {label && <label className={styles.label}>{label}</label>}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={clsx(styles.input, { [styles.error]: error })}
        aria-label={label || placeholder} // ✅ 접근성 고려
      />
      {error && <p className={styles.errorMessage}>{error}</p>}
    </div>
  );
};

export default TextInput;
