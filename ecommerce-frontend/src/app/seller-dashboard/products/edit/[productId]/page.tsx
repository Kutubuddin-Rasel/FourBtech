"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { productService } from '@/services/productService';
import { useAuth } from '@/contexts/AuthContext';
import Image from 'next/image';

interface Specification {
  name: string;
  value: string;
}

interface Tag {
  name: string;
}

export default function EditProductPage() {
  const { productId } = useParams();
  const { token } = useAuth();
  const [formData, setFormData] = useState({
    productTitle: '',
    description: '',
    category: '',
    brand: '',
    model: '',
    ram: '',
    storage: '',
    color: '',
    condition: '',
    features: [] as string[],
    price: '',
    salePrice: '',
    quantity: '',
    sku: '',
    tags: '',
    seoTitle: '',
    seoDescription: '',
  });
  const [productImages, setProductImages] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!token) {
        setError('Authentication required.');
        return;
      }
      try {
        const product = await productService.getProductById(productId as string);
        setFormData({
          productTitle: product.name,
          description: product.description,
          category: product.category || '',
          brand: product.specifications?.find((spec: Specification) => spec.name === 'Brand')?.value || '',
          model: product.specifications?.find((spec: Specification) => spec.name === 'Model')?.value || '',
          ram: product.specifications?.find((spec: Specification) => spec.name === 'RAM')?.value || '',
          storage: product.specifications?.find((spec: Specification) => spec.name === 'Storage')?.value || '',
          color: product.specifications?.find((spec: Specification) => spec.name === 'Color')?.value || '',
          condition: product.specifications?.find((spec: Specification) => spec.name === 'Condition')?.value || '',
          features: product.specifications?.filter((spec: Specification) => spec.name === 'Feature').map((spec: Specification) => spec.value) || [],
          price: product.price.toString(),
          salePrice: product.salePrice?.toString() || '',
          quantity: product.stock.toString(),
          sku: product.sku || '',
          tags: product.tags?.map((tag: Tag) => tag.name).join(', ') || '',
          seoTitle: product.seoTitle || '',
          seoDescription: product.seoDescription || '',
        });
      } catch (err: unknown) {
        if (
          typeof err === 'object' &&
          err !== null &&
          'response' in err &&
          typeof (err as { response?: { data?: { message?: string } } }).response?.data?.message === 'string'
        ) {
          setError((err as { response: { data: { message: string } } }).response.data.message || 'Failed to fetch product details.');
        } else {
          setError('Failed to fetch product details.');
        }
      }
    };

    fetchProduct();
  }, [productId, token]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked, value } = e.target;
    if (name === 'condition') {
      setFormData({ ...formData, condition: value });
    } else if (name === 'features') {
      setFormData((prevData) => ({
        ...prevData,
        features: checked
          ? [...prevData.features, value]
          : prevData.features.filter((feature) => feature !== value),
      }));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setProductImages([...productImages, ...Array.from(e.target.files)]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setError('Authentication required.');
      return;
    }
    setLoading(true);
    setError(null);
    setSuccess(null);

    const specifications = [];
    if (formData.brand && formData.model) {
      specifications.push({ name: 'Brand', value: formData.brand });
      specifications.push({ name: 'Model', value: formData.model });
    }
    if (formData.ram) specifications.push({ name: 'RAM', value: formData.ram });
    if (formData.storage) specifications.push({ name: 'Storage', value: formData.storage });
    if (formData.color) specifications.push({ name: 'Color', value: formData.color });
    if (formData.condition) specifications.push({ name: 'Condition', value: formData.condition });
    formData.features.forEach(feature => specifications.push({ name: 'Feature', value: feature }));

    const tags = formData.tags ? formData.tags.split(',').map(tag => ({ name: tag.trim() })) : [];

    const productData = {
      name: formData.productTitle,
      description: formData.description,
      price: parseFloat(formData.price),
      stock: parseInt(formData.quantity),
      imageUrl: productImages.length > 0 ? URL.createObjectURL(productImages[0]) : undefined,
      specifications: specifications.length > 0 ? specifications : undefined,
      tags: tags.length > 0 ? tags : undefined,
    };

    try {
      const response = await productService.updateProduct(productId as string, productData);
      setSuccess('Product updated successfully!');
      console.log('Product updated:', response);
    } catch (err: unknown) {
      if (
        typeof err === 'object' &&
        err !== null &&
        'response' in err &&
        typeof (err as { response?: { data?: { message?: string } } }).response?.data?.message === 'string'
      ) {
        setError((err as { response: { data: { message: string } } }).response.data.message || 'Failed to update product.');
      } else {
        setError('Failed to update product.');
      }
      console.error('Error updating product:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <Link href="/seller-dashboard/products" className="text-purple-600 hover:underline mb-4 inline-block">
        &larr; Back to Products
      </Link>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Edit Product Details</h1>
      <p className="text-gray-600 mb-8">Update your product information</p>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* General Information */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">General Information</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="productTitle" className="block text-sm font-medium text-gray-700">Product Title *</label>
              <input
                type="text"
                name="productTitle"
                id="productTitle"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                placeholder="Enter Product Name"
                value={formData.productTitle}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description *</label>
              <textarea
                name="description"
                id="description"
                rows={4}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                placeholder="Enter Product Description"
                value={formData.description}
                onChange={handleChange}
              ></textarea>
            </div>
          </div>
        </div>

        {/* Product Images */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Product Images</h2>
          <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
            <p className="text-gray-500 mb-2">Drag & drop product images or click to browse (up to 4 images each)</p>
            <input type="file" multiple accept="image/*" className="hidden" id="productImageUpload" onChange={handleImageUpload} />
            <label htmlFor="productImageUpload" className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer">
              Select Files
            </label>
            <div className="mt-4 flex flex-wrap justify-center gap-4">
              {productImages.map((file, index) => (
                <Image key={index} src={URL.createObjectURL(file)} alt={`Product Image ${index + 1}`} width={96} height={96} className="w-24 h-24 object-cover rounded-md border border-gray-200" />
              ))}
            </div>
          </div>
        </div>

        {/* Category */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Category *</h2>
          <select
            name="category"
            id="category"
            required
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md"
            value={formData.category}
            onChange={handleChange}
          >
            <option value="">Select Category</option>
            <option>Mobile Phones</option>
            {/* Populate with dynamic categories */}
          </select>
        </div>

        {/* Specifications */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex justify-between items-center">
            Specifications
            <button type="button" className="text-purple-600 hover:text-purple-700 text-sm font-medium">+ Add another specification</button>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="brand" className="block text-sm font-medium text-gray-700">Brand *</label>
              <select
                name="brand"
                id="brand"
                required
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md"
                value={formData.brand}
                onChange={handleChange}
              >
                <option value="">Select Brand</option>
                {/* Dynamic brands */}
              </select>
            </div>
            <div>
              <label htmlFor="model" className="block text-sm font-medium text-gray-700">Model *</label>
              <input
                type="text"
                name="model"
                id="model"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                placeholder="Enter Model"
                value={formData.model}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="ram" className="block text-sm font-medium text-gray-700">RAM *</label>
              <select
                name="ram"
                id="ram"
                required
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md"
                value={formData.ram}
                onChange={handleChange}
              >
                <option value="">Select Ram</option>
                {/* Dynamic RAM options */}
              </select>
            </div>
            <div>
              <label htmlFor="storage" className="block text-sm font-medium text-gray-700">Storage *</label>
              <select
                name="storage"
                id="storage"
                required
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md"
                value={formData.storage}
                onChange={handleChange}
              >
                <option value="">Select Storage</option>
                {/* Dynamic Storage options */}
              </select>
            </div>
            <div className="col-span-2">
              <label htmlFor="color" className="block text-sm font-medium text-gray-700">Colour *</label>
              <select
                name="color"
                id="color"
                required
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md"
                value={formData.color}
                onChange={handleChange}
              >
                <option value="">Select Colour</option>
                {/* Dynamic color options */}
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700">Condition *</label>
              <div className="mt-2 grid grid-cols-2 gap-4">
                <label className="inline-flex items-center">
                  <input type="radio" name="condition" value="New" checked={formData.condition === 'New'} onChange={handleCheckboxChange} className="h-4 w-4 text-purple-600 border-gray-300 focus:ring-purple-500" />
                  <span className="ml-2 text-sm text-gray-700">New</span>
                </label>
                <label className="inline-flex items-center">
                  <input type="radio" name="condition" value="Open Box" checked={formData.condition === 'Open Box'} onChange={handleCheckboxChange} className="h-4 w-4 text-purple-600 border-gray-300 focus:ring-purple-500" />
                  <span className="ml-2 text-sm text-gray-700">Open Box</span>
                </label>
                <label className="inline-flex items-center">
                  <input type="radio" name="condition" value="Refurbished" checked={formData.condition === 'Refurbished'} onChange={handleCheckboxChange} className="h-4 w-4 text-purple-600 border-gray-300 focus:ring-purple-500" />
                  <span className="ml-2 text-sm text-gray-700">Refurbished</span>
                </label>
                <label className="inline-flex items-center">
                  <input type="radio" name="condition" value="Used" checked={formData.condition === 'Used'} onChange={handleCheckboxChange} className="h-4 w-4 text-purple-600 border-gray-300 focus:ring-purple-500" />
                  <span className="ml-2 text-sm text-gray-700">Used</span>
                </label>
                <label className="inline-flex items-center">
                  <input type="radio" name="condition" value="Good" checked={formData.condition === 'Good'} onChange={handleCheckboxChange} className="h-4 w-4 text-purple-600 border-gray-300 focus:ring-purple-500" />
                  <span className="ml-2 text-sm text-gray-700">Good</span>
                </label>
                <label className="inline-flex items-center">
                  <input type="radio" name="condition" value="Acceptable" checked={formData.condition === 'Acceptable'} onChange={handleCheckboxChange} className="h-4 w-4 text-purple-600 border-gray-300 focus:ring-purple-500" />
                  <span className="ml-2 text-sm text-gray-700">Acceptable</span>
                </label>
                <label className="inline-flex items-center">
                  <input type="radio" name="condition" value="Defective" checked={formData.condition === 'Defective'} onChange={handleCheckboxChange} className="h-4 w-4 text-purple-600 border-gray-300 focus:ring-purple-500" />
                  <span className="ml-2 text-sm text-gray-700">Defective</span>
                </label>
                <button type="button" className="text-purple-600 hover:text-purple-700 text-sm font-medium text-left">+ Add condition</button>
              </div>
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700">Features *</label>
              <div className="mt-2 grid grid-cols-2 gap-4">
                <label className="inline-flex items-center">
                  <input type="checkbox" name="features" value="5G" checked={formData.features.includes('5G')} onChange={handleCheckboxChange} className="h-4 w-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500" />
                  <span className="ml-2 text-sm text-gray-700">5G</span>
                </label>
                <label className="inline-flex items-center">
                  <input type="checkbox" name="features" value="Wireless Charging" checked={formData.features.includes('Wireless Charging')} onChange={handleCheckboxChange} className="h-4 w-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500" />
                  <span className="ml-2 text-sm text-gray-700">Wireless Charging</span>
                </label>
                <label className="inline-flex items-center">
                  <input type="checkbox" name="features" value="Face ID" checked={formData.features.includes('Face ID')} onChange={handleCheckboxChange} className="h-4 w-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500" />
                  <span className="ml-2 text-sm text-gray-700">Face ID</span>
                </label>
                <label className="inline-flex items-center">
                  <input type="checkbox" name="features" value="NFC" checked={formData.features.includes('NFC')} onChange={handleCheckboxChange} className="h-4 w-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500" />
                  <span className="ml-2 text-sm text-gray-700">NFC</span>
                </label>
                <label className="inline-flex items-center">
                  <input type="checkbox" name="features" value="Fingerprint" checked={formData.features.includes('Fingerprint')} onChange={handleCheckboxChange} className="h-4 w-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500" />
                  <span className="ml-2 text-sm text-gray-700">Fingerprint</span>
                </label>
                <label className="inline-flex items-center">
                  <input type="checkbox" name="features" value="Water Resistant" checked={formData.features.includes('Water Resistant')} onChange={handleCheckboxChange} className="h-4 w-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500" />
                  <span className="ml-2 text-sm text-gray-700">Water Resistant</span>
                </label>
                <button type="button" className="text-purple-600 hover:text-purple-700 text-sm font-medium text-left">+ Add another feature</button>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing & Inventory */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Pricing & Inventory</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price ($) *</label>
              <input
                type="number"
                name="price"
                id="price"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                placeholder="0.00"
                value={formData.price}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="salePrice" className="block text-sm font-medium text-gray-700">Sale Price ($)</label>
              <input
                type="number"
                name="salePrice"
                id="salePrice"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                placeholder="0.00"
                value={formData.salePrice}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">Quantity *</label>
              <input
                type="number"
                name="quantity"
                id="quantity"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                placeholder="0"
                value={formData.quantity}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="sku" className="block text-sm font-medium text-gray-700">SKU</label>
              <input
                type="text"
                name="sku"
                id="sku"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                placeholder="e.g. MP-001"
                value={formData.sku}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="inline-flex items-center">
              <input type="checkbox" className="h-4 w-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500" />
              <span className="ml-2 text-sm text-gray-700">Enable Negotiation</span>
            </label>
          </div>
        </div>

        {/* Additional Information */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Additional Information</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700">Tags</label>
              <input
                type="text"
                name="tags"
                id="tags"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                placeholder="e.g. smartphone, android, 5G (separate with commas)"
                value={formData.tags}
                onChange={handleChange}
              />
              <p className="mt-2 text-sm text-gray-500">Tags help buyers find your product when searching</p>
            </div>
            <div>
              <label htmlFor="seoTitle" className="block text-sm font-medium text-gray-700">SEO Title</label>
              <input
                type="text"
                name="seoTitle"
                id="seoTitle"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                placeholder="Custom titles for search engines"
                value={formData.seoTitle}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="seoDescription" className="block text-sm font-medium text-gray-700">SEO Description</label>
              <textarea
                name="seoDescription"
                id="seoDescription"
                rows={3}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                placeholder="Custom description for search engines"
                value={formData.seoDescription}
                onChange={handleChange}
              ></textarea>
            </div>
          </div>
        </div>

        {success && <div className="text-green-600 mt-4">{success}</div>}
        {error && <div className="text-red-600 mt-4">{error}</div>}

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            disabled={loading}
          >
            Discard
          </button>
          <button
            type="submit"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            disabled={loading}
          >
            {loading ? 'Updating...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
} 