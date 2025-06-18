"use client";

import { useState } from 'react';

export default function PersonalTab() {
  const [personalInfo, setPersonalInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    bio: '',
  });
  const [notificationPreferences, setNotificationPreferences] = useState({
    orderUpdates: true,
    promotionsAndDeals: true,
    newsletter: false,
    wishlistUpdates: true,
  });

  const handlePersonalInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setPersonalInfo({ ...personalInfo, [e.target.name]: e.target.value });
  };

  const handleNotificationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNotificationPreferences({ ...notificationPreferences, [e.target.name]: e.target.checked });
  };

  const handleSavePersonalInfo = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement save personal info logic with API
    console.log('Saving personal info:', personalInfo);
  };

  const handleSaveNotificationPreferences = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement save notification preferences logic with API
    console.log('Saving notification preferences:', notificationPreferences);
  };

  return (
    <div className="space-y-8">
      {/* Personal Information */}
      <div className="bg-white p-6 rounded-lg">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Personal Information</h2>
        <p className="text-gray-600 mb-6">Update your personal details.</p>
        <form onSubmit={handleSavePersonalInfo}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First name</label>
              <input
                type="text"
                name="firstName"
                id="firstName"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                value={personalInfo.firstName}
                onChange={handlePersonalInfoChange}
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last name</label>
              <input
                type="text"
                name="lastName"
                id="lastName"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                value={personalInfo.lastName}
                onChange={handlePersonalInfoChange}
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                id="email"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                value={personalInfo.email}
                onChange={handlePersonalInfoChange}
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
              <input
                type="text"
                name="phone"
                id="phone"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                value={personalInfo.phone}
                onChange={handlePersonalInfoChange}
              />
            </div>
            <div className="col-span-2">
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700">Bio</label>
              <textarea
                name="bio"
                id="bio"
                rows={3}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                value={personalInfo.bio}
                onChange={handlePersonalInfoChange}
              ></textarea>
            </div>
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>

      {/* Notification Preferences */}
      <div className="bg-white p-6 rounded-lg">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Notification Preferences</h2>
        <p className="text-gray-600 mb-6">Manage how you receive notifications.</p>
        <form onSubmit={handleSaveNotificationPreferences}>
          <div className="space-y-4 mb-6">
            <div className="flex items-center justify-between">
              <label htmlFor="orderUpdates" className="text-sm font-medium text-gray-700">Order Updates</label>
              <input
                type="checkbox"
                name="orderUpdates"
                id="orderUpdates"
                className="h-5 w-5 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                checked={notificationPreferences.orderUpdates}
                onChange={handleNotificationChange}
              />
            </div>
            <div className="flex items-center justify-between">
              <label htmlFor="promotionsAndDeals" className="text-sm font-medium text-gray-700">Promotions and deals</label>
              <input
                type="checkbox"
                name="promotionsAndDeals"
                id="promotionsAndDeals"
                className="h-5 w-5 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                checked={notificationPreferences.promotionsAndDeals}
                onChange={handleNotificationChange}
              />
            </div>
            <div className="flex items-center justify-between">
              <label htmlFor="newsletter" className="text-sm font-medium text-gray-700">Newsletter</label>
              <input
                type="checkbox"
                name="newsletter"
                id="newsletter"
                className="h-5 w-5 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                checked={notificationPreferences.newsletter}
                onChange={handleNotificationChange}
              />
            </div>
            <div className="flex items-center justify-between">
              <label htmlFor="wishlistUpdates" className="text-sm font-medium text-gray-700">Wishlist updates</label>
              <input
                type="checkbox"
                name="wishlistUpdates"
                id="wishlistUpdates"
                className="h-5 w-5 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                checked={notificationPreferences.wishlistUpdates}
                onChange={handleNotificationChange}
              />
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              Save Preferences
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 