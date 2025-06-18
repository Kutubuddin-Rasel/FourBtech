"use client";

import React, { ReactNode } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

interface AdminDashboardLayoutProps {
  children: ReactNode;
}

export default function AdminDashboardLayout({ children }: AdminDashboardLayoutProps) {
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white flex flex-col">
        <div className="p-6 text-2xl font-bold text-purple-400">
          Admin Panel
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
          <Link href="/admin-dashboard/overview" className="block py-2 px-4 rounded-md hover:bg-gray-700">
            Overview
          </Link>
          <Link href="/seller-auth/register" className="block py-2 px-4 rounded-md hover:bg-gray-700">
            Register Seller
          </Link>
          <Link href="/admin-dashboard/manage-users" className="block py-2 px-4 rounded-md hover:bg-gray-700">
            Manage Users
          </Link>
          {/* Add more admin specific links as needed */}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between bg-white shadow p-6">
          <h1 className="text-xl font-semibold text-gray-800">Admin Dashboard</h1>
          <div className="flex items-center gap-4">
            {/* Admin actions/profile menu */}
            <button className="text-gray-600 hover:text-gray-900">Admin User</button>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-md font-semibold hover:bg-red-600 transition"
            >
              Logout
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200 p-6">
          {children}
        </main>
      </div>
    </div>
  );
} 