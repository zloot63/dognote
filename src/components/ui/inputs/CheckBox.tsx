import React from "react";
import styles from "./Checkbox.module.scss";
import { CheckboxProps } from "@/types/ui";
import clsx from "clsx";

const Checkbox = ({ id, label, checked, onChange, disabled = false, className }: CheckboxProps) => {
    return (
        <label className={clsx(styles.checkboxWrapper, className)}>
            <input
                type="checkbox"
                id={id}
                checked={checked}
                onChange={onChange}
                disabled={disabled}
                className={styles.checkbox}
                aria-checked={checked}
                aria-label={label}
            />
            <span className={styles.customCheckbox} />
            {label && <span className={styles.labelText}>{label}</span>}
        </label>
    );
};

export default Checkbox;
