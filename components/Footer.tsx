import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-gray-100 mt-10">
      <div className="max-w-2xl mx-auto px-5 py-6 flex items-center justify-between">
        <p className="text-xs text-gray-400">© {new Date().getFullYear()} Guidex Consulting</p>
        <nav className="flex items-center gap-5">
          <Link href="/about"   className="text-xs text-gray-400 hover:text-gray-700 transition-colors">About</Link>
          <Link href="/contact" className="text-xs text-gray-400 hover:text-gray-700 transition-colors">Contact</Link>
        </nav>
      </div>
    </footer>
  );
}
