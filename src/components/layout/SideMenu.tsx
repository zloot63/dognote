'use client';

import { useAuth } from '@/hooks/useAuthSupabase';
import { X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface SideMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SideMenu({ isOpen, onClose }: SideMenuProps) {
  const { user, isAuthenticated, logout } = useAuth();

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-40"
      onClick={onClose}
    >
      <aside
        className="fixed top-0 left-0 h-full w-64 bg-white shadow-lg p-5 flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="self-end text-gray-600 hover:text-gray-800"
        >
          <X size={24} />
        </button>

        {/* ✅ 사용자 프로필 (로그인한 경우만 표시) */}
        {isAuthenticated && user && (
          <div className="mt-5 flex flex-col items-center text-center">
            <Image
              src={user.image || '/default-avatar.png'}
              alt="사용자 프로필 이미지"
              width={60}
              height={60}
              className="rounded-full border border-gray-300"
            />
            <p className="mt-2 font-semibold">{user.name || '사용자'}</p>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
        )}

        {/* ✅ 메뉴 항목 */}
        <nav className="mt-8 flex-grow">
          <ul className="space-y-4">
            <li className="mb-3">
              <Link href="/dashboard">
                <span className="cursor-pointer text-blue-500 hover:underline">
                  🏠 대시보드
                </span>
              </Link>
            </li>
            <li className="mb-3">
              <Link href="/walks">
                <span className="cursor-pointer text-blue-500 hover:underline">
                  🚶 산책 정보
                </span>
              </Link>
            </li>
            <li>
              <Link href="/settings">
                <span className="cursor-pointer text-blue-500 hover:underline">
                  ⚙️ 설정
                </span>
              </Link>
            </li>
            <li>
              <button className="w-full text-left text-gray-700 hover:text-gray-900">
                📋 내 일정
              </button>
            </li>
            <li>
              <button className="w-full text-left text-gray-700 hover:text-gray-900">
                🏥 건강 기록
              </button>
            </li>
            <li>
              <button className="w-full text-left text-gray-700 hover:text-gray-900">
                🐾 산책 기록
              </button>
            </li>
            <li>
              <button className="w-full text-left text-gray-700 hover:text-gray-900">
                🏠 커뮤니티
              </button>
            </li>
          </ul>
        </nav>

        {/* ✅ 로그아웃 버튼 */}
        {isAuthenticated && (
          <button
            onClick={logout}
            className="mt-auto w-full text-left text-red-600 hover:text-red-800 font-semibold"
          >
            🚪 로그아웃
          </button>
        )}
      </aside>
    </div>
  );
}
