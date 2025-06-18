"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { customerApi } from '@/services/api';

interface CartItem {
  id: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: number;
    imageUrl?: string;
    stock: number;
    description?: string;
  };
}

interface Address {
  id: string;
  type: 'Home' | 'Work' | 'Other';
  details: string;
  isDefault: boolean;
}

export default function CheckoutPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [addressForm, setAddressForm] = useState({
    type: 'Home',
    details: '',
    fullName: '',
    phoneNumber: '',
    email: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    zip: '',
    country: '',
    state: '',
    isDefault: false,
  });
  const [showNewAddress, setShowNewAddress] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'gateway' | 'cod'>('gateway');
  const [gatewayAcknowledged, setGatewayAcknowledged] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [placingOrder, setPlacingOrder] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchCart();
    fetchAddresses();
  }, []);

  const fetchCart = async () => {
    try {
      const data = await customerApi.getCart();
      setCartItems(data);
    } catch (err: any) {
      setError('Failed to fetch cart items.');
    }
  };

  const fetchAddresses = async () => {
    try {
      const data = await customerApi.getAddresses();
      setAddresses(data);
      const defaultAddr = data.find((a: Address) => a.isDefault);
      if (defaultAddr) setSelectedAddressId(defaultAddr.id);
    } catch (err: any) {
      setError('Failed to fetch addresses.');
    }
  };

  const handleAddressSelect = (id: string) => {
    setSelectedAddressId(id);
    setShowNewAddress(false);
  };

  const handleAddressFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setAddressForm({ ...addressForm, [e.target.name]: e.target.value });
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const details = `${addressForm.fullName}, ${addressForm.phoneNumber}, ${addressForm.email}, ${addressForm.addressLine1}, ${addressForm.addressLine2}, ${addressForm.city}, ${addressForm.state}, ${addressForm.zip}, ${addressForm.country}`;
      const newAddr = await customerApi.addAddress({
        type: addressForm.type,
        details,
        isDefault: addressForm.isDefault,
      });
      setAddresses([...addresses, newAddr]);
      setSelectedAddressId(newAddr.id);
      setShowNewAddress(false);
    } catch (err: any) {
      setError('Failed to add address.');
    }
  };

  const calculateSubtotal = () => cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const calculateShipping = () => (cartItems.length > 0 ? 10 : 0);
  const calculateTax = () => calculateSubtotal() * 0.08;
  const calculateTotal = () => calculateSubtotal() + calculateShipping() + calculateTax();

  const handlePlaceOrder = async () => {
    setError(null);
    setSuccess(null);
    setPlacingOrder(true);
    try {
      let shippingAddress = '';
      if (showNewAddress) {
        shippingAddress = `${addressForm.fullName}, ${addressForm.phoneNumber}, ${addressForm.email}, ${addressForm.addressLine1}, ${addressForm.addressLine2}, ${addressForm.city}, ${addressForm.state}, ${addressForm.zip}, ${addressForm.country}`;
      } else {
        const addr = addresses.find(a => a.id === selectedAddressId);
        if (addr) shippingAddress = addr.details;
      }
      if (!shippingAddress) {
        setError('Please select or enter a shipping address.');
        setPlacingOrder(false);
        return;
      }
      if (paymentMethod === 'gateway' && !gatewayAcknowledged) {
        setError('You must acknowledge the payment gateway notice.');
        setPlacingOrder(false);
        return;
      }
      await customerApi.placeOrder({
        shippingAddress,
        paymentMethod: paymentMethod === 'gateway' ? 'GATEWAY' : 'COD',
      });
      setSuccess('Order placed successfully!');
      router.push('/dashboard/my-orders');
    } catch (err: any) {
      setError('Failed to place order.');
    } finally {
      setPlacingOrder(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Checkout</h1>
      <p className="text-gray-600 mb-8">Please review and complete your purchase</p>
      {/* Progress Steps */}
      <div className="flex items-center space-x-4 mb-8">
        <div className="flex items-center space-x-2">
          <span className="w-6 h-6 flex items-center justify-center rounded-full bg-purple-600 text-white font-bold">1</span>
          <span className="font-medium text-purple-700">Cart</span>
        </div>
        <span className="h-0.5 w-8 bg-gray-300"></span>
        <div className="flex items-center space-x-2">
          <span className="w-6 h-6 flex items-center justify-center rounded-full bg-purple-600 text-white font-bold">2</span>
          <span className="font-medium text-purple-700">Checkout</span>
        </div>
        <span className="h-0.5 w-8 bg-gray-300"></span>
        <div className="flex items-center space-x-2">
          <span className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-200 text-gray-400 font-bold">3</span>
          <span className="font-medium text-gray-400">Confirmation</span>
        </div>
      </div>
      {/* Main Checkout Card */}
      <div className="bg-white rounded-lg shadow p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Shipping Information */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Shipping Information</h2>
          {/* Saved Addresses */}
          <div className="mb-6">
            <div className="flex space-x-4 mb-2">
              {addresses.map(addr => (
                <button
                  key={addr.id}
                  className={`flex-1 border rounded-lg p-4 text-left ${selectedAddressId === addr.id && !showNewAddress ? 'border-purple-600 bg-purple-50' : 'border-gray-200 bg-gray-50'} transition`}
                  onClick={() => handleAddressSelect(addr.id)}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium">{addr.type}</span>
                    {addr.isDefault && <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full ml-2">Default</span>}
                  </div>
                  <div className="text-xs text-gray-600">{addr.details}</div>
                </button>
              ))}
              <button
                className={`flex-1 border rounded-lg p-4 text-center border-dashed ${showNewAddress ? 'border-purple-600 bg-purple-50' : 'border-gray-200 bg-gray-50'} transition`}
                onClick={() => { setShowNewAddress(true); setSelectedAddressId(null); }}
              >
                <span className="text-purple-600 font-medium">+ New Address</span>
              </button>
            </div>
          </div>
          {/* Address Form */}
          {showNewAddress && (
            <form className="space-y-4 mb-6" onSubmit={handleAddAddress}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Full Name *</label>
                  <input name="fullName" value={addressForm.fullName} onChange={handleAddressFormChange} required className="w-full border rounded px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Phone Number *</label>
                  <input name="phoneNumber" value={addressForm.phoneNumber} onChange={handleAddressFormChange} required className="w-full border rounded px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email *</label>
                  <input name="email" value={addressForm.email} onChange={handleAddressFormChange} required className="w-full border rounded px-3 py-2" />
                </div>
                <div></div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1">Address Line 1 *</label>
                  <input name="addressLine1" value={addressForm.addressLine1} onChange={handleAddressFormChange} required className="w-full border rounded px-3 py-2" />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1">Address Line 2 (Optional)</label>
                  <input name="addressLine2" value={addressForm.addressLine2} onChange={handleAddressFormChange} className="w-full border rounded px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">City *</label>
                  <input name="city" value={addressForm.city} onChange={handleAddressFormChange} required className="w-full border rounded px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Zip/Postal Code *</label>
                  <input name="zip" value={addressForm.zip} onChange={handleAddressFormChange} required className="w-full border rounded px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Country *</label>
                  <input name="country" value={addressForm.country} onChange={handleAddressFormChange} required className="w-full border rounded px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">State/Province *</label>
                  <input name="state" value={addressForm.state} onChange={handleAddressFormChange} required className="w-full border rounded px-3 py-2" />
                </div>
              </div>
              <div className="flex items-center mt-2">
                <input type="checkbox" name="isDefault" checked={addressForm.isDefault} onChange={e => setAddressForm({ ...addressForm, isDefault: e.target.checked })} className="mr-2" />
                <span className="text-sm">Set as default address</span>
              </div>
              <button type="submit" className="bg-purple-600 text-white px-4 py-2 rounded-md mt-2">Save Address</button>
            </form>
          )}
          {/* Payment Method */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-2">Payment Method</h3>
            <div className="mb-4">
              <div className={`p-4 rounded border mb-2 ${paymentMethod === 'gateway' ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-gray-50'}`}>
                <div className="flex items-center mb-2">
                  <span className="mr-2">🔒</span>
                  <span className="font-medium">You will be redirected to XYZ gateway, to complete your transaction.</span>
                </div>
                <p className="text-xs text-gray-600 mb-2">XYZ gateway supports all major payment methods including credit/debit cards, mobile banking, and digital wallets.</p>
                <div className="flex items-center">
                  <input type="checkbox" id="gatewayAck" checked={gatewayAcknowledged} onChange={e => setGatewayAcknowledged(e.target.checked)} className="mr-2" />
                  <label htmlFor="gatewayAck" className="text-xs">I understand I will complete my payment via a secure external gateway (SSLCommerz).</label>
                </div>
                <p className="text-xs text-red-500 mt-1">* This acknowledgment is required before placing your order.</p>
              </div>
              <div className={`p-4 rounded border flex items-center space-x-2 ${paymentMethod === 'cod' ? 'border-green-400 bg-green-50' : 'border-gray-200 bg-gray-50'}`}>
                <input type="radio" id="cod" name="paymentMethod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} className="mr-2" />
                <label htmlFor="cod" className="font-medium">Cash On Delivery</label>
                <span className="ml-2 text-xs text-gray-500">Payment collected upon delivery</span>
              </div>
            </div>
          </div>
        </div>
        {/* Order Summary */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
          <div className="bg-gray-50 rounded-lg p-6 mb-4">
            {cartItems.length === 0 ? (
              <div className="text-gray-500 text-center">Your cart is empty.</div>
            ) : (
              <div className="space-y-4">
                {cartItems.map(item => (
                  <div key={item.id} className="flex items-center space-x-4 border-b pb-4 last:border-b-0">
                    <div className="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center overflow-hidden">
                      {item.product.imageUrl ? (
                        <img src={item.product.imageUrl} alt={item.product.name} className="object-cover w-full h-full" />
                      ) : (
                        <span className="text-gray-400">No Image</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 truncate">{item.product.name}</div>
                      <div className="text-xs text-gray-500 truncate">{item.product.description || ''}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-gray-900">${item.product.price.toFixed(2)}</div>
                      <div className="text-xs text-gray-500">Quantity: {item.quantity}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          {/* Promo Code */}
          <div className="flex items-center mb-4">
            <input
              type="text"
              placeholder="Enter a promo code"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
              value={promoCode}
              onChange={e => setPromoCode(e.target.value)}
              disabled
            />
            <button className="px-4 py-2 bg-gray-200 text-gray-500 rounded-r-md cursor-not-allowed" disabled>Apply</button>
          </div>
          {/* Summary Table */}
          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between text-gray-700">
              <span>Subtotal</span>
              <span>${calculateSubtotal().toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span>Shipping</span>
              <span>${calculateShipping().toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span>Tax</span>
              <span>${calculateTax().toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg mt-2">
              <span>Total</span>
              <span>${calculateTotal().toFixed(2)}</span>
            </div>
          </div>
          {/* Error/Success */}
          {error && <div className="mt-4 text-red-600 text-sm">{error}</div>}
          {success && <div className="mt-4 text-green-600 text-sm">{success}</div>}
          {/* Actions */}
          <div className="flex justify-between mt-8">
            <button
              className="px-4 py-2 border border-red-500 text-red-500 rounded-md hover:bg-red-50"
              onClick={() => router.push('/dashboard/cart')}
              disabled={placingOrder}
            >
              Cancel
            </button>
            <button
              className="px-6 py-2 bg-red-500 text-white rounded-md font-semibold hover:bg-red-600 disabled:opacity-50"
              onClick={handlePlaceOrder}
              disabled={placingOrder || cartItems.length === 0}
            >
              {placingOrder ? 'Placing Order...' : 'Place Order'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 