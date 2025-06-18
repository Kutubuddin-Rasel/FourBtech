"use client";

export default function SellerPaymentsPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Payments</h1>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Payment History</h2>
        <p className="text-gray-600">This section will display your payment transaction history.</p>
        {/* You can add a table for transactions here, similar to the orders page */}
      </div>
    </div>
  );
} 