import { fitTextToBox } from "./fit-text";
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

export function renderTextOverlay(input: RenderTextOverlayInput) {
  const textBox = getTextBox(input.imageWidth, input.imageHeight);
  const innerTextBox = getInnerTextBox(textBox);
  const fitted = fitTextToBox({
    text: input.text,
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
      return `<text x="${centerX}" y="${y}" text-anchor="middle" font-family="${TEXT_STYLE.fontFamily}" font-size="${fitted.fontSize}" font-weight="${TEXT_STYLE.fontWeight}" fill="${TEXT_STYLE.color}">${escapeXml(
        line,
      )}</text>`;
    })
    .join("");

  return [
    `<svg width="${input.imageWidth}" height="${input.imageHeight}" viewBox="0 0 ${input.imageWidth} ${input.imageHeight}" xmlns="http://www.w3.org/2000/svg">`,
    input.debug ? renderDebug(textBox, input.imageWidth, input.imageHeight, input.templateName) : "",
    text,
    "</svg>",
  ].join("");
}
