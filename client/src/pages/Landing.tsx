import { Link } from "wouter";
import { 
  GraduationCap, Bot, Code, Gamepad2, BrainCircuit, 
  ChevronDown, MonitorPlay, ArrowRight, CheckCircle2, ShieldCheck, Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";

import PublicLayout from "@/components/PublicLayout";

export default function Landing() {
  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="w-full max-w-7xl mx-auto px-6 py-16 md:py-24 grid md:grid-cols-2 gap-12 items-center">
        <div className="max-w-2xl">
          <h1 className="text-5xl md:text-6xl font-bold text-[#1a202c] leading-[1.1] mb-6 font-serif">
            Modern digital solutions designed for <span className="text-[#176b4d]">Your Success</span>
          </h1>
          <p className="text-lg text-gray-600 mb-8 leading-relaxed">
            Green Ledger brings <strong>Springdrill</strong> and <strong>Sovira</strong> together. 
            Unlock your potential with cutting-edge software solutions. Whether you need a robust school ERP, advanced AI deployment, or a custom web platform—we have a modular solution for every need.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <Link href="/login">
              <Button className="bg-[#176b4d] hover:bg-[#115a40] text-white rounded-full px-8 py-6 text-base shadow-lg transition-all flex items-center gap-2">
                Get Started <ArrowRight size={18} />
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
          <div className="absolute w-[450px] h-[450px] rounded-full border border-[#dce5dd] flex items-center justify-center relative">
            <div className="absolute w-[280px] h-[280px] rounded-full border-[8px] border-white shadow-[0_12px_40px_rgba(23,107,77,0.25)] overflow-hidden flex items-center justify-center z-10 bg-[#e8f3e9]">
              <img src="/ceo.jpg" alt="CEO" className="w-full h-full object-cover" />
            </div>
            
            {/* Orbiting Icons */}
            <div className="absolute top-[5%] left-[20%] flex flex-col items-center gap-2 animate-bounce" style={{ animationDuration: '4s' }}>
              <div className="w-14 h-14 bg-white rounded-full shadow-lg flex items-center justify-center text-[#176b4d] border border-gray-100"><GraduationCap size={24} /></div>
              <span className="text-xs font-semibold text-gray-600">School Portal</span>
            </div>
            <div className="absolute top-[10%] right-[10%] flex flex-col items-center gap-2 animate-bounce" style={{ animationDuration: '5s' }}>
              <div className="w-14 h-14 bg-white rounded-full shadow-lg flex items-center justify-center text-[#125c3a] border border-gray-100"><Bot size={24} /></div>
              <span className="text-xs font-semibold text-gray-600">Sovira AI</span>
            </div>
            <div className="absolute bottom-[20%] left-[5%] flex flex-col items-center gap-2 animate-bounce" style={{ animationDuration: '4.5s' }}>
              <div className="w-14 h-14 bg-white rounded-full shadow-lg flex items-center justify-center text-[#7dcb71] border border-gray-100"><Code size={24} /></div>
              <span className="text-xs font-semibold text-gray-600">Web Dev</span>
            </div>
            <div className="absolute bottom-[10%] right-[20%] flex flex-col items-center gap-2 animate-bounce" style={{ animationDuration: '3.5s' }}>
              <div className="w-14 h-14 bg-white rounded-full shadow-lg flex items-center justify-center text-emerald-600 border border-gray-100"><Gamepad2 size={24} /></div>
              <span className="text-xs font-semibold text-gray-600">Games</span>
            </div>
            <div className="absolute top-[45%] right-[-5%] flex flex-col items-center gap-2 animate-bounce" style={{ animationDuration: '5.5s' }}>
              <div className="w-14 h-14 bg-white rounded-full shadow-lg flex items-center justify-center text-teal-600 border border-gray-100"><MonitorPlay size={24} /></div>
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
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Springdrill */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-all group cursor-pointer">
              <div className="w-12 h-12 bg-[#e8f3e9] text-[#176b4d] rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <GraduationCap size={24} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Springdrill</h3>
              <p className="text-gray-600 mb-6 line-clamp-3">
                A comprehensive School Portal and CBT (Computer Based Testing) Application suite designed to modernize education and assessment workflows.
              </p>
              <div className="flex flex-col gap-2 mb-6">
                <span className="text-sm font-medium flex items-center gap-2"><CheckCircle2 size={14} className="text-[#176b4d]"/> Student & Admin Portals</span>
                <span className="text-sm font-medium flex items-center gap-2"><CheckCircle2 size={14} className="text-[#176b4d]"/> CBT Examination Engine</span>
                <span className="text-sm font-medium flex items-center gap-2"><CheckCircle2 size={14} className="text-[#176b4d]"/> Automated Grading & Reports</span>
              </div>
              <Link href="/login">
                <span className="text-[#176b4d] font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">Launch Springdrill <ArrowRight size={16}/></span>
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
              <div className="w-12 h-12 bg-[#e8f3e9] text-[#176b4d] rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Zap size={24} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Dev & Studios</h3>
              <p className="text-gray-600 mb-6 line-clamp-3">
                Bespoke Web Development Services and immersive Game design to accelerate your brand's digital footprint and user engagement.
              </p>
              <div className="flex flex-col gap-2 mb-6">
                <span className="text-sm font-medium flex items-center gap-2"><CheckCircle2 size={14} className="text-[#176b4d]"/> Custom Web Applications</span>
                <span className="text-sm font-medium flex items-center gap-2"><CheckCircle2 size={14} className="text-[#176b4d]"/> Interactive Web Games</span>
                <span className="text-sm font-medium flex items-center gap-2"><CheckCircle2 size={14} className="text-[#176b4d]"/> Cloud Hosting & Deployment</span>
              </div>
              <a href="#" className="text-[#176b4d] font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">Explore Services <ArrowRight size={16}/></a>
            </div>

            {/* MIA Exam Portal */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-all group cursor-pointer relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-gradient-to-bl from-[#e8f3e9] p-12 rounded-bl-[100%] opacity-50"></div>
              <div className="w-12 h-12 bg-[#e8f3e9] text-[#125c3a] rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform relative z-10">
                <BrainCircuit size={24} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3 relative z-10">MIA Exam Portal</h3>
              <p className="text-gray-600 mb-6 line-clamp-3 relative z-10">
                Microsoft Imagine Academy Student Portal. Verify and download your official Microsoft certificates securely and instantly.
              </p>
              <div className="flex flex-col gap-2 mb-6 relative z-10">
                <span className="text-sm font-medium flex items-center gap-2"><CheckCircle2 size={14} className="text-[#125c3a]"/> Certificate Verification</span>
                <span className="text-sm font-medium flex items-center gap-2"><CheckCircle2 size={14} className="text-[#125c3a]"/> Student Record Management</span>
                <span className="text-sm font-medium flex items-center gap-2"><CheckCircle2 size={14} className="text-[#125c3a]"/> Instant Downloads</span>
              </div>
              <a href="https://miacertificate.vercel.app" target="_blank" rel="noreferrer" className="text-[#125c3a] font-semibold flex items-center gap-1 group-hover:gap-2 transition-all relative z-10">
                Visit MIA Portal <ArrowRight size={16}/>
              </a>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}

