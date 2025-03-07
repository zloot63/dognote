import React from "react";
import styles from "./Select.module.scss";
import { SelectProps, Option } from "@/types/ui";
import clsx from "clsx";

const Select = ({
  options = [],
  onChange,
  value,
  placeholder = "선택하세요",
  disabled = false,
  className
}: SelectProps) => {

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value;
    const selectedOption: Option | undefined = options.find((opt: Option) => opt.value.toString() === selectedValue);

    if (selectedOption) {
      onChange(selectedOption);
    }
  };

  return (
    <div className={clsx(styles.selectWrapper, className)}>
      <select
        className={styles.select}
        onChange={handleChange}
        value={value ? value.value.toString() : ""}
        disabled={disabled}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((option: Option) => (
          <option key={option.value.toString()} value={option.value.toString()}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Select;