export type GradientStyle = "light" | "medium" | "warm-light";

export type VisualAsset = {
  src: string;
  alt: string;
  tone: "cool" | "warm" | "neutral";
};

const GRADIENT_CLASSES: Record<GradientStyle, string> = {
  light:        "bg-gradient-to-r from-white via-white/75 to-white/25",
  medium:       "bg-gradient-to-r from-white via-white/95 to-white/40",
  "warm-light": "bg-gradient-to-r from-white via-white/90 to-white/50",
};

export function getGradientClass(style: GradientStyle): string {
  return GRADIENT_CLASSES[style];
}
