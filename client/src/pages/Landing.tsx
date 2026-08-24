import { Link } from "wouter";
import { 
  GraduationCap, Bot, Code, Gamepad2, BrainCircuit, 
  ChevronDown, MonitorPlay, ArrowRight, CheckCircle2, ShieldCheck, Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Landing() {
  return (
    <div className="min-h-screen flex flex-col font-sans bg-white selection:bg-[#125c3a] selection:text-white overflow-x-hidden">
      {/* Navigation */}
      <header className="w-full bg-white px-8 py-4 flex justify-between items-center sticky top-0 z-50 border-b border-gray-100 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#125c3a] flex items-center justify-center text-white font-bold text-xl">
            G
          </div>
          <h1 className="text-xl font-bold tracking-tight text-gray-900">Green Ledger</h1>
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
            <Button className="bg-[#0e8ce4] hover:bg-[#0c7ac6] text-white rounded-full px-6 shadow-md transition-all">
              Sign Up
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center">
        <section className="w-full max-w-7xl mx-auto px-6 py-16 md:py-24 grid md:grid-cols-2 gap-12 items-center">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 font-semibold text-xs mb-6 uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
              The Definitive Tech Ecosystem
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-[#1a202c] leading-[1.1] mb-6">
              Modern digital solutions designed for <span className="text-[#0e8ce4]">Your Success</span>
            </h1>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Green Ledger brings <strong>Springdrill</strong> and <strong>Sovira</strong> together. 
              Unlock your potential with cutting-edge software solutions. Whether you need a robust school ERP, advanced AI deployment, or a custom web platform—we have a modular solution for every need.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Link href="/login">
                <Button className="bg-[#0e8ce4] hover:bg-[#0c7ac6] text-white rounded-full px-8 py-6 text-base shadow-lg transition-all flex items-center gap-2">
                  Deploy in Seconds <ArrowRight size={18} />
                </Button>
              </Link>
              <Button variant="outline" className="rounded-full px-8 py-6 text-base text-gray-700 border-gray-300 hover:bg-gray-50">
                Request a Demo
              </Button>
            </div>
            
            <div className="mt-10 flex items-center gap-6 text-sm font-medium text-gray-500">
              <span className="flex items-center gap-1.5"><CheckCircle2 size={16} className="text-green-500"/> No credit card required</span>
              <span className="flex items-center gap-1.5"><ShieldCheck size={16} className="text-green-500"/> Bank-grade security</span>
            </div>
          </div>
          
          <div className="relative flex justify-center items-center h-[500px]">
            {/* Circular Graphic reminiscent of educare */}
            <div className="absolute w-[450px] h-[450px] rounded-full border border-blue-100 flex items-center justify-center relative">
              <div className="absolute w-[300px] h-[300px] rounded-full border border-blue-50 bg-blue-50/30 flex items-center justify-center">
                <div className="w-48 h-48 rounded-full bg-gradient-to-tr from-[#0e8ce4] to-[#125c3a] p-1 shadow-2xl">
                   <div className="w-full h-full bg-white rounded-full flex flex-col items-center justify-center text-center p-4">
                     <div className="w-12 h-12 bg-gray-900 rounded-lg text-white flex items-center justify-center font-bold text-2xl mb-2">GL</div>
                     <span className="font-bold text-gray-900">Green Ledger</span>
                     <span className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Ecosystem</span>
                   </div>
                </div>
              </div>
              
              {/* Orbiting Icons */}
              <div className="absolute top-[5%] left-[20%] flex flex-col items-center gap-2 animate-bounce" style={{ animationDuration: '4s' }}>
                <div className="w-14 h-14 bg-white rounded-full shadow-lg flex items-center justify-center text-blue-500 border border-gray-100"><GraduationCap size={24} /></div>
                <span className="text-xs font-semibold text-gray-600">School Portal</span>
              </div>
              <div className="absolute top-[10%] right-[10%] flex flex-col items-center gap-2 animate-bounce" style={{ animationDuration: '5s' }}>
                <div className="w-14 h-14 bg-white rounded-full shadow-lg flex items-center justify-center text-purple-500 border border-gray-100"><Bot size={24} /></div>
                <span className="text-xs font-semibold text-gray-600">Sovira AI</span>
              </div>
              <div className="absolute bottom-[20%] left-[5%] flex flex-col items-center gap-2 animate-bounce" style={{ animationDuration: '4.5s' }}>
                <div className="w-14 h-14 bg-white rounded-full shadow-lg flex items-center justify-center text-green-500 border border-gray-100"><Code size={24} /></div>
                <span className="text-xs font-semibold text-gray-600">Web Dev</span>
              </div>
              <div className="absolute bottom-[10%] right-[20%] flex flex-col items-center gap-2 animate-bounce" style={{ animationDuration: '3.5s' }}>
                <div className="w-14 h-14 bg-white rounded-full shadow-lg flex items-center justify-center text-amber-500 border border-gray-100"><Gamepad2 size={24} /></div>
                <span className="text-xs font-semibold text-gray-600">Games</span>
              </div>
              <div className="absolute top-[45%] right-[-5%] flex flex-col items-center gap-2 animate-bounce" style={{ animationDuration: '5.5s' }}>
                <div className="w-14 h-14 bg-white rounded-full shadow-lg flex items-center justify-center text-rose-500 border border-gray-100"><MonitorPlay size={24} /></div>
                <span className="text-xs font-semibold text-gray-600">CBT Engine</span>
              </div>
            </div>
          </div>
        </section>

        {/* Unified Ecosystem Section */}
        <section className="w-full bg-[#f8fafc] py-20 px-6 border-t border-gray-100">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">One Unified Ecosystem</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">Discover the suite of applications powered by Green Ledger Technologies.</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {/* Springdrill */}
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-all group cursor-pointer">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <GraduationCap size={24} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Springdrill</h3>
                <p className="text-gray-600 mb-6 line-clamp-3">
                  A comprehensive School Portal and CBT (Computer Based Testing) Application suite designed to modernize education and assessment workflows.
                </p>
                <div className="flex flex-col gap-2 mb-6">
                  <span className="text-sm font-medium flex items-center gap-2"><CheckCircle2 size={14} className="text-blue-500"/> Student & Admin Portals</span>
                  <span className="text-sm font-medium flex items-center gap-2"><CheckCircle2 size={14} className="text-blue-500"/> CBT Examination Engine</span>
                  <span className="text-sm font-medium flex items-center gap-2"><CheckCircle2 size={14} className="text-blue-500"/> Automated Grading & Reports</span>
                </div>
                <Link href="/login">
                  <span className="text-blue-600 font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">Launch Springdrill <ArrowRight size={16}/></span>
                </Link>
              </div>

              {/* Sovira */}
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-all group cursor-pointer relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-gradient-to-bl from-purple-100 p-12 rounded-bl-[100%] opacity-50"></div>
                <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform relative z-10">
                  <Bot size={24} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3 relative z-10">Sovira AI</h3>
                <p className="text-gray-600 mb-6 line-clamp-3 relative z-10">
                  The world's most powerful AI Search & Content Platform. High-converting audits, semantic SEO research, and generative intelligence.
                </p>
                <div className="flex flex-col gap-2 mb-6 relative z-10">
                  <span className="text-sm font-medium flex items-center gap-2"><CheckCircle2 size={14} className="text-purple-500"/> Generative Engine Optimization</span>
                  <span className="text-sm font-medium flex items-center gap-2"><CheckCircle2 size={14} className="text-purple-500"/> AI Text Humanizer</span>
                  <span className="text-sm font-medium flex items-center gap-2"><CheckCircle2 size={14} className="text-purple-500"/> Stealth AI Integrations</span>
                </div>
                <a href="https://www.sovira.com.ng/" target="_blank" rel="noreferrer" className="text-purple-600 font-semibold flex items-center gap-1 group-hover:gap-2 transition-all relative z-10">
                  Visit Sovira <ArrowRight size={16}/>
                </a>
              </div>

              {/* Dev & Games */}
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-all group cursor-pointer">
                <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Zap size={24} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Dev & Studios</h3>
                <p className="text-gray-600 mb-6 line-clamp-3">
                  Bespoke Web Development Services and immersive Game design to accelerate your brand's digital footprint and user engagement.
                </p>
                <div className="flex flex-col gap-2 mb-6">
                  <span className="text-sm font-medium flex items-center gap-2"><CheckCircle2 size={14} className="text-green-500"/> Custom Web Applications</span>
                  <span className="text-sm font-medium flex items-center gap-2"><CheckCircle2 size={14} className="text-green-500"/> Interactive Web Games</span>
                  <span className="text-sm font-medium flex items-center gap-2"><CheckCircle2 size={14} className="text-green-500"/> Cloud Hosting & Deployment</span>
                </div>
                <a href="#" className="text-green-600 font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">Explore Services <ArrowRight size={16}/></a>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full bg-[#0a1128] text-white pt-16 pb-8 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded bg-white text-[#0a1128] flex items-center justify-center font-bold text-xl">G</div>
              <span className="text-xl font-bold tracking-tight">Green Ledger</span>
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
              <li><a href="#" className="hover:text-white transition-colors">Web Development</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Games</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
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

