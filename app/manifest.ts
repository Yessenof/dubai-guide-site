import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Guidex Consulting",
    short_name: "Guidex",
    description:
      "Step-by-step guides for visas, company setup, and government services in Dubai.",
    start_url: "/",
    display: "browser",
    background_color: "#ffffff",
    theme_color: "#1B2E4B",
    icons: [
      {
        src: "/brand/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/brand/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
