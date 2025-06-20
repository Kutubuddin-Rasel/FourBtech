"use client";

import { useEffect, useState } from 'react';
import { sellerApi } from '@/services/api';

export default function SellerOverviewPage() {
  const [stats, setStats] = useState({
    salesToday: '--',
    salesWeek: '--',
    salesMonth: '--',
    orders: {
      pending: '--',
      shipped: '--',
      delivered: '--',
      cancelled: '--'
    },
    lowStockCount: '--'
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await sellerApi.getStats();
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
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Welcome back, Seller!</h1>
      <p className="text-gray-600 mb-8">You&apos;ve made <span className="font-semibold text-gray-900">${isLoading ? '--' : stats.salesToday}</span> today.</p>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Sales Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm mb-2">Sales Today</h3>
          <p className="text-2xl font-semibold text-gray-900">{isLoading ? 'Loading...' : `$${stats.salesToday}`}</p>
          <p className="text-green-500 text-sm">Loading...</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm mb-2">Sales This Week</h3>
          <p className="text-2xl font-semibold text-gray-900">{isLoading ? 'Loading...' : `$${stats.salesWeek}`}</p>
          <p className="text-green-500 text-sm">Loading...</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm mb-2">Sales This Month</h3>
          <p className="text-2xl font-semibold text-gray-900">{isLoading ? 'Loading...' : `$${stats.salesMonth}`}</p>
          <p className="text-green-500 text-sm">Loading...</p>
        </div>
      </div>

      {/* Orders Status */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Orders Status</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-center space-x-2">
            <span className="h-3 w-3 rounded-full bg-orange-400"></span>
            <div>
              <p className="text-sm text-gray-500">Pending</p>
              <p className="text-lg font-semibold text-gray-900">{isLoading ? 'Loading...' : stats.orders.pending}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="h-3 w-3 rounded-full bg-blue-400"></span>
            <div>
              <p className="text-sm text-gray-500">Shipped</p>
              <p className="text-lg font-semibold text-gray-900">{isLoading ? 'Loading...' : stats.orders.shipped}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="h-3 w-3 rounded-full bg-green-400"></span>
            <div>
              <p className="text-sm text-gray-500">Delivered</p>
              <p className="text-lg font-semibold text-gray-900">{isLoading ? 'Loading...' : stats.orders.delivered}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="h-3 w-3 rounded-full bg-red-400"></span>
            <div>
              <p className="text-sm text-gray-500">Cancelled</p>
              <p className="text-lg font-semibold text-gray-900">{isLoading ? 'Loading...' : stats.orders.cancelled}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Revenue Trend */}
      <div className="bg-white rounded-lg shadow p-8 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Revenue Trend (30 days)</h2>
        <div className="h-64 flex items-center justify-center text-gray-500">
          {isLoading ? 'Loading chart data...' : 'Chart will be implemented with real data'}
        </div>
      </div>

      {/* Low Stock Notification */}
      {!isLoading && stats.lowStockCount !== '0' && (
        <div className="bg-orange-50 border border-orange-200 text-orange-600 px-4 py-3 rounded flex justify-between items-center">
          <div className="flex items-center">
            <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.343a4.5 4.5 0 016.48 0 4.5 4.5 0 010 6.48l-2.26 2.26a1 1 0 01-1.414 0l-2.26-2.26a4.5 4.5 0 010-6.48zM15 11a3 3 0 11-6 0 3 3 0 016 0zM12 21a1 1 0 01-1 1h-2a1 1 0 110-2h2a1 1 0 011 1z" clipRule="evenodd" />
            </svg>
            <span>You have {stats.lowStockCount} products running low. Restock now.</span>
          </div>
          <button className="bg-orange-200 text-orange-800 px-3 py-1 rounded-md text-sm font-medium hover:bg-orange-300">
            View Products
          </button>
        </div>
      )}
    </div>
  );
} 