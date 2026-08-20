
import { Link } from "wouter";

export default function Landing() {
  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#f4f6f4]">
      <header className="w-full bg-[#125c3a] p-6 text-white flex justify-between items-center shadow-md">
        <div>
          <h1 className="text-2xl font-serif font-bold tracking-tight">GREEN LEDGER</h1>
          <p className="text-[#a5cbb7] text-xs font-medium uppercase tracking-widest">School Management</p>
        </div>
        <nav>
          <Link href="/login">
            <button className="bg-white text-[#125c3a] px-5 py-2 rounded-lg font-bold text-sm hover:bg-gray-100 transition-colors shadow-sm">
              Portal Login
            </button>
          </Link>
        </nav>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-white m-4 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-800 mb-6 max-w-2xl leading-tight">
          A clearer view of every learner.
        </h2>
        <p className="text-lg text-gray-600 mb-10 max-w-xl leading-relaxed">
          Green Ledger is a connected school operations and learning portal. From daily attendance to deep academic insights, we keep the school day in good order.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full text-left">
          <div className="p-6 bg-[#f4f6f4] rounded-xl">
            <h3 className="font-bold text-lg text-[#125c3a] mb-2">For Teachers</h3>
            <p className="text-gray-600 text-sm">Review class registers and assessment activity easily.</p>
          </div>
          <div className="p-6 bg-[#f4f6f4] rounded-xl">
            <h3 className="font-bold text-lg text-[#125c3a] mb-2">For Parents</h3>
            <p className="text-gray-600 text-sm">See only the published information connected to your child.</p>
          </div>
          <div className="p-6 bg-[#f4f6f4] rounded-xl">
            <h3 className="font-bold text-lg text-[#125c3a] mb-2">For Administrators</h3>
            <p className="text-gray-600 text-sm">Review live attendance, assessments, and payment signals securely.</p>
          </div>
        </div>
      </main>

      <footer className="text-center p-6 text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} Green Ledger Systems. All rights reserved.
      </footer>
    </div>
  );
}

