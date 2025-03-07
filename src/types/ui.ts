export type ButtonVariant = "primary" | "secondary" | "outline" | "danger";
export type ButtonSize = "small" | "medium" | "large";

export interface ButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    variant?: ButtonVariant;
    size?: ButtonSize;
    disabled?: boolean;
    className?: string;
    fullWidth?: boolean;
}

export interface TextInputProps {
    label?: string;
    placeholder?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    type?: "text" | "password" | "email" | "number";
    disabled?: boolean;
    error?: string;
    fullWidth?: boolean;
    className?: string;
}

export interface Option {
    value: string | number;
    label: string;
}

export interface SelectProps {
    options?: Option[]; // ✅ 옵션 배열 (기본값은 빈 배열)
    onChange: (option: Option) => void; // 선택 시 실행할 함수
    value?: Option; // 현재 선택된 값
    placeholder?: string; // 플레이스홀더 텍스트
    disabled?: boolean; // 비활성화 여부
    className?: string; // 추가적인 스타일링을 위한 className
}

export type DropdownProps = {
    options: Option[];
    selected?: Option | null;
    onChange: (option: Option) => void;
    placeholder?: string;
    className?: string;
};

export interface CheckboxProps {
    id: string;
    label?: string;
    checked: boolean;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    disabled?: boolean;
    className?: string;
}


