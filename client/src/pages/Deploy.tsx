import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import PublicLayout from "@/components/PublicLayout";

export default function Deploy() {
  return (
    <PublicLayout>
      <div className="w-full max-w-lg mx-auto px-6 py-16 md:py-24">
        <div className="bg-white p-8 md:p-10 rounded-2xl border border-gray-100 shadow-xl">
          <div className="flex justify-center mb-8">
             <img src="/greenledger-logo.png" alt="Green Ledger" className="h-10 w-auto" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Sign up and deploy your school in seconds.
          </h2>

          <form action="https://formsubmit.co/microsoftportharcourt@gmail.com" method="POST" className="space-y-5">
            <input type="hidden" name="_subject" value="New Springdrill Deployment Request!" />
            {/* Direct user to a success page or back to home after submission */}
            <input type="hidden" name="_next" value="https://greenledger-theta.vercel.app/" />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
              <input type="text" name="name" required className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#176b4d] outline-none" placeholder="Your full name" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Organisation *</label>
              <input type="text" name="organisation" required className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#176b4d] outline-none" placeholder="e.g., Emmanuel Academy" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
              <input type="email" name="email" required className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#176b4d] outline-none" placeholder="you@school.edu.ng" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
              <div className="flex">
                <span className="inline-flex items-center px-4 rounded-l-lg border border-r-0 border-gray-200 bg-gray-50 text-gray-500 sm:text-sm">
                  🇳🇬 +234
                </span>
                <input type="tel" name="phone" required className="flex-1 w-full p-3 border border-gray-200 rounded-r-lg focus:ring-2 focus:ring-[#176b4d] outline-none" placeholder="801 234 5678" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
              <input type="password" name="password" required className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#176b4d] outline-none" placeholder="Create a strong password" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm password *</label>
              <input type="password" name="confirm_password" required className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#176b4d] outline-none" placeholder="Confirm your password" />
            </div>

            <div className="flex items-start pt-2">
              <div className="flex items-center h-5">
                <input id="terms" name="terms" type="checkbox" required className="focus:ring-[#176b4d] h-4 w-4 text-[#176b4d] border-gray-300 rounded" />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="terms" className="font-medium text-gray-700">
                  I agree to Green Ledger <Link href="/terms" className="text-[#176b4d] hover:underline">Terms of Service</Link> and <Link href="/privacy" className="text-[#176b4d] hover:underline">Privacy Policy</Link>.
                </label>
              </div>
            </div>

            <button type="submit" className="w-full bg-[#176b4d] hover:bg-[#115a40] text-white rounded-full px-8 py-4 font-bold transition-all mt-4">
              Continue
            </button>
          </form>
          
          <div className="mt-8 text-center text-sm text-gray-500">
            <p>Already have a Green Ledger Account? <Link href="/login" className="text-[#176b4d] font-semibold hover:underline">LOG IN</Link></p>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
