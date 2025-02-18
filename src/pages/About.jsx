import React from 'react';

export default function About() {
  return (
    <div className="max-w-4xl mx-auto px-4">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">About Us</h1>
      <div className="prose dark:prose-invert">
        <p className="text-gray-600 dark:text-gray-300">
          Welcome to MND, your trusted destination for finding the perfect vehicle. We are passionate about connecting car enthusiasts with their dream cars, offering a wide selection of quality vehicles at competitive prices.
        </p>
        <p className="text-gray-600 dark:text-gray-300 mt-4">
          Our team of experts carefully curates each listing to ensure you have access to the best vehicles on the market. Whether you're looking for a practical daily driver or a luxury vehicle, we're here to help you make the right choice.
        </p>
      </div>
    </div>
  );
}