import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact — Guidex Consulting",
  description: "Get in touch with a question about Dubai procedures.",
};

const WHATSAPP_URL = "https://wa.me/971506304817";

export default function ContactPage() {
  return (
    <div className="max-w-2xl mx-auto px-5 py-12">
      <p className="text-xs font-medium uppercase tracking-widest text-gray-400 mb-4">
        Contact
      </p>
      <h1 className="text-[26px] font-bold text-gray-900 mb-3">
        Get in touch.
      </h1>
      <p className="text-[15px] text-gray-600 leading-snug mb-10 max-w-sm">
        Have a question about a Dubai procedure, or can&apos;t find what you&apos;re
        looking for? Reach out directly.
      </p>

      <div className="space-y-3">
        {/* WhatsApp — primary action */}
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between w-full bg-gray-900 text-white rounded-2xl px-5 py-4 hover:bg-gray-700 transition-colors group"
        >
          <div>
            <p className="text-sm font-semibold">WhatsApp</p>
            <p className="text-xs text-gray-400 mt-0.5">Send a message directly</p>
          </div>
          <span className="text-gray-500 group-hover:text-gray-300 transition-colors text-lg">→</span>
        </a>

      </div>
    </div>
  );
}
