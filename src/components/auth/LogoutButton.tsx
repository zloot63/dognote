'use client';

import { useAuth } from '@/hooks/useAuth';

export default function LogoutButton() {
  const { logout } = useAuth();

  return (
    <button
      onClick={() => logout()}
      className="w-full px-6 py-3 bg-red-500 text-white font-semibold rounded-lg transition duration-300 ease-in-out transform hover:scale-105 shadow-md"
    >
      로그아웃
    </button>
  );
}
