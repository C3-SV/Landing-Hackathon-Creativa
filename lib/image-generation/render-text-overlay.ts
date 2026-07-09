import sharp from "sharp";
import { fitTextToBox, type FittedText } from "./fit-text";
import type { ImageGenerationFont } from "./image-font";
import {
  getInnerTextBox,
  getTextBox,
  TEXT_STYLE,
  type PixelTextBox,
} from "./template-config";

const IMAGE_GENERATION_ERROR_PREFIX = "image_generation_failed";

export type RenderTextOverlayInput = {
  imageWidth: number;
  imageHeight: number;
  text: string;
  font: ImageGenerationFont;
  debug?: boolean;
  templateName?: string;
};

export type RenderedTextOverlay = {
  svg: string;
  overlayBuffer: Buffer;
  normalizedText: string;
  fitted: FittedText;
  textBox: PixelTextBox;
  innerTextBox: PixelTextBox;
  renderOverlayMs: number;
};

export class ImageGenerationError extends Error {
  constructor(message: string) {
    super(`${IMAGE_GENERATION_ERROR_PREFIX}: ${message}`);
    this.name = "ImageGenerationError";
  }
}

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function renderDebug(textBox: PixelTextBox, imageWidth: number, imageHeight: number, templateName?: string) {
  const centerX = textBox.x + textBox.width / 2;
  const centerY = textBox.y + textBox.height / 2;

  return [
    `<rect x="${textBox.x}" y="${textBox.y}" width="${textBox.width}" height="${textBox.height}" fill="none" stroke="#ff0000" stroke-width="2" />`,
    `<line x1="${centerX}" y1="${textBox.y}" x2="${centerX}" y2="${textBox.y + textBox.height}" stroke="#ff0000" stroke-width="1" />`,
    `<line x1="${textBox.x}" y1="${centerY}" x2="${textBox.x + textBox.width}" y2="${centerY}" stroke="#ff0000" stroke-width="1" />`,
    templateName
      ? `<text x="${imageWidth * 0.03}" y="${imageHeight * 0.035}" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="700" fill="#ff0000">${escapeXml(
          templateName,
        )}</text>`
      : "",
  ].join("");
}

function renderFontFace(font: ImageGenerationFont) {
  return [
    "<defs>",
    "<style>",
    "<![CDATA[",
    `@font-face { font-family: "${font.family}"; src: url("data:${font.mimeType};base64,${font.base64}") format("${font.format}"); font-weight: ${TEXT_STYLE.fontWeight}; font-style: normal; }`,
    "]]>",
    "</style>",
    "</defs>",
  ].join("");
}

function renderSvgDiagnostic(input: RenderTextOverlayInput, fitted: FittedText, textBox: PixelTextBox, innerTextBox: PixelTextBox) {
  const normalizedText = (input.text.trim() || "-").normalize("NFC");
  const centerX = innerTextBox.x + innerTextBox.width / 2;
  const startY =
    innerTextBox.y +
    (innerTextBox.height - fitted.totalTextHeight) / 2 +
    fitted.fontSize * 0.8 +
    TEXT_STYLE.verticalNudge;
  const text = fitted.lines
    .map((line, index) => {
      const y = startY + index * fitted.lineHeight;
      return `<text x="${centerX}" y="${y}" text-anchor="middle" font-family="${TEXT_STYLE.fontFamily}, ${TEXT_STYLE.fallbackFontFamily}" font-size="${fitted.fontSize}" font-weight="${TEXT_STYLE.fontWeight}" fill="${TEXT_STYLE.color}">${escapeXml(
        line,
      )}</text>`;
    })
    .join("");

  console.info("[accepted-image] Rendering dynamic text", {
    templateName: input.templateName,
    text: normalizedText,
    fontFamily: input.font.family,
    fontPath: input.font.path,
    fontExists: input.font.exists,
    fontByteLength: input.font.byteLength,
    imageWidth: input.imageWidth,
    imageHeight: input.imageHeight,
    fittedFontSize: fitted.fontSize,
    lines: fitted.lines,
    nodeEnv: process.env.NODE_ENV,
    vercelEnv: process.env.VERCEL_ENV,
  });

  return [
    `<svg width="${input.imageWidth}" height="${input.imageHeight}" viewBox="0 0 ${input.imageWidth} ${input.imageHeight}" xmlns="http://www.w3.org/2000/svg">`,
    renderFontFace(input.font),
    `<metadata>${escapeXml(normalizedText)}</metadata>`,
    input.debug ? renderDebug(textBox, input.imageWidth, input.imageHeight, input.templateName) : "",
    text,
    "</svg>",
  ].join("");
}

