import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
  outputFileTracingIncludes: {
    "/api/admin/registrations/[id]/send-accepted-email": [
      "./lib/image-generation/fonts/Geist-Regular.ttf",
      "./public/email-templates/accepted/**/*",
    ],
    "/api/admin/debug/accepted-image": [
      "./lib/image-generation/fonts/Geist-Regular.ttf",
      "./public/email-templates/accepted/**/*",
    ],
  },
};

export default nextConfig;
