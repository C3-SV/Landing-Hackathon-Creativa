import { fitTextToBox } from "./fit-text";
import type { ImageGenerationFont } from "./image-font";
import {
  getInnerTextBox,
  getTextBox,
  TEXT_STYLE,
  type PixelTextBox,
} from "./template-config";

export type RenderTextOverlayInput = {
  imageWidth: number;
  imageHeight: number;
  text: string;
  font: ImageGenerationFont;
  debug?: boolean;
  templateName?: string;
};

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
    `@font-face { font-family: "${font.family}"; src: url("data:${font.mimeType};base64,${font.base64}") format("truetype"); font-weight: ${TEXT_STYLE.fontWeight}; font-style: normal; }`,
    "]]>",
    "</style>",
    "</defs>",
  ].join("");
}

export function renderTextOverlay(input: RenderTextOverlayInput) {
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
    input.debug ? renderDebug(textBox, input.imageWidth, input.imageHeight, input.templateName) : "",
    text,
    "</svg>",
  ].join("");
}
