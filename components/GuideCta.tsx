"use client";

import Link from "next/link";
import { pushEvent } from "@/lib/gtm";

type CtaType = "whatsapp" | "route_finder" | "contact" | "unknown";

interface Props {
  href: string;
  guideSlug: string;
  ctaType: CtaType;
  locale: "en" | "ru";
  className?: string;
  children: React.ReactNode;
  isExternal?: boolean;
}

export function GuideCta({
  href,
  guideSlug,
  ctaType,
  locale,
  className,
  children,
  isExternal,
}: Props) {
  function handleClick() {
    if (ctaType === "whatsapp") {
      pushEvent("whatsapp_click", { source: "guide", guide_slug: guideSlug, locale });
    }
    pushEvent("guide_cta_click", {
      guide_slug: guideSlug,
      cta_type: ctaType,
      destination: href,
      locale,
      source: "guide",
    });
  }

  if (isExternal) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        onClick={handleClick}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={className} onClick={handleClick}>
      {children}
    </Link>
  );
}
