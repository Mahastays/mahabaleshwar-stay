'use client';

import VendorSidebar from "@/components/VendorSidebar";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";

export default function VendorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  const initials = user?.name ? user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2) : 'H';

  return (
    <ProtectedRoute requiredRole="host">
      <div className="flex min-h-screen bg-gray-50">
        <VendorSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8">
            <h1 className="text-xl font-semibold text-gray-800">Overview</h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500 hidden sm:block">{user?.name || 'Host'}</span>
              <div className="w-8 h-8 rounded-full bg-brand-brown text-white flex items-center justify-center font-bold text-sm">
                {initials}
              </div>
            </div>
          </header>
          <main className="flex-1 p-8 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
