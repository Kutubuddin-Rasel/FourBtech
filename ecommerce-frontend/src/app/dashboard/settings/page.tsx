"use client";

import { useState } from 'react';

export default function SettingsPage() {
  const [generalSettings, setGeneralSettings] = useState({
    language: 'English',
    timezone: 'UTC',
  });

  const [securitySettings, setSecuritySettings] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });

  const handleGeneralSettingsChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    setGeneralSettings({ ...generalSettings, [e.target.name]: e.target.value });
  };

  const handleSecuritySettingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSecuritySettings({ ...securitySettings, [e.target.name]: e.target.value });
  };

  const handleSaveGeneralSettings = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement logic to save general settings
    console.log('Saving general settings:', generalSettings);
  };

  const handleSaveSecuritySettings = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement logic to save security settings
    console.log('Saving security settings:', securitySettings);
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Settings</h1>
      <p className="text-gray-600 mb-8">Manage your account settings and preferences.</p>

      <div className="bg-white rounded-lg shadow p-8 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">General Settings</h2>
        <form onSubmit={handleSaveGeneralSettings}>
          <div className="space-y-4 mb-6">
            <div>
              <label htmlFor="language" className="block text-sm font-medium text-gray-700">Language</label>
              <select
                id="language"
                name="language"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md"
                value={generalSettings.language}
                onChange={handleGeneralSettingsChange}
              >
                <option>English</option>
                <option>Spanish</option>
                <option>French</option>
              </select>
            </div>
            <div>
              <label htmlFor="timezone" className="block text-sm font-medium text-gray-700">Timezone</label>
              <input
                type="text"
                name="timezone"
                id="timezone"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                value={generalSettings.timezone}
                onChange={handleGeneralSettingsChange}
              />
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              Save Settings
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow p-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Security Settings</h2>
        <form onSubmit={handleSaveSecuritySettings}>
          <div className="space-y-4 mb-6">
            <div>
              <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">Current Password</label>
              <input
                type="password"
                name="currentPassword"
                id="currentPassword"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                value={securitySettings.currentPassword}
                onChange={handleSecuritySettingsChange}
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
                onChange={handleSecuritySettingsChange}
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
                onChange={handleSecuritySettingsChange}
              />
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              Change Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 