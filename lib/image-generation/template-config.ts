import path from "node:path";
import type { Role3H } from "../types/domain";

export type NormalizedTextBox = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type PixelTextBox = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type AcceptedTemplateKey = "accepted" | Role3H;

export type AcceptedAssetTemplate = {
  key: AcceptedTemplateKey;
  templatePath: string;
  outputPrefix: string;
};

export const SHARED_TEXT_BOX: NormalizedTextBox = {
  x: 0.065,
  y: 0.482,
  width: 0.87,
  height: 0.15,
};

export const TEXT_STYLE = {
  fontFamily: "'JetBrains Mono', 'Courier New', monospace",
  maxFontSize: 64,
  minFontSize: 24,
  lineHeightMultiplier: 1.15,
  verticalNudge: -6,
  color: "#111111",
  fontWeight: 800,
  maxLines: 2,
  horizontalPaddingRatio: 0.04,
  verticalPaddingRatio: 0.1,
} as const;

export const ACCEPTED_IMAGE_DEBUG = process.env.ACCEPTED_IMAGE_DEBUG === "true";

const templateRoot = path.join(process.cwd(), "public", "email-templates", "accepted");

export const ACCEPTED_TEMPLATES = {
  accepted: {
    key: "accepted",
    templatePath: path.join(templateRoot, "team-accepted.jpg"),
    outputPrefix: "accepted",
  },
  hacker: {
    key: "hacker",
    templatePath: path.join(templateRoot, "hacker.jpg"),
    outputPrefix: "hacker",
  },
  hipster: {
    key: "hipster",
    templatePath: path.join(templateRoot, "hipster.jpg"),
    outputPrefix: "hipster",
  },
  hustler: {
    key: "hustler",
    templatePath: path.join(templateRoot, "hustler.jpg"),
    outputPrefix: "hustler",
  },
} satisfies Record<AcceptedTemplateKey, AcceptedAssetTemplate>;

export function getTextBox(imageWidth: number, imageHeight: number): PixelTextBox {
  return {
    x: imageWidth * SHARED_TEXT_BOX.x,
    y: imageHeight * SHARED_TEXT_BOX.y,
    width: imageWidth * SHARED_TEXT_BOX.width,
    height: imageHeight * SHARED_TEXT_BOX.height,
  };
}

export function getInnerTextBox(textBox: PixelTextBox): PixelTextBox {
  const paddingX = textBox.width * TEXT_STYLE.horizontalPaddingRatio;
  const paddingY = textBox.height * TEXT_STYLE.verticalPaddingRatio;

  return {
    x: textBox.x + paddingX,
    y: textBox.y + paddingY,
    width: textBox.width - paddingX * 2,
    height: textBox.height - paddingY * 2,
  };
}
