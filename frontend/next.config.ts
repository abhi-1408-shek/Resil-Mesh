import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export: all pages are 'use client' so no SSR needed.
  // This generates a plain static site in /out — no Netlify plugin required.
  output: "export",
  trailingSlash: true,
};

export default nextConfig;
