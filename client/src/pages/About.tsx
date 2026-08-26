import PublicLayout from "@/components/PublicLayout";

export default function About() {
  return (
    <PublicLayout>
      <section className="w-full max-w-4xl mx-auto px-6 py-16 md:py-24">
        <h1 className="text-4xl md:text-5xl font-bold text-[#1a202c] mb-8 font-serif">About Green Ledger</h1>
        <div className="prose prose-lg text-gray-700 max-w-none">
          <p className="mb-6">
            GreenLedger is what happens when Springdrill and Sovira's engineering teams work under one roof. We're not a template shop — we've built school management systems from the database up, GPS-tracked medical supply platforms, AI tools people actually use, and websites for real businesses that needed to launch fast without cutting corners. If you need software delivered by people who've actually shipped it before, that's what you're getting here.
          </p>

          <h2 className="text-3xl font-bold text-[#1a202c] mt-12 mb-6 font-serif">For Investors</h2>
          <p className="mb-6">
            GreenLedger isn't a single product bet. It's one engineering team already serving education, healthcare logistics, and AI deployment — with a modular architecture built to expand into any sector that needs reliable software delivered fast.
          </p>
        </div>
      </section>
    </PublicLayout>
  );
}
