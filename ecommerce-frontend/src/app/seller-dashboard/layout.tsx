"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface SellerDashboardLayoutProps {
  children: React.ReactNode;
}

export default function SellerDashboardLayout({ children }: SellerDashboardLayoutProps) {
  const pathname = usePathname();
  const { logout } = useAuth();
  const router = useRouter();

  const navItems = [
    { href: '/seller-dashboard', label: 'Overview' },
    { href: '/seller-dashboard/products', label: 'Products' },
    { href: '/seller-dashboard/orders', label: 'Orders' },
    { href: '/seller-dashboard/payments', label: 'Payments' },
    { href: '/seller-dashboard/settings', label: 'Settings' },
  ];

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Header */}
      <header className="w-full h-16 bg-white shadow flex items-center justify-between px-8 sticky top-0 z-20">
        <div className="text-xl font-bold text-purple-700">Seller Dashboard</div>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded-md font-semibold hover:bg-red-600 transition"
        >
          Logout
        </button>
      </header>
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-md p-6 flex flex-col justify-between">
          <div>
            <nav className="mt-8">
              <ul>
                {navItems.map((item) => (
                  <li key={item.href} className="mb-4">
                    <Link
                      href={item.href}
                      className={`flex items-center p-2 rounded-md ${pathname === item.href ? 'bg-purple-100 text-purple-700' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </aside>
        {/* Main Content */}
        <main className="flex-1 p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
} 