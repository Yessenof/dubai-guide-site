import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact — Dubai Guide",
  description: "Get in touch with a question about Dubai procedures.",
};

// TODO: replace these with real URLs before going live
const WHATSAPP_URL = "https://wa.me/971000000000";
const INSTAGRAM_URL = "https://instagram.com/dubaiguide";
const FACEBOOK_URL = "https://facebook.com/dubaiguide";

export default function ContactPage() {
  return (
    <div className="max-w-2xl mx-auto px-5 py-12">
      <p className="text-xs font-medium uppercase tracking-widest text-gray-400 mb-4">
        Contact
      </p>
      <h1 className="text-[26px] font-semibold text-gray-900 mb-3">
        Get in touch.
      </h1>
      <p className="text-[15px] text-gray-500 leading-relaxed mb-10 max-w-sm">
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

        {/* Instagram */}
        <a
          href={INSTAGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between w-full border border-gray-100 bg-white rounded-2xl px-5 py-4 hover:border-gray-200 hover:bg-gray-50/50 transition-all group"
        >
          <div>
            <p className="text-sm font-semibold text-gray-900">Instagram</p>
            <p className="text-xs text-gray-400 mt-0.5">Follow for updates</p>
          </div>
          <span className="text-gray-300 group-hover:text-gray-500 transition-colors text-lg">→</span>
        </a>

        {/* Facebook */}
        <a
          href={FACEBOOK_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between w-full border border-gray-100 bg-white rounded-2xl px-5 py-4 hover:border-gray-200 hover:bg-gray-50/50 transition-all group"
        >
          <div>
            <p className="text-sm font-semibold text-gray-900">Facebook</p>
            <p className="text-xs text-gray-400 mt-0.5">Page and community</p>
          </div>
          <span className="text-gray-300 group-hover:text-gray-500 transition-colors text-lg">→</span>
        </a>
      </div>
    </div>
  );
}
