import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="max-w-5xl mx-auto p-8 text-gray-800 bg-white shadow-lg rounded-2xl mt-10 mb-10">
      <h1 className="text-4xl font-extrabold mb-6 text-center text-gray-900">Privacy Policy</h1>

      <p className="mb-6 text-lg">
        Welcome to <strong>Postonomy</strong>. We are committed to protecting your privacy and ensuring a safe user experience. This Privacy Policy explains how we collect, use, share, and safeguard your information when you interact with our platform.
      </p>

      <h2 className="text-2xl font-bold mt-10 mb-4">1. Information We Collect</h2>
      <p className="mb-4 text-md">
        We collect the following categories of information:
      </p>
      <ul className="list-disc list-inside space-y-2 text-md">
        <li>Personal identification information (Name, email address, phone number, etc.)</li>
        <li>Account credentials and authentication tokens</li>
        <li>Technical data (IP address, browser type, OS, referring URLs, etc.)</li>
        <li>User activity data, including pages visited, features used, and session duration</li>
        <li>User-generated content such as blog posts, media, and comments</li>
      </ul>

      <h2 className="text-2xl font-bold mt-10 mb-4">2. How We Use Your Information</h2>
      <ul className="list-disc list-inside space-y-2 text-md">
        <li>To operate, personalize, and improve the Postonomy experience</li>
        <li>To manage user accounts and preferences</li>
        <li>To process payments and track monetization</li>
        <li>To communicate service-related updates and marketing (with consent)</li>
        <li>To detect and prevent fraud, spam, abuse, and policy violations</li>
      </ul>

      <h2 className="text-2xl font-bold mt-10 mb-4">3. Sharing of Information</h2>
      <p className="mb-4 text-md">
        We may share your information with:
      </p>
      <ul className="list-disc list-inside space-y-2 text-md">
        <li>Third-party service providers (e.g., payment processors, analytics tools)</li>
        <li>Law enforcement, if required by law or to protect rights/safety</li>
        <li>Affiliates, subsidiaries, and business partners for platform operations</li>
      </ul>

      <h2 className="text-2xl font-bold mt-10 mb-4">4. Cookies and Tracking Technologies</h2>
      <p className="mb-4 text-md">
        We use cookies and similar technologies to analyze traffic, remember user preferences, and deliver targeted content. You can manage cookie settings through your browser.
      </p>

      <h2 className="text-2xl font-bold mt-10 mb-4">5. Data Retention</h2>
      <p className="mb-4 text-md">
        We retain personal data only as long as necessary to provide services and fulfill the purposes outlined in this policy. Users may request account deletion at any time.
      </p>

      <h2 className="text-2xl font-bold mt-10 mb-4">6. Data Security</h2>
      <p className="mb-4 text-md">
        We implement appropriate security measures, including encryption, secure servers, and access control, to protect user data from unauthorized access or disclosure.
      </p>

      <h2 className="text-2xl font-bold mt-10 mb-4">7. Your Rights</h2>
      <p className="mb-4 text-md">
        You may request access, correction, or deletion of your data. If you are in the EU or UK, you have rights under GDPR including data portability and the right to restrict processing.
      </p>

      <h2 className="text-2xl font-bold mt-10 mb-4">8. Children's Privacy</h2>
      <p className="mb-4 text-md">
        Our platform is not directed to children under 13. We do not knowingly collect information from anyone under that age. If we become aware of such data, we will delete it.
      </p>

      <h2 className="text-2xl font-bold mt-10 mb-4">9. Changes to This Policy</h2>
      <p className="mb-4 text-md">
        We may update this Privacy Policy from time to time. We encourage users to review this page periodically to stay informed. The updated policy will be effective upon posting.
      </p>

      <h2 className="text-2xl font-bold mt-10 mb-4">10. Contact Us</h2>
      <p className="mb-6 text-md">
        If you have questions about this Privacy Policy or our data practices, please contact us at:
        <br />
        <strong>Email:</strong> <a href="mailto:privacy@postonomy.org" className="text-blue-600 underline">privacy@postonomy.org</a>
      </p>

      <p className="text-sm text-gray-500 mt-10">
        Last Updated: {new Date().toLocaleDateString()}
      </p>
    </div>
  );
};

export default PrivacyPolicy;