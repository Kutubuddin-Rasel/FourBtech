"use client";

import { useState } from 'react';

export default function SellerSettingsPage() {
  const [generalSettings, setGeneralSettings] = useState({
    storeName: '',
    storeEmail: '',
    storePhone: '',
    storeAddress: '',
  });

  const [securitySettings, setSecuritySettings] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });

  const handleGeneralChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGeneralSettings({ ...generalSettings, [e.target.name]: e.target.value });
  };

  const handleSecurityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSecuritySettings({ ...securitySettings, [e.target.name]: e.target.value });
  };

  const handleGeneralSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement API call to update general settings
    console.log('Updating general settings:', generalSettings);
  };

  const handleSecuritySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement API call to update security settings
    console.log('Updating security settings:', securitySettings);
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Settings</h1>

      {/* General Settings */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">General Settings</h2>
        <form onSubmit={handleGeneralSubmit} className="space-y-4">
          <div>
            <label htmlFor="storeName" className="block text-sm font-medium text-gray-700">Store Name</label>
            <input
              type="text"
              name="storeName"
              id="storeName"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
              value={generalSettings.storeName}
              onChange={handleGeneralChange}
            />
          </div>
          <div>
            <label htmlFor="storeEmail" className="block text-sm font-medium text-gray-700">Store Email</label>
            <input
              type="email"
              name="storeEmail"
              id="storeEmail"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
              value={generalSettings.storeEmail}
              onChange={handleGeneralChange}
            />
          </div>
          <div>
            <label htmlFor="storePhone" className="block text-sm font-medium text-gray-700">Store Phone</label>
            <input
              type="tel"
              name="storePhone"
              id="storePhone"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
              value={generalSettings.storePhone}
              onChange={handleGeneralChange}
            />
          </div>
          <div>
            <label htmlFor="storeAddress" className="block text-sm font-medium text-gray-700">Store Address</label>
            <input
              type="text"
              name="storeAddress"
              id="storeAddress"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
              value={generalSettings.storeAddress}
              onChange={handleGeneralChange}
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            Save General Settings
          </button>
        </form>
      </div>

      {/* Security Settings */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Security Settings</h2>
        <form onSubmit={handleSecuritySubmit} className="space-y-4">
          <div>
            <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">Current Password</label>
            <input
              type="password"
              name="currentPassword"
              id="currentPassword"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
              value={securitySettings.currentPassword}
              onChange={handleSecurityChange}
            />
          </div>
          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">New Password</label>
            <input
              type="password"
              name="newPassword"
              id="newPassword"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
              value={securitySettings.newPassword}
              onChange={handleSecurityChange}
            />
          </div>
          <div>
            <label htmlFor="confirmNewPassword" className="block text-sm font-medium text-gray-700">Confirm New Password</label>
            <input
              type="password"
              name="confirmNewPassword"
              id="confirmNewPassword"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
              value={securitySettings.confirmNewPassword}
              onChange={handleSecurityChange}
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            Change Password
          </button>
        </form>
      </div>
    </div>
  );
} 