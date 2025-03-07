import React, { useState } from "react";
import { DropdownProps, Option } from "@/types/ui";
import styles from "./Dropdown.module.scss";
import clsx from "clsx";

const Dropdown = ({ options, selected, onChange, placeholder, className }: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (option: Option) => {
    setIsOpen(false);
    onChange(option); 
  };

  return (
    <div className={clsx(styles.dropdown, className)}>
      <div className={styles.selected} onClick={() => setIsOpen(!isOpen)}>
        {selected?.label || placeholder || "선택하세요"}
      </div>
      {isOpen && (
        <ul className={styles.options}>
          {options.map((option) => (
            <li key={option.value} onClick={() => handleSelect(option)}>
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dropdown;
