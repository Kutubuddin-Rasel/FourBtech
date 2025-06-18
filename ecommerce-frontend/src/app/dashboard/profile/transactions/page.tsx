"use client";

import { useState } from 'react';

interface Transaction {
  id: string;
  productName: string;
  date: string;
  amount: number;
  transactionId: string;
  status: 'Paid' | 'Pending' | 'Failed';
}

export default function TransactionsTab() {
  const [transactions, setTransactions] = useState<Transaction[]>([]); // This will be populated from the database

  const handleDownloadReceipt = (id: string) => {
    // TODO: Implement logic to download receipt
    console.log('Download Receipt clicked for ID:', id);
  };

  return (
    <div className="space-y-8">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Payment Transactions</h2>
      <p className="text-gray-600 mb-8">Track your payments and download receipts. All transactions are securely processed via XYZ gateway.</p>

      <div className="space-y-6">
        {transactions.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
            No transactions found.
          </div>
        ) : (
          transactions.map((transaction) => (
            <div key={transaction.id} className="bg-white rounded-lg shadow p-6 relative">
              <span className={`absolute top-4 right-4 text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                transaction.status === 'Paid' ? 'bg-green-100 text-green-700' :
                transaction.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                'bg-red-100 text-red-700'
              }`}>
                {transaction.status}
              </span>
              <h3 className="text-lg font-medium text-gray-900 mb-2">{transaction.productName}</h3>
              <p className="text-sm text-gray-500 mb-1">${transaction.amount.toFixed(2)}</p>
              <p className="text-sm text-gray-500 mb-4">{transaction.date}</p>
              <p className="text-sm text-gray-700 mb-4">Transaction ID: {transaction.transactionId}</p>
              <button
                onClick={() => handleDownloadReceipt(transaction.id)}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Download Receipt
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
} 