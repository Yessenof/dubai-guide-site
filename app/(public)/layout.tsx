import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StickyRouteCta from "@/components/StickyRouteCta";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="flex-1 pb-20 sm:pb-0">{children}</main>
      <Footer />
      <StickyRouteCta />
    </>
  );
}
