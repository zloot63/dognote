'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';
import queryClient from '@/lib/react-query'; // ✅ QueryClient 인스턴스 분리
import { Toaster } from '@/components/ui/Toaster';
import { Toaster as Sonner } from 'sonner';
import { AuthProvider } from '@/providers/AuthProvider';

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        {children}
        <Toaster />
        <Sonner
          position="top-center"
          toastOptions={{
            style: {
              background: 'white',
              color: 'black',
              border: '1px solid #e5e7eb',
            },
            className: 'sonner-toast',
          }}
        />
      </QueryClientProvider>
    </AuthProvider>
  );
}
