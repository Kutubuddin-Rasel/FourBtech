"use client";

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/services/api';

// ShadCN UI components (assumed import path)
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl?: string;
}

export default function DashboardProductsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/auth/signin');
    }
  }, [user, loading, router]);

  // Fetch products
  const {
    data: products,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const res = await api.get<Product[]>('/products');
      return res.data;
    },
  });

  // Add to cart mutation
  const addToCart = useMutation({
    mutationFn: async (productId: string) => {
      return api.post('/cart', { productId, quantity: 1 });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });

  return (
    <div className="bg-white rounded-lg shadow p-6 min-h-screen">
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-gray-900">Products</h2>
        <p className="text-gray-600">Browse our latest products and add them to your cart.</p>
      </div>
      {isLoading ? (
        <div className="text-center py-12 text-gray-600">Loading products…</div>
      ) : isError ? (
        <div className="text-center py-12 text-red-600">Failed to load products.</div>
      ) : products && products.length === 0 ? (
        <div className="text-center py-12 text-gray-600">No products found.</div>
      ) : (
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {(products ?? []).map((product: Product) => (
            <Card key={product.id} className="flex flex-col">
              <div className="h-48 w-full bg-gray-100 flex items-center justify-center rounded-t-md overflow-hidden">
                <Image
                  src={product.imageUrl || '/placeholder-product.jpg'}
                  alt={product.name}
                  width={400}
                  height={192}
                  className="object-cover h-full w-full"
                  onError={({ currentTarget }) => { currentTarget.src = '/placeholder-product.jpg'; }}
                />
              </div>
              <div className="flex-1 flex flex-col p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 truncate">{product.name}</h3>
                <p className="text-purple-700 font-bold text-xl mb-4">
                  {product.price !== undefined && product.price !== null ? `$${Number(product.price).toFixed(2)}` : '--'}
                </p>
                <Button
                  onClick={() => addToCart.mutate(product.id)}
                  disabled={addToCart.isPending}
                  className="mt-auto w-full"
                >
                  {addToCart.isPending ? 'Adding…' : 'Add to Cart'}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
} 