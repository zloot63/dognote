"use client";

import { ReactNode } from "react";
import { X } from "lucide-react";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: ReactNode;
    fullScreen?: boolean; // ✅ 풀스크린 옵션 추가
}

export default function Modal({ isOpen, onClose, children, title, fullScreen = true }: ModalProps) {

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className={`bg-white shadow-lg transition-all duration-300 
                    ${fullScreen ? "w-full h-full rounded-none" : "w-[90%] max-w-2xl p-6 rounded-lg"}
                `}>
                {/* ✅ 모달 헤더 */}
                <div className="flex justify-between items-center border-b pb-3">
                    <h2 className="text-lg font-semibold">{title}</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl"><X size={24} /></button>
                </div>

                {/* ✅ 모달 내용 */}
                <div className={`mt-4 ${fullScreen ? "h-[calc(100%-3rem)] overflow-auto" : ""}`}>
                    {children}
                </div>
            </div>
        </div>
    );
}