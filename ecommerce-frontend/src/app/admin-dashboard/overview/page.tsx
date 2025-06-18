"use client";

import { useEffect, useState } from 'react';
import { adminApi } from '@/services/api';
import Link from 'next/link';

export default function AdminOverviewPage() {
  const [stats, setStats] = useState({
    totalSellers: '--',
    totalProducts: '--',
    pendingOrders: '--'
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await adminApi.getStats();
        setStats(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching stats:', err);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-gray-900">Welcome, Admin!</h2>
      </div>
      <p className="text-gray-600">This is your central hub for managing the e-commerce platform.</p>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-purple-100 p-4 rounded-lg shadow-sm">
          <h3 className="font-semibold text-lg text-purple-800">Total Sellers</h3>
          <p className="text-3xl font-bold text-purple-900">{isLoading ? 'Loading...' : stats.totalSellers}</p>
        </div>
        <div className="bg-green-100 p-4 rounded-lg shadow-sm">
          <h3 className="font-semibold text-lg text-green-800">Total Products</h3>
          <p className="text-3xl font-bold text-green-900">{isLoading ? 'Loading...' : stats.totalProducts}</p>
        </div>
        <div className="bg-blue-100 p-4 rounded-lg shadow-sm">
          <h3 className="font-semibold text-lg text-blue-800">Pending Orders</h3>
          <p className="text-3xl font-bold text-blue-900">{isLoading ? 'Loading...' : stats.pendingOrders}</p>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h3>
        <div className="flex space-x-4">
          <Link href="/seller-auth/register" className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700">
            Register New Seller
          </Link>
        </div>
      </div>
    </div>
  );
} 