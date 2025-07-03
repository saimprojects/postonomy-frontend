import React from "react";

const TermsAndConditions = () => {
  return (
    <div className="max-w-5xl mx-auto p-8 text-gray-800 bg-white shadow-lg rounded-2xl mt-10 mb-10">
      <h1 className="text-4xl font-extrabold mb-6 text-center text-gray-900">Terms and Conditions</h1>

      <p className="mb-6 text-lg">
        Welcome to <strong>Postonomy</strong>. By accessing or using our website and services, you agree to be bound by these Terms and Conditions. Please read them carefully before using our platform.
      </p>

      <h2 className="text-2xl font-bold mt-10 mb-4">1. Acceptance of Terms</h2>
      <p className="mb-4 text-md">
        By creating an account or using Postonomy, you agree to comply with and be legally bound by these Terms, our Privacy Policy, and all applicable laws.
      </p>

      <h2 className="text-2xl font-bold mt-10 mb-4">2. User Responsibilities</h2>
      <ul className="list-disc list-inside space-y-2 text-md">
        <li>Provide accurate and complete registration information</li>
        <li>Maintain confidentiality of your login credentials</li>
        <li>Not engage in unlawful, abusive, or harmful behavior</li>
        <li>Not post or share any illegal, offensive, or infringing content</li>
      </ul>

      <h2 className="text-2xl font-bold mt-10 mb-4">3. Content Ownership</h2>
      <p className="mb-4 text-md">
        You retain ownership of your content. By posting on Postonomy, you grant us a non-exclusive, royalty-free, worldwide license to use, display, and distribute your content in connection with the platform.
      </p>

      <h2 className="text-2xl font-bold mt-10 mb-4">4. Monetization and Payments</h2>
      <p className="mb-4 text-md">
        Users participating in monetization must comply with additional policies. Payments are subject to verification, minimum thresholds, and may be processed via third-party gateways like Payoneer or Stripe.
      </p>

      <h2 className="text-2xl font-bold mt-10 mb-4">5. Termination of Access</h2>
      <p className="mb-4 text-md">
        We reserve the right to suspend or terminate any account for violations of these Terms or suspected malicious activity without prior notice.
      </p>

      <h2 className="text-2xl font-bold mt-10 mb-4">6. Intellectual Property</h2>
      <p className="mb-4 text-md">
        All platform features, branding, design, and intellectual property belong to Postonomy unless otherwise stated. Unauthorized use is prohibited.
      </p>

      <h2 className="text-2xl font-bold mt-10 mb-4">7. Limitation of Liability</h2>
      <p className="mb-4 text-md">
        We are not liable for any indirect, incidental, or consequential damages arising from the use or inability to use our platform, even if we have been advised of the possibility of such damages.
      </p>

      <h2 className="text-2xl font-bold mt-10 mb-4">8. Changes to These Terms</h2>
      <p className="mb-4 text-md">
        We may revise these Terms at any time. Continued use of Postonomy after changes means you accept the revised Terms. Please review them periodically.
      </p>

      <h2 className="text-2xl font-bold mt-10 mb-4">9. Governing Law</h2>
      <p className="mb-4 text-md">
        These Terms shall be governed by the laws of Pakistan. Any disputes shall be resolved in the courts of Lahore, Pakistan.
      </p>

      <h2 className="text-2xl font-bold mt-10 mb-4">10. Contact Information</h2>
      <p className="mb-6 text-md">
        If you have any questions or concerns regarding these Terms, contact us at:
        <br />
        <strong>Email:</strong> <a href="mailto:legal@postonomy.org" className="text-blue-600 underline">legal@postonomy.org</a>
      </p>

      <p className="text-sm text-gray-500 mt-10">
        Last Updated: {new Date().toLocaleDateString()}
      </p>
    </div>
  );
};

export default TermsAndConditions;
