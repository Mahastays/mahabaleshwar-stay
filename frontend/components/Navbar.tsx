'use client';

import { Search, Globe, Menu, UserRound, LogOut, Luggage, X } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import api from '@/lib/api';

export default function Navbar() {
  const { user, loading, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileSearchModalOpen, setMobileSearchModalOpen] = useState(false);
  const [mobileQuery, setMobileQuery] = useState('');
  const [mobileCheckin, setMobileCheckin] = useState('');
  const [adults, setAdults] = useState(0);
  const [children, setChildren] = useState(0);
  const [guestDropdownOpen, setGuestDropdownOpen] = useState(false);
  const guestDropdownRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const totalGuests = adults + children;

  // Handle Scroll state
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu and guest dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
      if (guestDropdownRef.current && !guestDropdownRef.current.contains(e.target as Node)) {
        setGuestDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const initials = user?.name ? user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2) : null;

  return (
    <>
      <div className={`sticky top-0 z-50 bg-white pt-4 pb-2 md:pb-6 md:border-b-0 transition-all duration-300 ${isScrolled ? 'shadow-sm md:shadow-md border-b border-gray-200 pb-4 md:pb-6' : 'shadow-sm md:shadow-none border-b border-gray-100'}`}>
        <div className="max-w-[2520px] mx-auto xl:px-20 md:px-10 sm:px-2 px-4">
          {/* Top Row */}
          <div className="flex justify-between items-center min-h-[64px] md:min-h-[80px]">
          {/* Mobile Compact Search Pill (Absolute positioning over the top row) */}
          <div className={`md:hidden absolute left-4 right-4 top-3 transition-all duration-300 z-10 ${isScrolled ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}`}>
            <div className="flex items-center bg-white border border-gray-300 rounded-full shadow-md hover:shadow-lg active:scale-[0.97] px-4 py-2.5 w-full cursor-pointer transition-all duration-200" onClick={() => setMobileSearchModalOpen(true)}>
               <Search size={18} className="text-gray-900 mr-3 flex-shrink-0" strokeWidth={3} />
               <div className="flex flex-col flex-1">
                  <span className="text-[13px] font-bold text-gray-900">Start your search</span>
                  <span className="text-[11px] text-gray-500">Anywhere • Any week • {totalGuests > 0 ? `${totalGuests} guest${totalGuests > 1 ? 's' : ''}` : 'Add guests'}</span>
               </div>
            </div>
          </div>

          {/* Logo */}
          <div className={`flex-shrink-0 flex-1 flex items-center transition-opacity duration-300 ${isScrolled ? 'opacity-0 md:opacity-100 pointer-events-none md:pointer-events-auto' : 'opacity-100'}`}>
            <Link href="/" className="flex items-center">
              <img 
                src="/logo_cropped.png" 
                alt="MahaStays Logo" 
                className="h-8 md:h-11 w-auto object-contain cursor-pointer" 
              />
            </Link>
          </div>

          {/* Toggles / Center Area */}
          <div className="hidden md:flex flex-1 items-center justify-center space-x-6 relative">
            {/* Links with Icons (Unscrolled State) */}
            <div className={`flex items-center space-x-8 lg:space-x-12 transition-all duration-300 ${isScrolled ? 'opacity-0 scale-95 pointer-events-none absolute' : 'opacity-100 scale-100 relative'}`}>
               <Link href="/" className={`flex flex-col items-center justify-center space-y-1.5 cursor-pointer group transition-all duration-200 ${pathname === '/' ? 'text-gray-900 font-bold' : 'text-gray-500 hover:text-gray-900'}`}>
                 <div className="relative flex items-center justify-center">
                   <img src="/icon_homes.png" className={`w-11 h-11 lg:w-12 lg:h-12 object-contain transition-all duration-300 transform group-hover:-translate-y-1.5 group-hover:scale-115 drop-shadow-sm group-hover:drop-shadow-md ${pathname === '/' ? 'scale-110 -translate-y-0.5 drop-shadow-md opacity-100' : 'opacity-85 group-hover:opacity-100'}`} alt="Homes" />
                 </div>
                 <span className={`text-[14px] lg:text-[15px] transition-all duration-200 ${pathname === '/' ? 'border-b-[3px] border-gray-900 pb-1 font-bold' : 'group-hover:text-gray-900 font-medium'}`}>Homes</span>
               </Link>
               <Link href="/explore" className={`flex flex-col items-center justify-center space-y-1.5 cursor-pointer group transition-all duration-200 ${pathname === '/explore' ? 'text-gray-900 font-bold' : 'text-gray-500 hover:text-gray-900'}`}>
                 <div className="relative flex items-center justify-center">
                   <img src="/icon_explore.png" className={`w-11 h-11 lg:w-12 lg:h-12 object-contain transition-all duration-300 transform group-hover:-translate-y-1.5 group-hover:scale-115 drop-shadow-sm group-hover:drop-shadow-md ${pathname === '/explore' ? 'scale-110 -translate-y-0.5 drop-shadow-md opacity-100' : 'opacity-85 group-hover:opacity-100'}`} alt="Explore" />
                 </div>
                 <span className={`text-[14px] lg:text-[15px] transition-all duration-200 ${pathname === '/explore' ? 'border-b-[3px] border-gray-900 pb-1 font-bold' : 'group-hover:text-gray-900 font-medium'}`}>Explore</span>
               </Link>
               <Link href="/experiences" className={`flex flex-col items-center justify-center space-y-1.5 cursor-pointer group transition-all duration-200 ${pathname === '/experiences' ? 'text-gray-900 font-bold' : 'text-gray-500 hover:text-gray-900'}`}>
                 <div className="relative flex items-center justify-center">
                   <img src="/icon_experiences.png" className={`w-11 h-11 lg:w-12 lg:h-12 object-contain transition-all duration-300 transform group-hover:-translate-y-1.5 group-hover:scale-115 drop-shadow-sm group-hover:drop-shadow-md ${pathname === '/experiences' ? 'scale-110 -translate-y-0.5 drop-shadow-md opacity-100' : 'opacity-85 group-hover:opacity-100'}`} alt="Experiences" />
                 </div>
                 <span className={`text-[14px] lg:text-[15px] transition-all duration-200 ${pathname === '/experiences' ? 'border-b-[3px] border-gray-900 pb-1 font-bold' : 'group-hover:text-gray-900 font-medium'}`}>Experiences</span>
               </Link>
            </div>

            {/* Compact Search Pill (Scrolled State) */}
            <div className={`flex items-center bg-white border border-gray-300 rounded-full shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer pl-4 pr-2 py-2 w-[350px] ${isScrolled ? 'opacity-100 scale-100 relative' : 'opacity-0 scale-95 pointer-events-none absolute'}`} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
               <div className="flex-1 text-[13px] font-semibold truncate border-r border-gray-300 px-2 text-center text-gray-900">Anywhere</div>
               <div className="flex-1 text-[13px] font-semibold truncate border-r border-gray-300 px-2 text-center text-gray-900">Any week</div>
               <div className="flex-1 text-[13px] text-gray-500 truncate px-2 text-center">{totalGuests > 0 ? `${totalGuests} guest${totalGuests > 1 ? 's' : ''}` : 'Add guests'}</div>
               <div className="bg-brand-red text-white p-2 rounded-full ml-1">
                 <Search size={14} strokeWidth={3} />
               </div>
            </div>
          </div>

          {/* Profile Section */}
          <div className={`flex-1 flex items-center justify-end space-x-2 relative transition-opacity duration-300 ${isScrolled ? 'opacity-0 md:opacity-100 pointer-events-none md:pointer-events-auto' : 'opacity-100'}`} ref={menuRef}>
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
                  <Link href="/" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-gray-900 hover:bg-gray-50 active:bg-gray-100 transition-all group">
                    <img src="/icon_homes.png" className="w-8 h-8 object-contain transition-transform transform group-hover:scale-110 drop-shadow-sm" alt="Homes" />
                    <span className="text-[15px]">Homes</span>
                  </Link>
                  <Link href="/explore" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-gray-900 hover:bg-gray-50 active:bg-gray-100 transition-all group">
                    <img src="/icon_explore.png" className="w-8 h-8 object-contain transition-transform transform group-hover:scale-110 drop-shadow-sm" alt="Explore" />
                    <span className="text-[15px]">Explore</span>
                  </Link>
                  <Link href="/experiences" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-gray-900 hover:bg-gray-50 active:bg-gray-100 transition-all group">
                    <img src="/icon_experiences.png" className="w-8 h-8 object-contain transition-transform transform group-hover:scale-110 drop-shadow-sm" alt="Experiences" />
                    <span className="text-[15px]">Experiences</span>
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
    </div>
  </div>

  <div className={`bg-white z-40 relative transition-all duration-300 ease-in-out origin-top ${isScrolled ? 'overflow-hidden max-h-0 opacity-0 pb-0 pt-0 border-none' : 'overflow-visible max-h-[300px] opacity-100 pb-3 pt-1 md:pb-6 md:pt-0 border-b border-gray-200 shadow-sm'}`}>
        <div className="max-w-[2520px] mx-auto xl:px-20 md:px-10 sm:px-2 px-4">
          {/* Desktop Search Bar */}
          <div className="hidden md:flex justify-center md:mt-0">
            <form action="/search" className="max-w-[850px] w-full flex flex-col md:flex-row items-center bg-white border border-gray-300 rounded-3xl md:rounded-full shadow-md hover:shadow-lg transition-shadow duration-200 p-2 md:p-2 gap-2 md:gap-0">
              <div className="w-full md:flex-[1.5] flex flex-col px-4 md:px-8 border-b md:border-b-0 md:border-r border-gray-200 md:border-gray-300 hover:bg-gray-100 rounded-2xl md:rounded-full cursor-pointer transition py-2 md:py-1">
                <label htmlFor="query" className="text-[12px] font-extrabold text-gray-900 tracking-wide cursor-pointer">Where</label>
                <input type="text" id="query" name="query" placeholder="Search destinations" className="text-[14px] text-gray-900 placeholder-gray-500 truncate outline-none bg-transparent w-full" />
              </div>
              <div className="w-full md:flex-1 flex flex-col px-4 md:px-8 border-b md:border-b-0 md:border-r border-gray-200 md:border-gray-300 hover:bg-gray-100 rounded-2xl md:rounded-full cursor-pointer transition py-2 md:py-1">
                <label htmlFor="checkin" className="text-[12px] font-extrabold text-gray-900 tracking-wide cursor-pointer">When</label>
                <input type="date" min={new Date().toISOString().split('T')[0]} id="checkin" name="checkin" className="text-[14px] text-gray-900 placeholder-gray-500 truncate outline-none bg-transparent cursor-pointer w-full" />
              </div>
              <div className="w-full md:flex-[1.5] flex items-center justify-between px-4 md:pl-8 md:pr-2 hover:bg-gray-100 rounded-2xl md:rounded-full cursor-pointer transition py-2 md:py-1 relative" ref={guestDropdownRef}>
                <div 
                  className="flex flex-col flex-1 select-none py-1"
                  onClick={() => setGuestDropdownOpen(!guestDropdownOpen)}
                >
                  <span className="text-[12px] font-extrabold text-gray-900 tracking-wide">Who</span>
                  <span className="text-[14px] text-gray-900 truncate font-medium">
                    {totalGuests > 0 ? (
                      `${totalGuests} guest${totalGuests > 1 ? 's' : ''}${adults > 0 && children > 0 ? ` (${adults} A, ${children} C)` : ''}`
                    ) : (
                      <span className="text-gray-500 font-normal">Add guests</span>
                    )}
                  </span>
                  <input type="hidden" name="guests" value={totalGuests > 0 ? `${totalGuests} guest${totalGuests > 1 ? 's' : ''}` : ''} />
                </div>

                {guestDropdownOpen && (
                  <div 
                    onClick={(e) => e.stopPropagation()} 
                    className="absolute right-0 top-16 bg-white border border-gray-200 rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.14)] p-6 w-[320px] z-50 animate-in fade-in zoom-in-95 duration-150 select-none cursor-default"
                  >
                    {/* Adults */}
                    <div className="flex items-center justify-between py-3 border-b border-gray-100">
                      <div className="flex flex-col">
                        <span className="text-[15px] font-bold text-gray-900">Adults</span>
                        <span className="text-[12px] text-gray-500">Ages 13 or above</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => setAdults(Math.max(0, adults - 1))}
                          disabled={adults === 0}
                          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-700 hover:border-gray-900 transition-all disabled:opacity-30 disabled:cursor-not-allowed text-base font-bold bg-white cursor-pointer shadow-2xs"
                        >
                          -
                        </button>
                        <span className="w-5 text-center font-bold text-gray-900 text-base">{adults}</span>
                        <button
                          type="button"
                          onClick={() => setAdults(adults + 1)}
                          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-700 hover:border-gray-900 transition-all text-base font-bold bg-white cursor-pointer shadow-2xs"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Children */}
                    <div className="flex items-center justify-between py-3">
                      <div className="flex flex-col">
                        <span className="text-[15px] font-bold text-gray-900">Children</span>
                        <span className="text-[12px] text-gray-500">Ages 2–12</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => setChildren(Math.max(0, children - 1))}
                          disabled={children === 0}
                          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-700 hover:border-gray-900 transition-all disabled:opacity-30 disabled:cursor-not-allowed text-base font-bold bg-white cursor-pointer shadow-2xs"
                        >
                          -
                        </button>
                        <span className="w-5 text-center font-bold text-gray-900 text-base">{children}</span>
                        <button
                          type="button"
                          onClick={() => setChildren(children + 1)}
                          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-700 hover:border-gray-900 transition-all text-base font-bold bg-white cursor-pointer shadow-2xs"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="mt-2 pt-2 border-t border-gray-100 flex justify-end">
                      <button 
                        type="button"
                        onClick={() => setGuestDropdownOpen(false)}
                        className="text-[13px] font-bold text-gray-900 hover:text-brand-red underline transition-colors px-2 py-1 cursor-pointer"
                      >
                        Done
                      </button>
                    </div>
                  </div>
                )}

                <button type="submit" className="btn-interactive bg-brand-red text-white rounded-full p-3 md:p-4 hover:bg-red-600 cursor-pointer flex-shrink-0 ml-4">
                  <Search size={20} strokeWidth={3} />
                </button>
              </div>
            </form>
          </div>

          {/* Mobile Interactive Category Icons (Unscrolled State) */}
          <div className="md:hidden flex justify-around items-center pt-2 pb-3 px-2 border-b border-gray-100 mb-3">
            <Link href="/" className={`flex flex-col items-center justify-center space-y-1 cursor-pointer transition-all duration-200 group px-3 py-1.5 rounded-2xl active:scale-95 ${pathname === '/' ? 'text-gray-900 font-extrabold bg-gray-50/80' : 'text-gray-500 hover:text-gray-900'}`}>
              <img src="/icon_homes.png" className={`w-11 h-11 object-contain transition-all duration-300 transform drop-shadow-sm ${pathname === '/' ? 'scale-110 -translate-y-0.5 drop-shadow-md opacity-100' : 'opacity-85 hover:scale-105'}`} alt="Homes" />
              <span className={`text-[13px] tracking-tight ${pathname === '/' ? 'border-b-[3px] border-gray-900 pb-0.5 font-bold' : 'font-medium'}`}>Homes</span>
            </Link>
            <Link href="/explore" className={`flex flex-col items-center justify-center space-y-1 cursor-pointer transition-all duration-200 group px-3 py-1.5 rounded-2xl active:scale-95 ${pathname === '/explore' ? 'text-gray-900 font-extrabold bg-gray-50/80' : 'text-gray-500 hover:text-gray-900'}`}>
              <img src="/icon_explore.png" className={`w-11 h-11 object-contain transition-all duration-300 transform drop-shadow-sm ${pathname === '/explore' ? 'scale-110 -translate-y-0.5 drop-shadow-md opacity-100' : 'opacity-85 hover:scale-105'}`} alt="Explore" />
              <span className={`text-[13px] tracking-tight ${pathname === '/explore' ? 'border-b-[3px] border-gray-900 pb-0.5 font-bold' : 'font-medium'}`}>Explore</span>
            </Link>
            <Link href="/experiences" className={`flex flex-col items-center justify-center space-y-1 cursor-pointer transition-all duration-200 group px-3 py-1.5 rounded-2xl active:scale-95 ${pathname === '/experiences' ? 'text-gray-900 font-extrabold bg-gray-50/80' : 'text-gray-500 hover:text-gray-900'}`}>
              <img src="/icon_experiences.png" className={`w-11 h-11 object-contain transition-all duration-300 transform drop-shadow-sm ${pathname === '/experiences' ? 'scale-110 -translate-y-0.5 drop-shadow-md opacity-100' : 'opacity-85 hover:scale-105'}`} alt="Experiences" />
              <span className={`text-[13px] tracking-tight ${pathname === '/experiences' ? 'border-b-[3px] border-gray-900 pb-0.5 font-bold' : 'font-medium'}`}>Experiences</span>
            </Link>
          </div>

          {/* Mobile Search Button Pill (Unscrolled State) */}
          <div className="md:hidden flex justify-center py-1">
            <div 
              onClick={() => setMobileSearchModalOpen(true)} 
              className="flex items-center justify-center bg-white border border-gray-200 rounded-full shadow-[0_3px_12px_rgba(0,0,0,0.08)] hover:shadow-md hover:scale-[1.015] active:scale-[0.96] transition-all duration-200 py-3.5 px-6 w-full max-w-[420px] cursor-pointer gap-2.5 text-gray-900 font-medium text-[15px]"
            >
              <Search size={18} strokeWidth={2.5} className="text-gray-900 flex-shrink-0" />
              <span className="font-semibold text-[15px] text-gray-900 tracking-wide">Start your search</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Search Modal */}
      {mobileSearchModalOpen && (
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-md z-[100] flex flex-col md:hidden transition-all duration-300">
          <div className="bg-gray-50 flex-1 flex flex-col h-full overflow-y-auto w-full animate-fade-in-scale">
            {/* Top Header of Modal */}
            <div className="bg-white px-4 py-3 border-b border-gray-200 flex items-center justify-between sticky top-0 z-10">
              <button 
                onClick={() => setMobileSearchModalOpen(false)}
                type="button"
                className="p-2 -ml-2 text-gray-700 hover:bg-gray-100 rounded-full transition cursor-pointer"
              >
                <X size={22} />
              </button>
              <span className="text-[16px] font-extrabold text-gray-900">Search Stays</span>
              <button 
                type="button"
                onClick={() => {
                  setMobileQuery('');
                  setMobileCheckin('');
                  setAdults(0);
                  setChildren(0);
                }}
                className="text-[13px] font-semibold text-gray-600 hover:text-gray-900 underline py-1 px-2 cursor-pointer"
              >
                Clear all
              </button>
            </div>

            {/* Modal Content - Cards for Where, When, Who */}
            <form action="/search" onSubmit={() => setMobileSearchModalOpen(false)} className="flex-1 flex flex-col p-4 space-y-4">
              {/* Where Card */}
              <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
                <label htmlFor="mobile-query" className="text-xl font-extrabold text-gray-900 block mb-3">
                  Where to?
                </label>
                <div className="flex items-center border border-gray-300 rounded-xl px-3.5 py-3 focus-within:border-gray-900 focus-within:ring-1 focus-within:ring-gray-900 transition bg-gray-50/50">
                  <Search size={20} className="text-gray-500 mr-3 flex-shrink-0" />
                  <input 
                    type="text" 
                    id="mobile-query" 
                    name="query"
                    value={mobileQuery}
                    onChange={(e) => setMobileQuery(e.target.value)}
                    placeholder="Search destinations (e.g. Mahabaleshwar, Panchgani)" 
                    className="w-full bg-transparent text-[15px] text-gray-900 placeholder-gray-500 font-medium outline-none"
                  />
                </div>
              </div>

              {/* When Card */}
              <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
                <label htmlFor="mobile-checkin" className="text-xl font-extrabold text-gray-900 block mb-3">
                  When&apos;s your trip?
                </label>
                <div className="border border-gray-300 rounded-xl px-3.5 py-3 focus-within:border-gray-900 focus-within:ring-1 focus-within:ring-gray-900 transition bg-gray-50/50">
                  <input 
                    type="date" 
                    min={new Date().toISOString().split('T')[0]} 
                    id="mobile-checkin" 
                    name="checkin"
                    value={mobileCheckin}
                    onChange={(e) => setMobileCheckin(e.target.value)}
                    className="w-full bg-transparent text-[15px] text-gray-900 cursor-pointer outline-none font-medium"
                  />
                </div>
              </div>

              {/* Who Card */}
              <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-4">
                <label className="text-xl font-extrabold text-gray-900 block mb-1">
                  Who&apos;s coming?
                </label>
                <input type="hidden" name="guests" value={totalGuests > 0 ? `${totalGuests} guest${totalGuests > 1 ? 's' : ''}` : ''} />
                
                {/* Adults row */}
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <div className="flex flex-col">
                    <span className="text-[16px] font-bold text-gray-900">Adults</span>
                    <span className="text-[13px] text-gray-500">Ages 13 or above</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={() => setAdults(Math.max(0, adults - 1))}
                      disabled={adults === 0}
                      className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center text-gray-700 hover:border-gray-900 transition-all disabled:opacity-30 disabled:cursor-not-allowed text-lg font-bold bg-white cursor-pointer shadow-xs active:scale-90"
                    >
                      -
                    </button>
                    <span className="w-6 text-center font-black text-gray-900 text-lg">{adults}</span>
                    <button
                      type="button"
                      onClick={() => setAdults(adults + 1)}
                      className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center text-gray-700 hover:border-gray-900 transition-all text-lg font-bold bg-white cursor-pointer shadow-xs active:scale-90"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Children row */}
                <div className="flex items-center justify-between py-2">
                  <div className="flex flex-col">
                    <span className="text-[16px] font-bold text-gray-900">Children</span>
                    <span className="text-[13px] text-gray-500">Ages 2–12</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={() => setChildren(Math.max(0, children - 1))}
                      disabled={children === 0}
                      className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center text-gray-700 hover:border-gray-900 transition-all disabled:opacity-30 disabled:cursor-not-allowed text-lg font-bold bg-white cursor-pointer shadow-xs active:scale-90"
                    >
                      -
                    </button>
                    <span className="w-6 text-center font-black text-gray-900 text-lg">{children}</span>
                    <button
                      type="button"
                      onClick={() => setChildren(children + 1)}
                      className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center text-gray-700 hover:border-gray-900 transition-all text-lg font-bold bg-white cursor-pointer shadow-xs active:scale-90"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex-1 min-h-[40px]"></div>

              {/* Sticky Bottom Submit Bar */}
              <div className="sticky bottom-0 bg-white -mx-4 -mb-4 p-4 border-t border-gray-200 flex justify-end shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
                <button 
                  type="submit" 
                  className="btn-interactive w-full bg-brand-red text-white font-bold text-base rounded-xl py-3.5 px-6 flex items-center justify-center gap-2 hover:bg-red-600 shadow-md cursor-pointer"
                >
                  <Search size={20} strokeWidth={3} />
                  <span>Search</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
