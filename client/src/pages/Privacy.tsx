import PublicLayout from "@/components/PublicLayout";

export default function Privacy() {
  return (
    <PublicLayout>
      <section className="w-full max-w-4xl mx-auto px-6 py-16 md:py-24">
        <h1 className="text-4xl font-bold text-[#1a202c] mb-4 font-serif">Privacy Policy</h1>
        <p className="text-gray-500 mb-10">Last updated: {new Date().toLocaleDateString()}</p>
        
        <div className="prose prose-lg text-gray-700 max-w-none space-y-6">
          <p>
            At Green Ledger (Dorvas Technologies), we respect your privacy and are committed to protecting your personal data. This Privacy Policy informs you about how we look after your personal data when you visit our website or use our applications (Springdrill, Sovira, MIA Exam Portal, etc.), and tells you about your privacy rights and how the law protects you.
          </p>

          <p>
            This policy is compliant with the <strong>Nigeria Data Protection Regulation (NDPR)</strong> and the <strong>General Data Protection Regulation (GDPR)</strong> of the European Union.
          </p>

          <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">1. Information We Collect</h3>
          <p>
            We may collect, use, store and transfer different kinds of personal data about you, including:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Identity Data:</strong> First name, last name, username or similar identifier.</li>
            <li><strong>Contact Data:</strong> Email address and telephone numbers.</li>
            <li><strong>Technical Data:</strong> Internet protocol (IP) address, your login data, browser type and version, time zone setting and location, and operating system.</li>
            <li><strong>Educational Data (for Springdrill/MIA):</strong> Academic records, attendance, and exam results strictly managed under school administration authorization.</li>
          </ul>

          <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2. How We Use Your Data</h3>
          <p>
            We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Where we need to perform the contract we are about to enter into or have entered into with you (or your institution).</li>
            <li>Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.</li>
            <li>Where we need to comply with a legal or regulatory obligation.</li>
          </ul>

          <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">3. Data Security</h3>
          <p>
            We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used, or accessed in an unauthorized way, altered, or disclosed. We limit access to your personal data to those employees, agents, contractors, and other third parties who have a business need to know. They will only process your personal data on our instructions and they are subject to a duty of confidentiality.
          </p>

          <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">4. Your Legal Rights</h3>
          <p>
            Under certain circumstances, you have rights under data protection laws in relation to your personal data, including the right to:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Request access to your personal data.</li>
            <li>Request correction of your personal data.</li>
            <li>Request erasure of your personal data.</li>
            <li>Object to processing of your personal data.</li>
            <li>Request restriction of processing your personal data.</li>
            <li>Request transfer of your personal data.</li>
          </ul>

          <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">5. Contact Us</h3>
          <p>
            If you have any questions about this privacy policy or our privacy practices, please contact us at: <br/>
            <strong>Email:</strong> <a href="mailto:microsoftportharcourt@gmail.com" className="text-[#176b4d] hover:underline">microsoftportharcourt@gmail.com</a><br/>
            <strong>Phone:</strong> +234 816 233 7303
          </p>
        </div>
      </section>
    </PublicLayout>
  );
}
