import { Link } from "wouter";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col font-sans bg-white selection:bg-[#125c3a] selection:text-white overflow-x-hidden">
      {/* Navigation */}
      <header className="w-full bg-white px-8 py-4 flex justify-between items-center sticky top-0 z-50 border-b border-gray-100 shadow-sm">
        <div className="flex items-center cursor-pointer">
          <Link href="/">
            <img src="/greenledger-logo.png" alt="Green Ledger" className="h-8 w-auto" />
          </Link>
        </div>
        
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
          <div className="group relative cursor-pointer flex items-center gap-1 hover:text-[#125c3a]">
            Products <ChevronDown size={14} />
          </div>
          <div className="group relative cursor-pointer flex items-center gap-1 hover:text-[#125c3a]">
            Industries Served <ChevronDown size={14} />
          </div>
          <a href="#" className="hover:text-[#125c3a]">Pricing</a>
          <a href="#" className="hover:text-[#125c3a]">Resources</a>
          <div className="group relative cursor-pointer flex items-center gap-1 hover:text-[#125c3a]">
            Company <ChevronDown size={14} />
          </div>
        </nav>

        <div className="flex items-center gap-4">
          <Link href="/login">
            <button className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">
              Log in
            </button>
          </Link>
          <Link href="/login">
            <Button className="bg-[#176b4d] hover:bg-[#115a40] text-white rounded-full px-6 shadow-md transition-all">
              Sign Up
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center w-full">
        {children}
      </main>

      {/* Footer */}
      <footer className="w-full bg-[#0a1128] text-white pt-16 pb-8 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          <div className="col-span-2">
            <div className="mb-4 bg-white p-2 rounded inline-block cursor-pointer">
              <Link href="/">
                <img src="/greenledger-logo.png" alt="Green Ledger" className="h-6 w-auto" />
              </Link>
            </div>
            <p className="text-gray-400 text-sm max-w-sm mb-6">
              The premium ecosystem for education, professional marketers, and businesses. Bringing Springdrill and Sovira together.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-4">Products</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/login" className="hover:text-white transition-colors">Springdrill Portal</Link></li>
              <li><Link href="/login" className="hover:text-white transition-colors">CBT Application</Link></li>
              <li><a href="https://www.sovira.com.ng/" className="hover:text-white transition-colors">Sovira AI</a></li>
              <li><a href="https://miacertificate.vercel.app" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">MIA Exam Portal</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Web Development</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Games</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/careers" className="hover:text-white transition-colors">Careers</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Free Tools</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Data Analyzer</a></li>
              <li><a href="#" className="hover:text-white transition-colors">AI Text Humanizer</a></li>
              <li><a href="#" className="hover:text-white transition-colors">InstantSite</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
          <p>&copy; {new Date().getFullYear()} Green Ledger (Dorvas Technologies). All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <a href="#" className="hover:text-white">Twitter</a>
            <a href="#" className="hover:text-white">LinkedIn</a>
            <a href="#" className="hover:text-white">YouTube</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
