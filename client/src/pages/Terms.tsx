import PublicLayout from "@/components/PublicLayout";

export default function Terms() {
  return (
    <PublicLayout>
      <section className="w-full max-w-4xl mx-auto px-6 py-16 md:py-24">
        <h1 className="text-4xl font-bold text-[#1a202c] mb-4 font-serif">Terms of Service</h1>
        <p className="text-gray-500 mb-10">Last updated: {new Date().toLocaleDateString()}</p>
        
        <div className="prose prose-lg text-gray-700 max-w-none space-y-6">
          <p>
            Welcome to Green Ledger (Dorvas Technologies). By accessing or using our websites, products, and services (including Springdrill, Sovira AI, and MIA Exam Portal), you agree to be bound by these Terms of Service. Please read them carefully.
          </p>

          <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">1. Acceptance of Terms</h3>
          <p>
            By accessing our services, you confirm that you have read, understood, and agreed to these terms. If you do not agree with any part of these terms, you must not use our services.
          </p>

          <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2. Use of Services</h3>
          <p>
            You agree to use our services only for lawful purposes and in accordance with these Terms. You are responsible for ensuring that your use of the services does not violate any applicable local, national, or international law, including the <strong>laws of the Federal Republic of Nigeria</strong> and the <strong>EU General Data Protection Regulation (GDPR)</strong>.
          </p>
          <p>
            For educational tools like Springdrill, users must be authorized by their respective institutions (schools or universities) to access specific data.
          </p>

          <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">3. Intellectual Property Rights</h3>
          <p>
            The services and their entire contents, features, and functionality (including but not limited to all information, software, text, displays, images, video, and audio) are owned by Green Ledger, its licensors, or other providers of such material and are protected by copyright, trademark, patent, trade secret, and other intellectual property laws.
          </p>

          <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">4. User Accounts</h3>
          <p>
            If you are provided with a user account, you are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must notify us immediately of any unauthorized use of your account.
          </p>

          <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">5. Limitation of Liability</h3>
          <p>
            In no event will Green Ledger, its affiliates, or their licensors, service providers, employees, agents, officers, or directors be liable for damages of any kind, under any legal theory, arising out of or in connection with your use, or inability to use, our services.
          </p>

          <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">6. Governing Law</h3>
          <p>
            These terms and any dispute or claim arising out of or in connection with them shall be governed by and construed in accordance with the laws of the Federal Republic of Nigeria, with considerations for EU regulations where applicable to EU citizens.
          </p>

          <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">7. Contact Information</h3>
          <p>
            If you have any questions or concerns about these Terms, please contact us at: <br/>
            <strong>Email:</strong> <a href="mailto:microsoftportharcourt@gmail.com" className="text-[#176b4d] hover:underline">microsoftportharcourt@gmail.com</a><br/>
            <strong>Phone:</strong> +234 816 233 7303
          </p>
        </div>
      </section>
    </PublicLayout>
  );
}
