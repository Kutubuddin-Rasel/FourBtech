"use client";

import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import { customerApi } from '@/services/api';

interface Activity {
  type: 'order' | 'review';
  date: string;
  description: string;
  status: string;
}

export default function OverviewPage() {
  const { user } = useAuth();
  const userName = user?.name || 'Customer';
  const [stats, setStats] = useState({
    totalOrders: '--',
    wishlistItems: '--',
    pendingReviews: '--'
  });
  const [recentActivity, setRecentActivity] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, activityData] = await Promise.all([
          customerApi.getStats(),
          customerApi.getRecentActivity()
        ]);
        setStats(statsData);
        setRecentActivity(activityData);
      } catch (err) {
        console.error('Error fetching customer data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-gray-900">Welcome, {userName}!</h2>
      </div>
      <p className="text-gray-600">This is your personalized dashboard.</p>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-purple-100 p-4 rounded-lg shadow-sm">
          <h3 className="font-semibold text-lg text-purple-800">Total Orders</h3>
          <p className="text-3xl font-bold text-purple-900">{isLoading ? 'Loading...' : stats.totalOrders}</p>
        </div>
        <div className="bg-green-100 p-4 rounded-lg shadow-sm">
          <h3 className="font-semibold text-lg text-green-800">Items in Wishlist</h3>
          <p className="text-3xl font-bold text-green-900">{isLoading ? 'Loading...' : stats.wishlistItems}</p>
        </div>
        <div className="bg-blue-100 p-4 rounded-lg shadow-sm">
          <h3 className="font-semibold text-lg text-blue-800">Pending Reviews</h3>
          <p className="text-3xl font-bold text-blue-900">{isLoading ? 'Loading...' : stats.pendingReviews}</p>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h3>
        {isLoading ? (
          <p className="text-gray-600">Loading recent activity...</p>
        ) : recentActivity.length > 0 ? (
          <ul className="space-y-2">
            {recentActivity.map((activity, index) => (
              <li key={index} className="flex items-center space-x-2 text-gray-700">
                <span className={`h-2 w-2 rounded-full ${
                  activity.type === 'order' ? 'bg-purple-500' : 'bg-blue-500'
                }`}></span>
                <span>{activity.description}</span>
                <span className="text-sm text-gray-500">
                  ({new Date(activity.date).toLocaleDateString()})
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600">No recent activity to display.</p>
        )}
      </div>
    </div>
  );
} 