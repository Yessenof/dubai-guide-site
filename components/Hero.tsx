import Link from "next/link";

export default function Hero() {
  return (
    <section className="pt-8 pb-6 px-5">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-[28px] font-bold text-gray-900 leading-snug mb-3">
          Dubai visas, company setup, and government procedures
        </h1>
        <p className="text-[15px] text-gray-600 leading-snug mb-6 max-w-xs">
          Official fees and exact steps — no guesswork.
        </p>
        <Link
          href="/find-my-visa"
          className="inline-flex items-center gap-2 bg-navy text-white text-sm font-semibold px-5 py-3 rounded-2xl hover:opacity-90 transition-opacity"
        >
          Find My Route →
        </Link>
      </div>
    </section>
  );
}
