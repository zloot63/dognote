'use client';

import { AuthProvider } from '@/providers/AuthProvider';
import { ReactNode } from 'react';

interface AuthSessionProviderProps {
  children: ReactNode;
}

export default function AuthSessionProvider({
  children,
}: AuthSessionProviderProps) {
  return <AuthProvider>{children}</AuthProvider>;
}
