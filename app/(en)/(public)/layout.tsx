import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StickyRouteCta from "@/components/StickyRouteCta";
import { OrgSchema } from "@/components/OrgSchema";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <OrgSchema />
      <Header />
      <main className="flex-1 pb-20 sm:pb-0">{children}</main>
      <Footer />
      <StickyRouteCta />
    </>
  );
}
