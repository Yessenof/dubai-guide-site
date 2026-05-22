import Image from "next/image";

const IMG_SKYLINE = "/images/hubs/dubai-skyline-downtown.webp";
const IMG_DIFC    = "/images/hubs/difc-business-bay-glass-towers.webp";
const IMG_JLT     = "/images/hubs/jlt-dubai-towers-sunset-reflection.webp";

export function categoryImage(category: string): string {
  if (["visa", "living"].includes(category)) return IMG_JLT;
  if (["company", "tax", "banking"].includes(category)) return IMG_DIFC;
  return IMG_SKYLINE;
}

interface Props {
  eyebrow: string;
  title: string;
  image: string;
  imageAlt: string;
}

export default function DetailHero({ eyebrow, title, image, imageAlt }: Props) {
  return (
    <div className="relative w-full rounded-2xl overflow-hidden mb-5 h-[200px] sm:h-[230px]">
      <Image
        src={image}
        alt={imageAlt}
        fill
        className="object-cover"
        sizes="(max-width: 672px) calc(100vw - 40px), 632px"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/10" />
      <div className="absolute inset-0 flex flex-col justify-end p-5">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-white/60 mb-1.5">
          {eyebrow}
        </p>
        <h1
          className="text-[20px] sm:text-[22px] font-bold text-white leading-snug"
          style={{ textShadow: "0 1px 4px rgba(0,0,0,0.4)" }}
        >
          {title}
        </h1>
      </div>
    </div>
  );
}
