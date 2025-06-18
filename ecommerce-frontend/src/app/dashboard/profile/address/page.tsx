"use client";

import { useState } from 'react';

interface Address {
  id: string;
  type: 'Home' | 'Work' | 'Other';
  details: string;
  isDefault: boolean;
}

export default function AddressTab() {
  const [addresses, setAddresses] = useState<Address[]>([]); // This will be populated from the database

  const handleAddAddress = () => {
    // TODO: Implement logic to open a form or modal to add a new address
    console.log('Add Address clicked');
  };

  const handleEditAddress = (id: string) => {
    // TODO: Implement logic to edit an existing address
    console.log('Edit Address clicked for ID:', id);
  };

  const handleDeleteAddress = (id: string) => {
    // TODO: Implement logic to delete an address
    console.log('Delete Address clicked for ID:', id);
  };

  const handleSetDefault = (id: string) => {
    // TODO: Implement logic to set an address as default
    console.log('Set as Default clicked for ID:', id);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">Addresses</h2>
        <button
          onClick={handleAddAddress}
          className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-md"
        >
          + Add Address
        </button>
      </div>
      <p className="text-gray-600 mb-8">Manage your shipping and billing addresses.</p>

      <div className="space-y-6">
        {addresses.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
            No addresses found. Add a new address to get started.
          </div>
        ) : (
          addresses.map((address) => (
            <div key={address.id} className="bg-white rounded-lg shadow p-6 relative">
              {address.isDefault && (
                <span className="absolute top-4 right-4 bg-purple-100 text-purple-700 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                  Default
                </span>
              )}
              <div className="flex items-center mb-4">
                {/* Placeholder for location icon */}
                <svg className="h-6 w-6 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.828 0L6.343 16.657A8 8 0 1117.657 16.657z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900">{address.type}</h3>
              </div>
              <p className="text-gray-700 mb-4">{address.details}</p>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEditAddress(address.id)}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteAddress(address.id)}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-red-600 hover:bg-red-50"
                >
                  Delete
                </button>
                {!address.isDefault && (
                  <button
                    onClick={() => handleSetDefault(address.id)}
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-purple-600 hover:bg-purple-50"
                  >
                    Set as Default
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
} 