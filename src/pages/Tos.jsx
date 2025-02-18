import React from 'react';

export default function TermsOfService() {
  return (
    <div className="max-w-4xl mx-auto px-4">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Terms of Service</h1>
      <div className="prose dark:prose-invert">
        <p className="text-gray-600 dark:text-gray-300">
          Welcome to MND. By accessing or using our platform, you agree to comply with and be bound by the following Terms of Service. Please read them carefully before using our services.
        </p>
        <p className="text-gray-600 dark:text-gray-300 mt-4">
          You are responsible for ensuring that your use of our services complies with all applicable laws and regulations. Unauthorized use of our platform is strictly prohibited and may result in the termination of your access.
        </p>
        <p className="text-gray-600 dark:text-gray-300 mt-4">
          We reserve the right to modify these Terms of Service at any time. Continued use of our platform following any changes indicates your acceptance of the revised terms. If you have any questions, please contact us at tos@MND.com.
        </p>
      </div>
    </div>
  );
}