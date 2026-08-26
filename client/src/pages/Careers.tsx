import PublicLayout from "@/components/PublicLayout";
import { Button } from "@/components/ui/button";

export default function Careers() {
  return (
    <PublicLayout>
      <section className="w-full max-w-4xl mx-auto px-6 py-16 md:py-24">
        <h1 className="text-4xl md:text-5xl font-bold text-[#1a202c] mb-8 font-serif">Careers at Green Ledger</h1>
        <div className="prose prose-lg text-gray-700 max-w-none">
          <p className="mb-8">
            Join a dynamic team that is reshaping the future of educational technology and digital infrastructure. At Green Ledger, we believe in innovation, collaboration, and continuous growth.
          </p>
          
          <div className="bg-gray-50 border border-gray-100 rounded-2xl p-8 text-center mt-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">No open positions right now</h3>
            <p className="text-gray-600 mb-6">
              We are not actively hiring at the moment, but we are always on the lookout for talented individuals. Feel free to send us your resume, and we'll keep you in mind for future opportunities.
            </p>
            <a href="mailto:microsoftportharcourt@gmail.com">
              <Button className="bg-[#176b4d] hover:bg-[#115a40] text-white rounded-full px-8">
                Submit Your Resume
              </Button>
            </a>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
