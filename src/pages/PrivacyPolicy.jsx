import React from 'react';

export default function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto px-4">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Privacy Policy</h1>
      <div className="prose dark:prose-invert">
        <p className="text-gray-600 dark:text-gray-300">
          At MND, we prioritize your privacy and are committed to protecting your personal information. This Privacy Policy outlines how we collect, use, and safeguard the information you provide when using our services.
        </p>
        <p className="text-gray-600 dark:text-gray-300 mt-4">
          We only collect data necessary to improve your experience, such as contact details and browsing activity. Your information is never shared with third parties without your explicit consent, except where required by law.
        </p>
        <p className="text-gray-600 dark:text-gray-300 mt-4">
          By using our platform, you agree to this Privacy Policy. We recommend reviewing this policy periodically for updates. If you have any questions, feel free to contact us at privacy@MND.com.
        </p>
      </div>
    </div>
  );
}