import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
      <div className="max-w-2xl mx-auto px-5 h-14 flex items-center justify-between">
        <Link href="/" className="text-base font-semibold text-gray-900 tracking-tight">
          Dubai Guide
        </Link>
        <nav className="flex items-center gap-6">
          <Link href="/guides" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
            Guides
          </Link>
          <Link href="/about" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
            About
          </Link>
          <Link href="/contact" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
            Contact
          </Link>
        </nav>
      </div>
    </header>
  );
}
