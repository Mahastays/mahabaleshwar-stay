'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, Home, Settings, LogOut, CheckCircle, Shield, MapPin } from 'lucide-react';
import { useState, useEffect } from 'react';
import api from '@/lib/api';

export default function AdminSidebar() {
  const pathname = usePathname();
  const [pendingCount, setPendingCount] = useState<number>(0);

  useEffect(() => {
    const fetchPendingCounts = async () => {
      try {
        const [propsRes, vendorsRes] = await Promise.all([
          api.get('/properties/admin/all'),
          api.get('/vendors/admin/requests').catch(() => ({ data: [] }))
        ]);
        const pendingProps = propsRes.data.filter((p: any) => p.status === 'pending').length;
        const pendingVendors = vendorsRes.data.filter((v: any) => v.status === 'pending').length;
        setPendingCount(pendingProps + pendingVendors);
      } catch (err) {
        // Ignore silently
      }
    };
    fetchPendingCounts();
  }, []);

  const getLinkClasses = (path: string) => {
    const isActive = pathname === path;
    if (isActive) {
      return "flex items-center gap-3 px-3 py-2.5 bg-indigo-900/80 text-white rounded-lg shadow-sm border border-indigo-800/50";
    }
    return "flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-indigo-900/50 hover:text-white transition-colors text-indigo-100";
  };

  const getApprovalsLinkClasses = (path: string) => {
    const isActive = pathname === path;
    if (isActive) {
      return "flex items-center justify-between px-3 py-2.5 bg-indigo-900/80 text-white rounded-lg shadow-sm border border-indigo-800/50";
    }
    return "flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-indigo-900/50 hover:text-white transition-colors text-indigo-100";
  };

  return (
    <aside className="w-64 bg-indigo-950 flex-shrink-0 min-h-screen flex flex-col text-indigo-100 border-r border-indigo-900 shadow-xl">
      <div className="h-16 flex items-center px-6 bg-indigo-950 border-b border-indigo-900/50">
        <Link href="/admin" className="flex items-center gap-2 font-bold text-lg text-white tracking-tight">
          <Shield className="w-6 h-6 text-indigo-400" />
          <span>Admin Hub</span>
        </Link>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        <Link href="/admin" className={getLinkClasses('/admin')}>
          <LayoutDashboard className="w-5 h-5" />
          <span className="font-medium text-sm">Overview</span>
        </Link>
        <Link href="/admin/users" className={getLinkClasses('/admin/users')}>
          <Users className="w-5 h-5" />
          <span className="font-medium text-sm">Users & Vendors</span>
        </Link>
        <Link href="/admin/properties" className={getLinkClasses('/admin/properties')}>
          <Home className="w-5 h-5" />
          <span className="font-medium text-sm">All Properties</span>
        </Link>
        <Link href="/admin/approvals" className={getApprovalsLinkClasses('/admin/approvals')}>
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium text-sm">Approvals</span>
          </div>
          {pendingCount > 0 && (
            <span className="bg-indigo-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">{pendingCount}</span>
          )}
        </Link>
        <Link href="/admin/explore" className={getLinkClasses('/admin/explore')}>
          <MapPin className="w-5 h-5" />
          <span className="font-medium text-sm">Explore Places</span>
        </Link>
        <Link href="/admin/experiences" className={getLinkClasses('/admin/experiences')}>
          <MapPin className="w-5 h-5" />
          <span className="font-medium text-sm">Experiences</span>
        </Link>
        <Link href="/admin/settings" className={getLinkClasses('/admin/settings')}>
          <Settings className="w-5 h-5" />
          <span className="font-medium text-sm">Platform Settings</span>
        </Link>
      </nav>

      <div className="p-4 border-t border-indigo-900">
        <Link href="/admin-login" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-indigo-200 hover:bg-indigo-900 hover:text-white transition-colors">
          <LogOut className="w-5 h-5" />
          <span className="font-medium text-sm">Logout</span>
        </Link>
      </div>
    </aside>
  );
}
