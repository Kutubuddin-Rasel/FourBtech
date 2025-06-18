"use client";

import { useState } from 'react';
import PersonalTab from './personal/page';
import AddressTab from './address/page';
import TransactionsTab from './transactions/page';

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('personal');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'personal':
        return <PersonalTab />;
      case 'address':
        return <AddressTab />;
      case 'transactions':
        return <TransactionsTab />;
      default:
        return <PersonalTab />;
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Profile</h1>
      <p className="text-gray-600 mb-8">Manage your account settings and preferences.</p>

      <div className="bg-white rounded-lg shadow p-8">
        <div className="flex border-b border-gray-200 mb-6">
          <button
            className={`py-2 px-4 text-sm font-medium ${activeTab === 'personal' ? 'border-b-2 border-purple-600 text-purple-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('personal')}
          >
            Personal
          </button>
          <button
            className={`py-2 px-4 text-sm font-medium ${activeTab === 'address' ? 'border-b-2 border-purple-600 text-purple-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('address')}
          >
            Address
          </button>
          <button
            className={`py-2 px-4 text-sm font-medium ${activeTab === 'transactions' ? 'border-b-2 border-purple-600 text-purple-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('transactions')}
          >
            Transactions
          </button>
        </div>
        <div>
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
} 