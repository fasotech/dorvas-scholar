import PublicLayout from "@/components/PublicLayout";

export default function About() {
  return (
    <PublicLayout>
      <section className="w-full max-w-4xl mx-auto px-6 py-16 md:py-24">
        <h1 className="text-4xl md:text-5xl font-bold text-[#1a202c] mb-8 font-serif">About Green Ledger</h1>
        <div className="prose prose-lg text-gray-700 max-w-none">
          <p className="mb-6">
            Green Ledger (Dorvas Technologies) is a forward-thinking technology company dedicated to building powerful, modular, and scalable software solutions. We specialize in transforming operations across industries—from education to digital marketing—by bringing innovative tools like Springdrill and Sovira AI into a single, unified ecosystem.
          </p>
          <p className="mb-6">
            Our mission is to empower institutions, educators, businesses, and creators with cutting-edge technology that is both secure and intuitive. Through our rigorous approach to design and development, we ensure that every platform we create meets the highest standards of performance and reliability.
          </p>
          <p className="mb-6">
            Driven by a team of passionate engineers and designers, Green Ledger continues to push the boundaries of what's possible, redefining how organizations manage their data, engage their users, and achieve their strategic goals.
          </p>
        </div>
      </section>
    </PublicLayout>
  );
}
