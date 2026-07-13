import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Home, Calendar, Wallet, Settings, LogOut, MountainSnow, PlusCircle } from 'lucide-react';

export default function VendorSidebar() {
  const pathname = usePathname() || '';

  const getLinkClasses = (path: string) => {
    const isActive = pathname === path || (path !== '/vendor' && pathname.startsWith(path));
    if (isActive) {
      return "flex items-center gap-3 px-3 py-2.5 bg-teal-800/80 text-white rounded-lg shadow-sm";
    }
    return "flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-teal-800/50 hover:text-white transition-colors text-teal-100";
  };

  return (
    <aside className="w-64 bg-teal-950 flex-shrink-0 min-h-screen flex flex-col text-teal-100 border-r border-teal-900 shadow-xl">
      <div className="h-16 flex items-center px-6 bg-teal-950 border-b border-teal-900/50">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg text-white tracking-tight">
          <MountainSnow className="w-6 h-6 text-teal-400" />
          <span>Vendor Portal</span>
        </Link>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        <Link href="/vendor" className={pathname === '/vendor' ? "flex items-center gap-3 px-3 py-2.5 bg-teal-800/80 text-white rounded-lg shadow-sm" : "flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-teal-800/50 hover:text-white transition-colors text-teal-100"}>
          <LayoutDashboard className="w-5 h-5" />
          <span className="font-medium text-sm">Dashboard</span>
        </Link>
        <Link href="/vendor/properties" className={getLinkClasses('/vendor/properties')}>
          <Home className="w-5 h-5" />
          <span className="font-medium text-sm">My Properties</span>
        </Link>
        <Link href="/vendor/properties/add" className="flex items-center gap-3 px-3 py-2.5 bg-teal-700 text-white rounded-lg hover:bg-teal-600 transition-colors mt-2 mb-2 shadow-md">
          <PlusCircle className="w-5 h-5" />
          <span className="font-medium text-sm">Add Property</span>
        </Link>
        <Link href="/vendor/bookings" className={getLinkClasses('/vendor/bookings')}>
          <Calendar className="w-5 h-5" />
          <span className="font-medium text-sm">Bookings</span>
        </Link>
        <Link href="/vendor/earnings" className={getLinkClasses('/vendor/earnings')}>
          <Wallet className="w-5 h-5" />
          <span className="font-medium text-sm">Earnings</span>
        </Link>
        <Link href="/vendor/settings" className={getLinkClasses('/vendor/settings')}>
          <Settings className="w-5 h-5" />
          <span className="font-medium text-sm">Settings</span>
        </Link>
      </nav>

      <div className="p-4 border-t border-teal-900">
        <Link href="/login" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-teal-200 hover:bg-teal-900 hover:text-white transition-colors">
          <LogOut className="w-5 h-5" />
          <span className="font-medium text-sm">Logout</span>
        </Link>
      </div>
    </aside>
  );
}
