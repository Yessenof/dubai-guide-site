import Image from "next/image";
import type { ReactNode } from "react";
import type { VisualAsset, GradientStyle } from "@/lib/page-visuals";
import { getGradientClass } from "@/lib/page-visuals";

type Props = {
  asset: VisualAsset;
  gradientStyle?: GradientStyle;
  overline?: string;
  heading: string;
  subtext?: string;
  children?: ReactNode;
};

export default function PageHero({
  asset,
  gradientStyle = "medium",
  overline,
  heading,
  subtext,
  children,
}: Props) {
  return (
    <div className="relative overflow-hidden rounded-2xl mb-8">
      <Image
        src={asset.src}
        alt={asset.alt}
        fill
        priority
        sizes="(max-width: 672px) 100vw, 672px"
        className="object-cover object-right"
      />
      <div
        className={`absolute inset-0 ${getGradientClass(gradientStyle)}`}
        aria-hidden="true"
      />
      <div className="relative z-10 px-5 py-7">
        {overline && (
          <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-3">
            {overline}
          </p>
        )}
        <h1 className="text-[26px] font-bold text-gray-900 leading-snug mb-3">{heading}</h1>
        {subtext && (
          <p className="text-[15px] text-gray-600 leading-snug mb-5">{subtext}</p>
        )}
        {children}
      </div>
    </div>
  );
}
