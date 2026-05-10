"use client";

import Link from "next/link";
import { pushEvent } from "@/lib/gtm";

interface Props {
  href: string;
  serviceKey: string;
  locale: "en" | "ru";
  className?: string;
  children: React.ReactNode;
}

export function ServiceCardLink({ href, serviceKey, locale, className, children }: Props) {
  return (
    <Link
      href={href}
      className={className}
      onClick={() =>
        pushEvent("homepage_service_card_click", {
          service: serviceKey,
          destination: href,
          locale,
          source: "homepage",
        })
      }
    >
      {children}
    </Link>
  );
}
