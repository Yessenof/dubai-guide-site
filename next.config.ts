import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["better-sqlite3"],
  // Allow any LAN IP (IPv4) to access Next.js dev resources.
  // Without this, JS chunks are blocked with 403 when the browser Origin is a LAN IP,
  // React never hydrates, and nothing is interactive over the network.
  // Pattern *.*.*. matches any IPv4 address but not hostnames — safe for local dev.
  allowedDevOrigins: ["*.*.*.*"],
  async redirects() {
    return [
      {
        source:      "/guides/spouse-dependent-visa-dubai-outside-country",
        destination: "/guides/spouse-dependent-visa-dubai?route=outside",
        permanent:   true,
      },
      {
        source:      "/guides/spouse-dependent-visa-dubai-inside-country",
        destination: "/guides/spouse-dependent-visa-dubai?route=inside",
        permanent:   true,
      },
      {
        source:      "/guides/child-dependent-visa-dubai-outside-country",
        destination: "/guides/child-dependent-visa-dubai?route=outside",
        permanent:   true,
      },
      {
        source:      "/guides/child-dependent-visa-dubai-inside-country",
        destination: "/guides/child-dependent-visa-dubai?route=inside",
        permanent:   true,
      },
    ];
  },
};

export default nextConfig;
