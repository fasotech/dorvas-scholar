import PublicLayout from "@/components/PublicLayout";
import { Mail, Phone, MapPin, GraduationCap } from "lucide-react";

export default function Contact() {
  return (
    <PublicLayout>
      <section className="w-full max-w-5xl mx-auto px-6 py-16 md:py-24">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-[#1a202c] mb-6 font-serif">Contact Us</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We would love to hear from you. Whether you have a question about our platforms, need custom development, or want to explore our training programs.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Details */}
          <div className="space-y-8">
            <div className="bg-[#e8f3e9] p-8 rounded-2xl border border-green-100">
              <h3 className="text-2xl font-bold text-[#125c3a] mb-6 flex items-center gap-3">
                <GraduationCap size={28} /> ICT Training & Mentorship
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Beyond building world-class software, we offer comprehensive <strong>ICT training and online mentorship</strong> programs. Whether you're a beginner looking to break into tech or a professional upgrading your skills, our mentorship programs are designed to guide you to success.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Get In Touch</h3>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-[#176b4d] shrink-0">
                    <Phone size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Phone</p>
                    <a href="tel:+2348162337303" className="text-lg font-medium text-gray-900 hover:text-[#176b4d] transition-colors">
                      +234 816 233 7303
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-[#176b4d] shrink-0">
                    <Mail size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Email</p>
                    <a href="mailto:microsoftportharcourt@gmail.com" className="text-lg font-medium text-gray-900 hover:text-[#176b4d] transition-colors">
                      microsoftportharcourt@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-[#176b4d] shrink-0">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Location</p>
                    <p className="text-lg font-medium text-gray-900">
                      Georgewill/Clifford Plaza Choba Junction, Port Harcourt, Rivers State, Nigeria.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Send us a message</h3>
            <form action="https://formsubmit.co/microsoftportharcourt@gmail.com" method="POST" className="space-y-4">
              <input type="hidden" name="_subject" value="New Contact Form Submission - Green Ledger" />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input type="text" name="name" required className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#176b4d] outline-none" placeholder="John Doe" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input type="email" name="email" required className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#176b4d] outline-none" placeholder="john@example.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <input type="text" name="subject" required className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#176b4d] outline-none" placeholder="How can we help?" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea name="message" required rows={5} className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#176b4d] outline-none" placeholder="Write your message here..."></textarea>
              </div>
              <button type="submit" className="w-full bg-[#176b4d] hover:bg-[#115a40] text-white rounded-lg px-8 py-4 font-bold transition-all">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
