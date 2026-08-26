import PublicLayout from "@/components/PublicLayout";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function Pricing() {
  return (
    <PublicLayout>
      <section className="w-full max-w-7xl mx-auto px-6 py-16 md:py-24">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-[#1a202c] mb-6 font-serif">Simple, Transparent Pricing</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose the right plan to grow your school with Springdrill. No hidden fees.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto items-start">
          
          {/* Standard Plan */}
          <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Standard</h3>
            <p className="text-gray-500 mb-6 text-sm">Essential tools for modern schools</p>
            <div className="mb-6">
              <span className="text-4xl font-bold text-gray-900">₦200</span>
              <span className="text-gray-500"> / student / term</span>
            </div>
            <Link href="/contact">
              <Button className="w-full bg-[#f8fafc] hover:bg-gray-100 text-gray-900 border border-gray-200 rounded-lg py-6 font-semibold mb-8">
                Get Started
              </Button>
            </Link>
            
            <ul className="space-y-4 text-sm text-gray-700">
              <li className="flex items-center gap-3"><Check size={18} className="text-[#176b4d]" /> Student & Admin Portals</li>
              <li className="flex items-center gap-3"><Check size={18} className="text-[#176b4d]" /> Class Roster & 360° View</li>
              <li className="flex items-center gap-3"><Check size={18} className="text-[#176b4d]" /> Daily Attendance Tracker</li>
              <li className="flex items-center gap-3"><Check size={18} className="text-[#176b4d]" /> School CBT Exams</li>
              <li className="flex items-center gap-3"><Check size={18} className="text-[#176b4d]" /> Subject Notes & Materials</li>
              <li className="flex items-center gap-3"><Check size={18} className="text-[#176b4d]" /> Performance Results & Reports</li>
              <li className="flex items-center gap-3"><Check size={18} className="text-[#176b4d]" /> Basic Communications</li>
              <li className="flex items-center gap-3 text-gray-400"><X size={18} /> JAMB / UTME Simulator</li>
              <li className="flex items-center gap-3 text-gray-400"><X size={18} /> Live eClassroom</li>
              <li className="flex items-center gap-3 text-gray-400"><X size={18} /> AI Lesson Planner</li>
              <li className="flex items-center gap-3 text-gray-400"><X size={18} /> Fee & Payments Management</li>
            </ul>
          </div>

          {/* Premium Plan */}
          <div className="bg-[#125c3a] rounded-2xl p-8 border border-[#125c3a] shadow-xl relative transform md:-translate-y-4">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#7dcb71] text-[#0a331f] text-xs font-bold uppercase tracking-wider py-1 px-4 rounded-full">
              Recommended
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Premium</h3>
            <p className="text-green-100 mb-6 text-sm">Everything you need for full digitization</p>
            <div className="mb-6">
              <span className="text-4xl font-bold text-white">₦800</span>
              <span className="text-green-100"> / student / term</span>
            </div>
            <Link href="/contact">
              <Button className="w-full bg-[#7dcb71] hover:bg-[#68ad5e] text-[#0a331f] border-none rounded-lg py-6 font-bold mb-8 transition-colors">
                Get Started
              </Button>
            </Link>
            
            <ul className="space-y-4 text-sm text-white">
              <li className="flex items-center gap-3"><Check size={18} className="text-[#7dcb71]" /> All Standard Features</li>
              <li className="flex items-center gap-3"><Check size={18} className="text-[#7dcb71]" /> JAMB / UTME Simulator</li>
              <li className="flex items-center gap-3"><Check size={18} className="text-[#7dcb71]" /> Live eClassroom (Virtual Classes)</li>
              <li className="flex items-center gap-3"><Check size={18} className="text-[#7dcb71]" /> AI Lesson Planner for Teachers</li>
              <li className="flex items-center gap-3"><Check size={18} className="text-[#7dcb71]" /> Real UTME Hub</li>
              <li className="flex items-center gap-3"><Check size={18} className="text-[#7dcb71]" /> Fee & Payments Management</li>
              <li className="flex items-center gap-3"><Check size={18} className="text-[#7dcb71]" /> Bulk Uploader & Data Management</li>
              <li className="flex items-center gap-3"><Check size={18} className="text-[#7dcb71]" /> Priority Support</li>
            </ul>
          </div>

          {/* Enterprise Plan */}
          <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Enterprise</h3>
            <p className="text-gray-500 mb-6 text-sm">Custom solutions for large groups</p>
            <div className="mb-6">
              <span className="text-4xl font-bold text-gray-900">Custom</span>
            </div>
            <Link href="/contact">
              <Button className="w-full bg-[#f8fafc] hover:bg-gray-100 text-gray-900 border border-gray-200 rounded-lg py-6 font-semibold mb-8">
                Contact Us
              </Button>
            </Link>
            
            <ul className="space-y-4 text-sm text-gray-700">
              <li className="flex items-center gap-3"><Check size={18} className="text-[#176b4d]" /> All Premium Features</li>
              <li className="flex items-center gap-3"><Check size={18} className="text-[#176b4d]" /> Multi-Campus / Multi-School Setup</li>
              <li className="flex items-center gap-3"><Check size={18} className="text-[#176b4d]" /> Custom Feature Development</li>
              <li className="flex items-center gap-3"><Check size={18} className="text-[#176b4d]" /> White Labeling</li>
              <li className="flex items-center gap-3"><Check size={18} className="text-[#176b4d]" /> Dedicated Account Manager</li>
              <li className="flex items-center gap-3"><Check size={18} className="text-[#176b4d]" /> On-site Training & Onboarding</li>
            </ul>
          </div>

        </div>
      </section>
    </PublicLayout>
  );
}
