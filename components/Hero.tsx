import Link from "next/link";
import PageHero from "@/components/PageHero";

export default function Hero() {
  return (
    <section className="pt-8 pb-0 px-5">
      <div className="max-w-2xl mx-auto">
        <PageHero
          asset={{
            src: "/images/hubs/dubai-skyline-downtown.webp",
            alt: "Dubai Downtown skyline at dusk with Burj Khalifa rising above surrounding towers",
            tone: "cool",
          }}
          gradientStyle="light"
          heading="Dubai visas, company setup, and government procedures"
          subtext="Official fees and exact steps — no guesswork."
        >
          <Link
            href="/find-my-visa"
            className="inline-flex items-center gap-2 bg-navy text-white text-sm font-semibold px-5 py-3 rounded-2xl hover:opacity-90 transition-opacity"
          >
            Find My Route →
          </Link>
        </PageHero>
      </div>
    </section>
  );
}
