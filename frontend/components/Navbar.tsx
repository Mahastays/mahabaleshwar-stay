'use client';

import { Search, Globe, Menu, UserRound, LogOut, Luggage } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import api from '@/lib/api';

export default function Navbar() {
  const { user, loading, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Close menu on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const initials = user?.name ? user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2) : null;

  return (
    <div className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm pt-4 pb-6">
      <div className="max-w-[2520px] mx-auto xl:px-20 md:px-10 sm:px-2 px-4">
        {/* Top Row */}
        <div className="flex justify-between items-center mb-6 min-h-[64px] md:min-h-[80px]">
          {/* Logo */}
          <div className="flex-shrink-0 flex-1 flex items-center">
            <Link href="/" className="flex items-center">
              <img 
                src="/logo_cropped.png" 
                alt="MahaStays Logo" 
                className="h-10 md:h-14 w-auto object-contain cursor-pointer" 
              />
            </Link>
          </div>

          {/* Toggles */}
          <div className="hidden md:flex flex-1 items-center justify-center space-x-6">
            <Link href="/" className={`flex items-center space-x-2 cursor-pointer transition ${pathname === '/' ? 'text-gray-900 font-semibold border-b-[3px] border-gray-900 pb-1' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-full px-4 py-2 font-medium'}`}>
               <span className="text-[16px]">Homes</span>
            </Link>
            <Link href="/explore" className={`flex items-center space-x-2 cursor-pointer transition ${pathname === '/explore' ? 'text-gray-900 font-semibold border-b-[3px] border-gray-900 pb-1' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-full px-4 py-2 font-medium'}`}>
               <span className="text-[16px]">Explore</span>
            </Link>
            <Link href="/experiences" className={`flex items-center space-x-2 cursor-pointer transition ${pathname === '/experiences' ? 'text-gray-900 font-semibold border-b-[3px] border-gray-900 pb-1' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-full px-4 py-2 font-medium'}`}>
               <span className="text-[16px]">Experiences</span>
            </Link>
          </div>

          {/* Profile Section */}
          <div className="flex-1 flex items-center justify-end space-x-2 relative" ref={menuRef}>
            {user && (user.role === 'host' || user.role === 'admin') && (
              <Link href="/vendor" className="hidden md:block text-sm font-semibold hover:bg-gray-100 px-4 py-2 rounded-full cursor-pointer transition">
                Host Dashboard
              </Link>
            )}
            {user && user.role === 'admin' && (
              <Link href="/admin" className="p-3 hover:bg-gray-100 rounded-full cursor-pointer transition text-gray-900" title="Admin Panel">
                <Globe size={18} />
              </Link>
            )}
            {(!user || user.role === 'user') && !loading && (
              <Link href="/become-host" className="hidden md:block text-sm font-semibold hover:bg-gray-100 px-4 py-2 rounded-full cursor-pointer transition text-left">
                Become a host
              </Link>
            )}

            {/* User Menu Button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center space-x-2 border border-gray-300 rounded-full p-2 pl-3 ml-2 hover:shadow-md transition cursor-pointer bg-white"
            >
              <Menu size={18} />
              {user && initials ? (
                <div className="bg-brand-red text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-xs ml-1">
                  {initials}
                </div>
              ) : (
                <div className="bg-gray-500 text-white rounded-full p-1 ml-1 border border-white">
                  <UserRound size={20} />
                </div>
              )}
            </button>

            {/* Dropdown Menu */}
            {menuOpen && (
              <div className="absolute right-0 top-14 bg-white border border-gray-200 rounded-xl shadow-xl w-56 py-2 z-50">
                <div className="md:hidden border-b border-gray-100 mb-1 pb-1">
                  <Link href="/" onClick={() => setMenuOpen(false)} className="block px-4 py-3 text-sm font-semibold text-gray-900 hover:bg-gray-50 transition-colors">
                    Homes
                  </Link>
                  <Link href="/explore" onClick={() => setMenuOpen(false)} className="block px-4 py-3 text-sm font-semibold text-gray-900 hover:bg-gray-50 transition-colors">
                    Explore
                  </Link>
                  <Link href="/experiences" onClick={() => setMenuOpen(false)} className="block px-4 py-3 text-sm font-semibold text-gray-900 hover:bg-gray-50 transition-colors">
                    Experiences
                  </Link>
                </div>
                {user ? (
                  <>
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="font-semibold text-gray-900 text-sm">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email || user.phoneNumber}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 bg-gray-100 rounded-full text-[10px] font-bold uppercase tracking-wider text-gray-600">
                        {user.role}
                      </span>
                    </div>
                    <Link href="/bookings" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                      <Luggage size={16} /> My Trips
                    </Link>
                    <Link href="/profile" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                      <UserRound size={16} /> My Profile
                    </Link>
                    {(user.role === 'host' || user.role === 'admin') && (
                      <Link href="/vendor" onClick={() => setMenuOpen(false)} className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                        Host Dashboard
                      </Link>
                    )}
                    {user.role === 'user' && (
                      <Link href="/become-host" onClick={() => setMenuOpen(false)} className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                        Become a host
                      </Link>
                    )}
                    {user.role === 'admin' && (
                      <Link href="/admin" onClick={() => setMenuOpen(false)} className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                        Admin Panel
                      </Link>
                    )}
                    <div className="border-t border-gray-100 mt-1">
                      <button
                        onClick={() => { logout(); setMenuOpen(false); }}
                        className="flex items-center gap-2 w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut size={16} /> Log out
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <Link href="/login" onClick={() => setMenuOpen(false)} className="block px-4 py-3 text-sm font-semibold text-gray-900 hover:bg-gray-50 transition-colors">
                      Log in
                    </Link>
                    <Link href="/login" onClick={() => setMenuOpen(false)} className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                      Sign up
                    </Link>
                    <div className="border-t border-gray-100 mt-1 pt-1">
                      <Link href="/become-host" onClick={() => setMenuOpen(false)} className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                        Host your home
                      </Link>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Search Pill Row */}
        <div className="flex justify-center mt-2 md:mt-0">
            <form action="/search" className="max-w-[850px] w-full flex flex-col md:flex-row items-center bg-white border border-gray-300 rounded-3xl md:rounded-full shadow-md hover:shadow-lg transition-shadow duration-200 p-2 md:p-2 gap-2 md:gap-0">
              <div className="w-full md:flex-[1.5] flex flex-col px-4 md:px-8 border-b md:border-b-0 md:border-r border-gray-200 md:border-gray-300 hover:bg-gray-100 rounded-2xl md:rounded-full cursor-pointer transition py-2 md:py-1">
                <label htmlFor="query" className="text-[12px] font-extrabold text-gray-900 tracking-wide cursor-pointer">Where</label>
                <input type="text" id="query" name="query" placeholder="Search destinations" className="text-[14px] text-gray-900 placeholder-gray-500 truncate outline-none bg-transparent w-full" />
              </div>
              <div className="w-full md:flex-1 flex flex-col px-4 md:px-8 border-b md:border-b-0 md:border-r border-gray-200 md:border-gray-300 hover:bg-gray-100 rounded-2xl md:rounded-full cursor-pointer transition py-2 md:py-1">
                <label htmlFor="checkin" className="text-[12px] font-extrabold text-gray-900 tracking-wide cursor-pointer">When</label>
                <input type="date" min={new Date().toISOString().split('T')[0]} id="checkin" name="checkin" className="text-[14px] text-gray-900 placeholder-gray-500 truncate outline-none bg-transparent cursor-pointer w-full" />
              </div>
              <div className="w-full md:flex-[1.5] flex items-center justify-between px-4 md:pl-8 md:pr-2 hover:bg-gray-100 rounded-2xl md:rounded-full cursor-pointer transition py-2 md:py-1">
                <div className="flex flex-col flex-1">
                  <label htmlFor="guests" className="text-[12px] font-extrabold text-gray-900 tracking-wide cursor-pointer">Who</label>
                  <select id="guests" name="guests" className="text-[14px] text-gray-900 placeholder-gray-500 truncate outline-none bg-transparent cursor-pointer w-full">
                    <option value="">Add guests</option>
                    <option value="1">1 guest</option>
                    <option value="2">2 guests</option>
                    <option value="3">3 guests</option>
                    <option value="4+">4+ guests</option>
                  </select>
                </div>
                <button type="submit" className="bg-brand-red text-white rounded-full p-3 md:p-4 hover:bg-red-600 transition-colors cursor-pointer flex-shrink-0 ml-4">
                  <Search size={20} strokeWidth={3} />
                </button>
              </div>
            </form>
        </div>
      </div>
    </div>
  );
}
