"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { productService } from '@/services/productService';

interface Product {
  id: string;
  imageUrl?: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
  status: 'Active' | 'Low stock' | 'Out of stock';
}

export default function SellerProductsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [stockStatusFilter, setStockStatusFilter] = useState('All');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const fetchedProducts = await productService.getAllProducts();
        const mappedProducts = fetchedProducts.map((p: any) => ({
          id: p.id,
          imageUrl: p.imageUrl,
          name: p.name,
          sku: p.sku || 'N/A',
          price: p.price,
          stock: p.stock,
          status: p.stock > 10 ? 'Active' : p.stock > 0 ? 'Low stock' : 'Out of stock',
        }));
        setProducts(mappedProducts);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch products.');
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleDeleteProduct = async (id: string) => {
    try {
      await productService.deleteProduct(id);
      setProducts(products.filter((p) => p.id !== id));
    } catch (err: any) {
      setError(err.message || 'Failed to delete product.');
      console.error('Error deleting product:', err);
    }
  };

  if (loading) {
    return <div className="container mx-auto py-8 text-center">Loading products...</div>;
  }

  if (error) {
    return <div className="container mx-auto py-8 text-center text-red-600">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Products</h1>
        <Link href="/seller-dashboard/products/add" className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-md">
          + Add Product
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0 sm:space-x-4">
        <input
          type="text"
          placeholder="Search by name or SKU"
          className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option>Category</option>
          <option>All</option>
          {/* Populate with dynamic categories */}
        </select>
        <select
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
          value={stockStatusFilter}
          onChange={(e) => setStockStatusFilter(e.target.value)}
        >
          <option>Stock Status</option>
          <option>All</option>
          <option>Active</option>
          <option>Low stock</option>
          <option>Out of stock</option>
        </select>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Image
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                SKU
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stock
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                  No products found.
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <img src={product.imageUrl || '/placeholder.jpg'} alt={product.name} className="h-10 w-10 rounded-full object-cover" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {product.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.sku}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${product.price.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.stock}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${product.status === 'Active' ? 'bg-green-100 text-green-800' : product.status === 'Low stock' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                      {product.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link href={`/seller-dashboard/products/edit/${product.id}`} className="text-purple-600 hover:text-purple-900 mr-2">
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDeleteProduct(product.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
} 