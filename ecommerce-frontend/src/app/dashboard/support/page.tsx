"use client";

export default function SupportPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Support</h1>
      <p className="text-gray-600 mb-8">Need help? Find answers to common questions or contact us directly.</p>

      <div className="bg-white rounded-lg shadow p-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Frequently Asked Questions (FAQ)</h2>
        <div className="space-y-4 mb-8">
          {/* Placeholder for FAQ items */}
        </div>

        <h2 className="text-xl font-bold text-gray-900 mb-4">Contact Us</h2>
        <p className="text-gray-700 mb-4">If you cannot find the answer to your question, please feel free to reach out to our support team.</p>
        <div className="space-y-2">
          <p className="text-gray-700">Email: <a href="mailto:support@example.com" className="text-purple-600 hover:underline">support@example.com</a></p>
          <p className="text-gray-700">Phone: +1 (123) 456-7890</p>
          <p className="text-gray-700">Live Chat: Available during business hours (Click here to start chat)</p>
        </div>
      </div>
    </div>
  );
} 