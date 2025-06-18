"use client";

import { useState, useEffect } from 'react';
import { customerApi } from '@/services/api';

interface Wishlist {
  id: string;
  name: string;
  items: WishlistItem[];
}

interface WishlistItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  imageUrl: string;
}

export default function WishlistPage() {
  const [wishlists, setWishlists] = useState<Wishlist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWishlists = async () => {
      try {
        const data = await customerApi.getWishlists();
        setWishlists(data);
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch wishlists');
        console.error('Error fetching wishlists:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlists();
  }, []);

  if (loading) {
    return <div className="container mx-auto py-8 text-center">Loading wishlists...</div>;
  }

  if (error) {
    return <div className="container mx-auto py-8 text-center text-red-600">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Wishlist</h1>
        <button className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-md">
          + Create New List
        </button>
      </div>
      <p className="text-gray-600 mb-8">Manage your saved items across multiple wishlists.</p>

      <div className="space-y-8">
        {wishlists.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
            No items in your wishlist yet. Start adding your favorite products!
          </div>
        ) : (
          wishlists.map((wishlist) => (
            <div key={wishlist.id} className="bg-white rounded-lg shadow">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">{wishlist.name}</h2>
                {wishlist.items.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No items in this wishlist</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {wishlist.items.map((item) => (
                      <div key={item.id} className="border rounded-lg overflow-hidden">
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-full h-48 object-cover"
                        />
                        <div className="p-4">
                          <h3 className="font-medium text-gray-900">{item.name}</h3>
                          <p className="text-purple-600 font-semibold mt-2">
                            ${item.price.toFixed(2)}
                          </p>
                          <div className="mt-4 flex space-x-2">
                            <button className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700">
                              Add to Cart
                            </button>
                            <button className="bg-red-100 text-red-600 py-2 px-4 rounded-md hover:bg-red-200">
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
} 