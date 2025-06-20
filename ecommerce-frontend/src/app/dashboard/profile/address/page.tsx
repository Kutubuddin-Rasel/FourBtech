"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';

interface Address {
  id: string;
  type: 'Home' | 'Work' | 'Other';
  details: string;
  isDefault: boolean;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export default function AddressTab() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [form, setForm] = useState({
    type: 'Home',
    details: '',
    isDefault: false,
  });
  const [adding, setAdding] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [editForm, setEditForm] = useState({ type: 'Home', details: '', isDefault: false });
  const [editLoading, setEditLoading] = useState(false);

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = typeof window !== 'undefined' ? document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1] : '';
      const res = await axios.get(`${API_URL}/customer/addresses`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      setAddresses(res.data);
    } catch {
      setError('Failed to fetch addresses');
    } finally {
      setLoading(false);
    }
  };

  const handleAddAddress = () => {
    setShowAddModal(true);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setForm(prev => ({
        ...prev,
        [name]: checked,
      }));
    } else {
      setForm(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdding(true);
    setError(null);
    try {
      const token = typeof window !== 'undefined' ? document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1] : '';
      await axios.post(`${API_URL}/customer/addresses`, form, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      setShowAddModal(false);
      setForm({ type: 'Home', details: '', isDefault: false });
      fetchAddresses();
    } catch {
      setError('Failed to add address');
    } finally {
      setAdding(false);
    }
  };

  const handleEditAddress = (id: string) => {
    const addr = addresses.find(a => a.id === id);
    if (addr) {
      setEditingAddress(addr);
      setEditForm({ type: addr.type, details: addr.details, isDefault: addr.isDefault });
    }
  };

  const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setEditForm(prev => ({ ...prev, [name]: checked }));
    } else {
      setEditForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAddress) return;
    setEditLoading(true);
    setError(null);
    try {
      const token = typeof window !== 'undefined' ? document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1] : '';
      await axios.put(`${API_URL}/customer/addresses/${editingAddress.id}`, editForm, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      setEditingAddress(null);
      fetchAddresses();
    } catch {
      setError('Failed to update address');
    } finally {
      setEditLoading(false);
    }
  };

  const handleDeleteAddress = async (id: string) => {
    if (!confirm('Are you sure you want to delete this address?')) return;
    setError(null);
    try {
      const token = typeof window !== 'undefined' ? document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1] : '';
      await axios.delete(`${API_URL}/customer/addresses/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      fetchAddresses();
    } catch {
      setError('Failed to delete address');
    }
  };

  const handleSetDefault = async (id: string) => {
    setError(null);
    try {
      const token = typeof window !== 'undefined' ? document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1] : '';
      await axios.patch(`${API_URL}/customer/addresses/${id}/default`, {}, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      fetchAddresses();
    } catch {
      setError('Failed to set default address');
    }
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

      {loading ? (
        <div className="text-center text-gray-500">Loading addresses…</div>
      ) : error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : (
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
      )}

      {/* Add Address Modal */}
      {showAddModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">Add New Address</h3>
            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Type</label>
                <select name="type" value={form.type} onChange={handleFormChange} className="w-full border rounded px-3 py-2">
                  <option value="Home">Home</option>
                  <option value="Work">Work</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Details</label>
                <input name="details" value={form.details} onChange={handleFormChange} required className="w-full border rounded px-3 py-2" />
              </div>
              <div className="flex items-center">
                <input type="checkbox" name="isDefault" checked={form.isDefault} onChange={handleFormChange} className="mr-2" />
                <span className="text-sm">Set as default address</span>
              </div>
              <div className="flex justify-end space-x-2 mt-4">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 border rounded-md">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-purple-600 text-white rounded-md" disabled={adding}>
                  {adding ? 'Adding...' : 'Add Address'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {editingAddress && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">Edit Address</h3>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Type</label>
                <select name="type" value={editForm.type} onChange={handleEditFormChange} className="w-full border rounded px-3 py-2">
                  <option value="Home">Home</option>
                  <option value="Work">Work</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Details</label>
                <input name="details" value={editForm.details} onChange={handleEditFormChange} required className="w-full border rounded px-3 py-2" />
              </div>
              <div className="flex items-center">
                <input type="checkbox" name="isDefault" checked={editForm.isDefault} onChange={handleEditFormChange} className="mr-2" />
                <span className="text-sm">Set as default address</span>
              </div>
              <div className="flex justify-end space-x-2 mt-4">
                <button type="button" onClick={() => setEditingAddress(null)} className="px-4 py-2 border rounded-md">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-purple-600 text-white rounded-md" disabled={editLoading}>
                  {editLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 