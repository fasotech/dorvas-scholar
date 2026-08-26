import { Link } from "wouter";
import { 
  GraduationCap, Bot, Code, Gamepad2, BrainCircuit, 
  MonitorPlay, ArrowRight, CheckCircle2, ShieldCheck,
  Building2, HeartPulse, Globe2, Landmark
} from "lucide-react";
import { Button } from "@/components/ui/button";
import PublicLayout from "@/components/PublicLayout";

export default function Landing() {
  return (
    <PublicLayout>
      {/* Section 1 - Hero */}
      <section className="w-full max-w-7xl mx-auto px-6 py-16 md:py-24 grid md:grid-cols-2 gap-12 items-center">
        <div className="max-w-2xl">
          <p className="text-sm md:text-base font-bold text-[#176b4d] uppercase tracking-[0.15em] mb-4">
            For Schools, Hospitals, NGOs & Government
          </p>
          <h1 className="text-5xl md:text-6xl font-bold text-[#1a202c] leading-[1.1] mb-6 font-serif tracking-tight">
            Software That Doesn't Break Under Pressure.
          </h1>
          <p className="text-lg text-gray-600 mb-8 leading-relaxed">
            GreenLedger unites Springdrill and Sovira's engineering teams to deliver school ERPs, AI systems, and custom platforms — built fast, built right, and built to scale with you.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <Link href="/deploy">
              <Button className="bg-[#176b4d] hover:bg-[#115a40] text-white rounded-full px-8 py-6 text-base shadow-lg transition-all flex items-center gap-2">
                Sign Up and Deploy <ArrowRight size={18} />
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" className="rounded-full px-8 py-6 text-base text-gray-700 border-gray-300 hover:bg-gray-50">
                Request a Demo
              </Button>
            </Link>
          </div>
          
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm font-medium text-gray-600">
            <span className="flex items-center gap-2"><CheckCircle2 size={16} className="text-[#176b4d] shrink-0"/> No credit card required</span>
            <span className="flex items-center gap-2"><ShieldCheck size={16} className="text-[#176b4d] shrink-0"/> Bank-grade security</span>
            <span className="flex items-center gap-2"><CheckCircle2 size={16} className="text-[#176b4d] shrink-0"/> Delivered by a dedicated team of engineers, not freelancers</span>
            <span className="flex items-center gap-2"><CheckCircle2 size={16} className="text-[#176b4d] shrink-0"/> Built for schools, hospitals, NGOs & government — not generic templates</span>
          </div>
        </div>
        
        <div className="relative flex justify-center items-center h-[500px] mt-10 md:mt-0">
          <div className="absolute w-[300px] h-[300px] md:w-[450px] md:h-[450px] rounded-full border border-[#dce5dd] flex items-center justify-center relative">
            <div className="absolute w-[200px] h-[200px] md:w-[280px] md:h-[280px] rounded-full border-[8px] border-white shadow-[0_12px_40px_rgba(23,107,77,0.25)] overflow-hidden flex items-center justify-center z-10 bg-[#e8f3e9]">
              <img src="/ceo.jpg" alt="CEO" className="w-full h-full object-cover" />
            </div>
            
            {/* Orbiting Icons */}
            <div className="absolute top-[5%] left-[10%] md:left-[20%] flex flex-col items-center gap-2 animate-bounce" style={{ animationDuration: '4s' }}>
              <div className="w-12 h-12 md:w-14 md:h-14 bg-white rounded-full shadow-lg flex items-center justify-center text-[#176b4d] border border-gray-100"><GraduationCap size={24} /></div>
              <span className="text-xs font-semibold text-gray-600 hidden md:block">School Portal</span>
            </div>
            <div className="absolute top-[10%] right-[5%] md:right-[10%] flex flex-col items-center gap-2 animate-bounce" style={{ animationDuration: '5s' }}>
              <div className="w-12 h-12 md:w-14 md:h-14 bg-white rounded-full shadow-lg flex items-center justify-center text-[#125c3a] border border-gray-100"><Bot size={24} /></div>
              <span className="text-xs font-semibold text-gray-600 hidden md:block">Sovira AI</span>
            </div>
            <div className="absolute bottom-[20%] left-[-5%] md:left-[5%] flex flex-col items-center gap-2 animate-bounce" style={{ animationDuration: '4.5s' }}>
              <div className="w-12 h-12 md:w-14 md:h-14 bg-white rounded-full shadow-lg flex items-center justify-center text-[#7dcb71] border border-gray-100"><Code size={24} /></div>
              <span className="text-xs font-semibold text-gray-600 hidden md:block">Web Dev</span>
            </div>
            <div className="absolute bottom-[5%] right-[10%] md:right-[20%] flex flex-col items-center gap-2 animate-bounce" style={{ animationDuration: '3.5s' }}>
              <div className="w-12 h-12 md:w-14 md:h-14 bg-white rounded-full shadow-lg flex items-center justify-center text-emerald-600 border border-gray-100"><Gamepad2 size={24} /></div>
              <span className="text-xs font-semibold text-gray-600 hidden md:block">Games</span>
            </div>
            <div className="absolute top-[45%] right-[-10%] md:right-[-5%] flex flex-col items-center gap-2 animate-bounce" style={{ animationDuration: '5.5s' }}>
              <div className="w-12 h-12 md:w-14 md:h-14 bg-white rounded-full shadow-lg flex items-center justify-center text-teal-600 border border-gray-100"><MonitorPlay size={24} /></div>
              <span className="text-xs font-semibold text-gray-600 hidden md:block">CBT Engine</span>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2 - Products Grid */}
      <section className="w-full bg-[#f8fafc] py-20 px-6 border-t border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-serif">Products & Capabilities</h2>
            <p className="text-gray-600 max-w-2xl text-lg">Modular architecture built for operational speed and real-world impact.</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-10 shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="w-14 h-14 bg-[#E6F4EC] text-[#0F7A4D] rounded-full flex items-center justify-center mb-6">
                <GraduationCap size={24} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">School Portal</h3>
              <p className="text-gray-500 text-sm mb-4 italic">"Manual attendance, lost fee records, parents calling the office every week."</p>
              <p className="text-gray-700 leading-relaxed">A school management system that handles fees, attendance, results and parent communication — so your staff stop doing the same admin task three times a day.</p>
            </div>

            <div className="bg-white rounded-2xl p-10 shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="w-14 h-14 bg-[#E6F4EC] text-[#0F7A4D] rounded-full flex items-center justify-center mb-6">
                <Bot size={24} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Sovira AI</h3>
              <p className="text-gray-500 text-sm mb-4 italic">"Everyone's talking about AI. Few schools or businesses are actually using it to save time."</p>
              <p className="text-gray-700 leading-relaxed">AI tools built for real operations — content generation, data analysis, and automation — not a chatbot bolted onto a website for show.</p>
            </div>

            <div className="bg-white rounded-2xl p-10 shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="w-14 h-14 bg-[#E6F4EC] text-[#0F7A4D] rounded-full flex items-center justify-center mb-6">
                <MonitorPlay size={24} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">CBT Engine</h3>
              <p className="text-gray-500 text-sm mb-4 italic">"Paper exams are slow to grade and easy to leak. Manual result processing takes days."</p>
              <p className="text-gray-700 leading-relaxed">Computer-based testing built for schools and training centers — instant grading, exam security, and results your students can trust.</p>
            </div>

            <div className="bg-white rounded-2xl p-10 shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 lg:col-span-1 md:col-span-2 lg:col-start-1">
              <div className="w-14 h-14 bg-[#E6F4EC] text-[#0F7A4D] rounded-full flex items-center justify-center mb-6">
                <Code size={24} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Web Dev</h3>
              <p className="text-gray-500 text-sm mb-4 italic">"Most agencies hand you a template and disappear after launch."</p>
              <p className="text-gray-700 leading-relaxed">Custom-built websites and platforms — from static business sites to full applications — with a team that stays reachable after the invoice is paid.</p>
            </div>

            <div className="bg-white rounded-2xl p-10 shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 lg:col-span-1 md:col-span-1">
              <div className="w-14 h-14 bg-[#E6F4EC] text-[#0F7A4D] rounded-full flex items-center justify-center mb-6">
                <Gamepad2 size={24} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Games</h3>
              <p className="text-gray-500 text-sm mb-4 italic">"Educational content that puts students to sleep instead of engaging them."</p>
              <p className="text-gray-700 leading-relaxed">Interactive and educational game builds designed to make learning stick, not just tick a box.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Client Showcase */}
      <section className="w-full bg-white py-20 px-6 border-t border-gray-100">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-serif">Who We've Built For</h2>
            <p className="text-gray-600 max-w-2xl text-lg mx-auto">Real projects, real teams, real results.</p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-8">
            <div className="bg-[#f8fafc] rounded-2xl p-8 border border-gray-100 max-w-[280px] w-full flex flex-col items-center text-center hover:shadow-md transition-shadow">
              <img src="/crescite.png" alt="Crescite Global Services" className="h-16 object-contain mb-6 mix-blend-multiply" />
              <h3 className="font-bold text-gray-900 mb-2">Crescite Global</h3>
              <p className="text-sm text-gray-600">"Full website rebuild, SEO overhaul, and blog system"</p>
            </div>
            <div className="bg-[#f8fafc] rounded-2xl p-8 border border-gray-100 max-w-[280px] w-full flex flex-col items-center text-center hover:shadow-md transition-shadow">
              <img src="/lacfog.jpg" alt="Lacfog Academy" className="h-16 object-contain mb-6 mix-blend-multiply rounded-md" />
              <h3 className="font-bold text-gray-900 mb-2">Lacfog Academy</h3>
              <p className="text-sm text-gray-600">"Complete school management portal and automated result processing"</p>
            </div>
            <div className="bg-[#f8fafc] rounded-2xl p-8 border border-gray-100 max-w-[280px] w-full flex flex-col items-center text-center hover:shadow-md transition-shadow">
              <img src="/enet.png" alt="E-Net Supreme Academy" className="h-16 object-contain mb-6 mix-blend-multiply" />
              <h3 className="font-bold text-gray-900 mb-2">E-Net Supreme</h3>
              <p className="text-sm text-gray-600">"Custom CBT examination engine and student performance tracking"</p>
            </div>
            <div className="bg-[#f8fafc] rounded-2xl p-8 border border-gray-100 max-w-[280px] w-full flex flex-col items-center text-center hover:shadow-md transition-shadow">
              <img src="/sovira.png" alt="Sovira AI" className="h-16 object-contain mb-6 mix-blend-multiply" />
              <h3 className="font-bold text-gray-900 mb-2">Sovira</h3>
              <p className="text-sm text-gray-600">"AI-driven semantic search engine and content generation platform"</p>
            </div>
            {/* TODO: add client card when available */}
          </div>
        </div>
      </section>

      {/* Section 3 - Industries Served */}
      <section className="w-full bg-white py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-serif">Industries Served</h2>
            <p className="text-gray-600 max-w-2xl text-lg">We deliver software to the sectors that need it most.</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="border-l-4 border-[#176b4d] pl-6 py-2">
              <div className="flex items-center gap-3 mb-4 text-[#1a202c]">
                <Building2 size={28} className="text-[#176b4d]" />
                <h3 className="text-xl font-bold">Schools</h3>
              </div>
              <p className="text-gray-700 leading-relaxed">
                Stop running your school on spreadsheets and guesswork. Fees, attendance, results and communication — in one portal your staff will actually use.
              </p>
            </div>

            <div className="border-l-4 border-[#125c3a] pl-6 py-2">
              <div className="flex items-center gap-3 mb-4 text-[#1a202c]">
                <HeartPulse size={28} className="text-[#125c3a]" />
                <h3 className="text-xl font-bold">Hospitals & Health</h3>
              </div>
              <p className="text-gray-700 leading-relaxed">
                When supply chains fail, patients pay the price. We build GPS-tracked supply logistics and clinic management systems that keep care moving.
              </p>
            </div>

            <div className="border-l-4 border-[#7dcb71] pl-6 py-2">
              <div className="flex items-center gap-3 mb-4 text-[#1a202c]">
                <Globe2 size={28} className="text-[#7dcb71]" />
                <h3 className="text-xl font-bold">NGOs</h3>
              </div>
              <p className="text-gray-700 leading-relaxed">
                Show your donors impact, not just reports. Platforms that capture field data and automate reporting — so you have real numbers when funders ask what the money did.
              </p>
            </div>

            <div className="border-l-4 border-emerald-600 pl-6 py-2">
              <div className="flex items-center gap-3 mb-4 text-[#1a202c]">
                <Landmark size={28} className="text-emerald-600" />
                <h3 className="text-xl font-bold">Government</h3>
              </div>
              <p className="text-gray-700 leading-relaxed">
                Public sector projects need private sector speed. A dedicated engineering team that delivers on deadline and documents everything — built to survive scrutiny.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4 - Why GreenLedger */}
      <section className="w-full bg-[#0f3b25] py-20 px-6 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8 font-serif">Why GreenLedger?</h2>
          <p className="text-lg md:text-xl leading-relaxed text-green-50 font-medium text-left md:text-center">
            GreenLedger is what happens when Springdrill and Sovira's engineering teams work under one roof. We're not a template shop — we've built school management systems from the database up, GPS-tracked medical supply platforms, AI tools people actually use, and websites for real businesses that needed to launch fast without cutting corners. If you need software delivered by people who've actually shipped it before, that's what you're getting here.
          </p>
        </div>
      </section>



      {/* Section 6 - Final CTA / Request a Demo Form */}
      <section className="w-full bg-[#f8fafc] py-24 px-6 border-t border-gray-200">
        <div className="max-w-4xl mx-auto bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-gray-100">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-serif">Ready to Stop Losing Time to Systems That Don't Work?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Tell us what you're trying to fix. We'll tell you exactly how we'd build it — no generic sales pitch.
            </p>
          </div>

          <form action="https://formsubmit.co/microsoftportharcourt@gmail.com" method="POST" className="space-y-6">
            <input type="hidden" name="_subject" value="New Request a Demo Submission - GreenLedger" />
            <input type="hidden" name="_next" value="https://greenledger-theta.vercel.app/" />
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="contact_name" className="block text-sm font-semibold text-gray-700 mb-1">Contact Person</label>
                <input id="contact_name" type="text" name="name" required className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#176b4d] outline-none" placeholder="Your name" />
              </div>
              <div>
                <label htmlFor="org_name" className="block text-sm font-semibold text-gray-700 mb-1">Organization Name</label>
                <input id="org_name" type="text" name="organization" required className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#176b4d] outline-none" placeholder="School, Hospital, or Agency name" />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="email_address" className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
                <input id="email_address" type="email" name="email" required className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#176b4d] outline-none" placeholder="you@organization.com" />
              </div>
              <div>
                <label htmlFor="phone_number" className="block text-sm font-semibold text-gray-700 mb-1">Phone Number</label>
                <input id="phone_number" type="tel" name="phone" required className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#176b4d] outline-none" placeholder="+234 800 000 0000" />
              </div>
            </div>

            <div>
              <label htmlFor="industry_sector" className="block text-sm font-semibold text-gray-700 mb-1">Sector</label>
              <select id="industry_sector" name="industry" required className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#176b4d] outline-none bg-white">
                <option value="" disabled selected>Select your industry</option>
                <option value="School / Education">School / Education</option>
                <option value="Hospital / Healthcare">Hospital / Healthcare</option>
                <option value="NGO / Non-Profit">NGO / Non-Profit</option>
                <option value="Government / Public Sector">Government / Public Sector</option>
                <option value="Other Business">Other Business</option>
              </select>
            </div>

            <div>
              <label htmlFor="project_details" className="block text-sm font-semibold text-gray-700 mb-1">What are you trying to fix?</label>
              <textarea id="project_details" name="details" required rows={4} className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#176b4d] outline-none" placeholder="Describe your current operations bottleneck or software needs..."></textarea>
            </div>

            <div className="pt-2 text-center">
              <button type="submit" className="w-full md:w-auto bg-[#176b4d] hover:bg-[#115a40] text-white rounded-full px-12 py-4 font-bold transition-all text-lg shadow-md">
                Request a Demo
              </button>
            </div>
          </form>
        </div>
      </section>
    </PublicLayout>
  );
}
