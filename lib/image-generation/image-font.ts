import fs from "node:fs/promises";
import path from "node:path";

export const IMAGE_FONT_FAMILY = "Geist Mono";

export type ImageGenerationFont = {
  family: string;
  path: string;
  exists: boolean;
  byteLength: number;
  mimeType: "font/ttf" | "font/woff2";
  format: "truetype" | "woff2";
  base64: string;
};

let fontPromise: Promise<ImageGenerationFont> | null = null;

function getRuntimeLabel() {
  if (process.env.VERCEL === "1") {
    return process.env.VERCEL_ENV ?? "vercel";
  }

  return process.env.NODE_ENV ?? "local";
}

function getFontCandidates() {
  return [
    {
      path: path.join(process.cwd(), "lib", "image-generation", "fonts", "GeistMono-Regular.woff2"),
      family: IMAGE_FONT_FAMILY,
      mimeType: "font/woff2" as const,
      format: "woff2" as const,
    },
    {
      path: path.join(process.cwd(), "lib", "image-generation", "fonts", "Geist-Regular.ttf"),
      family: "Geist",
      mimeType: "font/ttf" as const,
      format: "truetype" as const,
    },
  ];
}

async function readImageGenerationFont(): Promise<ImageGenerationFont> {
  const candidates = getFontCandidates();
  let selected:
    | (ReturnType<typeof getFontCandidates>[number] & {
        exists: boolean;
      })
    | null = null;

  for (const candidate of candidates) {
    try {
      const stats = await fs.stat(candidate.path);
      if (stats.isFile()) {
        selected = { ...candidate, exists: true };
        break;
      }
    } catch {
      // Try the next bundled font candidate.
    }
  }

  if (!selected) {
    console.error("[accepted-image] Font file missing", {
      fontPath: candidates.map((candidate) => candidate.path).join(", "),
      exists: false,
      fontFamily: IMAGE_FONT_FAMILY,
      runtime: getRuntimeLabel(),
      nodeEnv: process.env.NODE_ENV,
      vercelEnv: process.env.VERCEL_ENV,
    });
    throw new Error(
      `No se encontro la fuente requerida para imagenes: ${candidates
        .map((candidate) => candidate.path)
        .join(", ")}`,
    );
  }

  const buffer = await fs.readFile(selected.path);
  const font: ImageGenerationFont = {
    family: selected.family,
    path: selected.path,
    exists: selected.exists,
    byteLength: buffer.byteLength,
    mimeType: selected.mimeType,
    format: selected.format,
    base64: buffer.toString("base64"),
  };

  console.info("[accepted-image] Font loaded", {
    fontPath: font.path,
    exists: font.exists,
    byteLength: font.byteLength,
    fontFamily: font.family,
    runtime: getRuntimeLabel(),
    nodeEnv: process.env.NODE_ENV,
    vercelEnv: process.env.VERCEL_ENV,
  });

  return font;
}

export function loadHackathonFont(): Promise<ImageGenerationFont> {
  if (!fontPromise) {
    fontPromise = readImageGenerationFont();
  }

  return fontPromise;
}
