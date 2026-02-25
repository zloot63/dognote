'use client';

import { useAuth } from '@/hooks/useAuthSupabase';

export default function UserProfile() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <div className="p-4 bg-white rounded-lg shadow-md w-80">
      {isAuthenticated && user ? (
        <div className="flex flex-col items-center">
          <img
            src={user.image || '/default-avatar.png'}
            alt="User Avatar"
            className="w-20 h-20 rounded-full"
          />
          <h2 className="mt-2 text-xl font-bold">{user.name}</h2>
          <p className="text-gray-500">{user.email}</p>
          <button
            onClick={logout}
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
          >
            로그아웃
          </button>
        </div>
      ) : (
        <p className="text-center text-gray-500">로그인이 필요합니다.</p>
      )}
    </div>
  );
}
