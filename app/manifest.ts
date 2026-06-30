import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Hackathon de Turismo Creativo I",
    short_name: "Hackathon Turismo",
    description:
      "Hackathon que une turismo, código y cultura para crear soluciones a retos reales.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#081326",
    theme_color: "#081326",
    lang: "es-SV",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