function escapePangoMarkup(value: string) {
  return escapeXml(value).replace(/'/g, "&apos;");
}

function rgbaFromHex(hex: string) {
  const normalized = hex.replace("#", "");
  const value = Number.parseInt(normalized, 16);

  return {
    r: (value >> 16) & 255,
    g: (value >> 8) & 255,
    b: value & 255,
    alpha: 1,
  };
}

export async function renderTextOverlay(input: RenderTextOverlayInput): Promise<RenderedTextOverlay> {
  const normalizedText = (input.text.trim() || "-").normalize("NFC");
  const textBox = getTextBox(input.imageWidth, input.imageHeight);
  const innerTextBox = getInnerTextBox(textBox);
  const fitted = fitTextToBox({
    text: normalizedText,
    boxWidth: innerTextBox.width,
    boxHeight: innerTextBox.height,
    maxFontSize: TEXT_STYLE.maxFontSize,
    minFontSize: TEXT_STYLE.minFontSize,
    maxLines: TEXT_STYLE.maxLines,
    lineHeightMultiplier: TEXT_STYLE.lineHeightMultiplier,
  });
  const svg = renderSvgDiagnostic(input, fitted, textBox, innerTextBox);

  if (!svg.includes("@font-face")) {
    throw new ImageGenerationError("dynamic text SVG diagnostic is missing @font-face");
  }

  if (!svg.includes(normalizedText)) {
    throw new ImageGenerationError("dynamic text SVG diagnostic is missing normalized text");
  }

  const overlayStart = Date.now();
  const markupText = fitted.lines.map(escapePangoMarkup).join("\n");
  const pangoMarkup = `<span font_desc="${input.font.family} ${fitted.fontSize}" font_weight="${TEXT_STYLE.fontWeight}" foreground="${TEXT_STYLE.color}">${markupText}</span>`;
  const textImageBuffer = await sharp({
    text: {
      text: pangoMarkup,
      fontfile: input.font.path,
      font: input.font.family,
      width: Math.max(1, Math.round(innerTextBox.width)),
      height: Math.max(1, Math.round(innerTextBox.height)),
      align: "center",
      rgba: true,
    },
  })
    .png()
    .toBuffer();
  const textImageMetadata = await sharp(textImageBuffer).metadata();
  const textImageWidth = textImageMetadata.width ?? Math.round(innerTextBox.width);
  const textImageHeight = textImageMetadata.height ?? Math.round(innerTextBox.height);
  const textLeft = Math.round(innerTextBox.x + (innerTextBox.width - textImageWidth) / 2);
  const textTop = Math.round(
    innerTextBox.y + (innerTextBox.height - textImageHeight) / 2 + TEXT_STYLE.verticalNudge,
  );

  const overlayComposite = [{ input: textImageBuffer, left: textLeft, top: textTop }];
  if (input.debug) {
    overlayComposite.push({
      input: Buffer.from(
        `<svg width="${input.imageWidth}" height="${input.imageHeight}" viewBox="0 0 ${input.imageWidth} ${input.imageHeight}" xmlns="http://www.w3.org/2000/svg">${renderDebug(
          textBox,
          input.imageWidth,
          input.imageHeight,
          input.templateName,
        )}</svg>`,
      ),
      left: 0,
      top: 0,
    });
  }

  const overlayBuffer = await sharp({
    create: {
      width: input.imageWidth,
      height: input.imageHeight,
      channels: 4,
      background: { ...rgbaFromHex(TEXT_STYLE.color), alpha: 0 },
    },
  })
    .composite(overlayComposite)
    .png()
    .toBuffer();
  const renderOverlayMs = Date.now() - overlayStart;

  if (!overlayBuffer || overlayBuffer.length < 1000) {
    throw new ImageGenerationError("dynamic text overlay could not be rendered");
  }

  return {
    svg,
    overlayBuffer,
    normalizedText,
    fitted,
    textBox,
    innerTextBox,
    renderOverlayMs,
  };
}
