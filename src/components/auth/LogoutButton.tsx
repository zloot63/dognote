"use client";

import { signOut } from "next-auth/react";

export default function LogoutButton() {
  return (
    <button
      onClick={() => signOut()}
      className="w-full px-6 py-3 bg-red-500 text-white font-semibold rounded-lg transition duration-300 ease-in-out transform hover:scale-105 shadow-md"
    >
      로그아웃
    </button>
  );
}
