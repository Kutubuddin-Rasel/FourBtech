"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { sellerApi } from '@/services/api';

interface OrderDetail {
  orderId: string;
  productImage: string;
  productName: string;
  quantity: number;
  condition: string;
  status: string;
  timeline: {
    label: string;
    date: string;
    isCompleted: boolean;
  }[];
  buyerInformation: {
    name: string;
    email: string;
    shippingAddress: string;
  };
  paymentInfo: {
    subtotal: number;
    shipping: number;
    tax: number;
    discount: number;
    total: number;
    paymentMethod: string;
    paymentStatus: string;
  };
}

export default function OrderDetailsPage() {
  const params = useParams();
  const orderId = params.orderId as string;

  const [orderDetails, setOrderDetails] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const data = await sellerApi.getOrderDetails(orderId);
        setOrderDetails(data);
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch order details');
        console.error('Error fetching order details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  if (loading) {
    return (
      <div className="container mx-auto py-8 text-center text-gray-600">
        Loading order details...
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 text-center text-red-600">
        Error: {error}
      </div>
    );
  }

  if (!orderDetails) {
    return (
      <div className="container mx-auto py-8 text-center text-gray-600">
        Order not found for ID: {orderId}
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Order Details</h1>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Order #{orderDetails.orderId}</h2>
              <p className="text-gray-600">Status: {orderDetails.status}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              orderDetails.status === 'Delivered' ? 'bg-green-100 text-green-800' :
              orderDetails.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
              orderDetails.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {orderDetails.status}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Product Information</h3>
              <div className="flex items-start space-x-4">
                <img
                  src={orderDetails.productImage}
                  alt={orderDetails.productName}
                  className="w-24 h-24 object-cover rounded-lg"
                />
                <div>
                  <p className="font-medium text-gray-900">{orderDetails.productName}</p>
                  <p className="text-gray-600">Quantity: {orderDetails.quantity}</p>
                  <p className="text-gray-600">Condition: {orderDetails.condition}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Buyer Information</h3>
              <div className="space-y-2">
                <p className="text-gray-600">Name: {orderDetails.buyerInformation.name}</p>
                <p className="text-gray-600">Email: {orderDetails.buyerInformation.email}</p>
                <p className="text-gray-600">Shipping Address: {orderDetails.buyerInformation.shippingAddress}</p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Order Timeline</h3>
            <div className="space-y-4">
              {orderDetails.timeline.map((step, index) => (
                <div key={index} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step.isCompleted ? 'bg-green-500' : 'bg-gray-200'
                  }`}>
                    {step.isCompleted ? (
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <span className="text-gray-500">{index + 1}</span>
                    )}
                  </div>
                  <div className="ml-4">
                    <p className="font-medium text-gray-900">{step.label}</p>
                    <p className="text-sm text-gray-500">{step.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6 mt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Information</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-900">${orderDetails.paymentInfo.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-gray-900">${orderDetails.paymentInfo.shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="text-gray-900">${orderDetails.paymentInfo.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Discount</span>
                  <span className="text-gray-900">-${orderDetails.paymentInfo.discount.toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-200 pt-2 mt-2">
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-900">Total</span>
                    <span className="font-medium text-gray-900">${orderDetails.paymentInfo.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-gray-600">Payment Method: {orderDetails.paymentInfo.paymentMethod}</p>
                <p className="text-gray-600">Payment Status: {orderDetails.paymentInfo.paymentStatus}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 