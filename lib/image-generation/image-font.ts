import fs from "node:fs/promises";
import path from "node:path";

export const IMAGE_FONT_FAMILY = "HackathonImageFont";

export type ImageGenerationFont = {
  family: typeof IMAGE_FONT_FAMILY;
  path: string;
  exists: boolean;
  byteLength: number;
  mimeType: "font/ttf";
  format: "truetype";
  base64: string;
};

let fontPromise: Promise<ImageGenerationFont> | null = null;

function getRuntimeLabel() {
  if (process.env.VERCEL === "1") {
    return process.env.VERCEL_ENV ?? "vercel";
  }

  return process.env.NODE_ENV ?? "local";
}

function getFontPath() {
  return path.join(process.cwd(), "lib", "image-generation", "fonts", "Geist-Regular.ttf");
}

async function readImageGenerationFont(): Promise<ImageGenerationFont> {
  const fontPath = getFontPath();
  let exists = false;

  try {
    const stats = await fs.stat(fontPath);
    exists = stats.isFile();
  } catch {
    exists = false;
  }

  if (!exists) {
    console.error("[accepted-image] Font file missing", {
      fontPath,
      exists,
      fontFamily: IMAGE_FONT_FAMILY,
      runtime: getRuntimeLabel(),
      nodeEnv: process.env.NODE_ENV,
      vercelEnv: process.env.VERCEL_ENV,
    });
    throw new Error(`No se encontro la fuente requerida para imagenes: ${fontPath}`);
  }

  const buffer = await fs.readFile(fontPath);
  const font: ImageGenerationFont = {
    family: IMAGE_FONT_FAMILY,
    path: fontPath,
    exists,
    byteLength: buffer.byteLength,
    mimeType: "font/ttf" as const,
    format: "truetype" as const,
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
