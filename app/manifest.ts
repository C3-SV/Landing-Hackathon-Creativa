import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Hackathon de Turismo Creativo I",
    short_name: "Hackathon Turismo",
    description:
      "Sitio oficial del Hackathon de Turismo Creativo I de C3 y Poliedrica.",
    start_url: "/",
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
        src: "/images/logo-c3-blanco.png",
        sizes: "2652x2744",
        type: "image/png",
      },
    ],
  };
}
