"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Modal from "@/components/common/Modal"; // ✅ 공통 모달 사용
import WalkDetail from "./WalkDetail";

interface WalkDetailModalProps {
    walkId: string;
    isOpen: boolean;
    onClose: () => void;
}

export default function WalkDetailModal({ walkId, isOpen, onClose }: WalkDetailModalProps) {
    const router = useRouter();

    useEffect(() => {
        if (isOpen) {
            const handleBack = () => {
                onClose();
                router.back();
            };

            window.history.pushState(null, "", `/walks/details/${walkId}`);
            window.addEventListener("popstate", handleBack);

            return () => {
                window.removeEventListener("popstate", handleBack);
            };
        }
    }, [isOpen, onClose, router, walkId]);

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="🐾 산책 상세 정보" fullScreen={true}>
            <WalkDetail walkId={walkId} />
        </Modal>
    );
}