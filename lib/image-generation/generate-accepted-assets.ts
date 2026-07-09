import fs from "node:fs/promises";
import sharp from "sharp";
import { loadHackathonFont } from "./image-font";
import { ImageGenerationError, renderTextOverlay, type RenderedTextOverlay } from "./render-text-overlay";
import {
  ACCEPTED_IMAGE_DEBUG,
  ACCEPTED_TEMPLATES,
  type AcceptedAssetTemplate,
} from "./template-config";
import type { Role3H, TeamMember, TeamRegistrationDoc } from "../types/domain";

export type GeneratedAcceptedAttachment = {
  fileName: string;
  contentType: "image/jpeg";
  buffer: Buffer;
  type: "team" | Role3H;
};

export type GenerateAcceptedAssetsOptions = {
  debug?: boolean;
};

export type AcceptedImageDebugAsset = {
  templateName: string;
  text: string;
  outputFileName: string;
  overlayOnlyPng: Buffer;
  finalCompositeJpg: Buffer;
  metrics: AcceptedImageRenderMetrics;
};

type AcceptedImageRenderMetrics = {
  templateName: string;
  text: string;
  svgLength: number;
  svgContainsFontFace: boolean;
  svgContainsText: boolean;
  overlayBytes: number;
  finalBytes: number;
  renderOverlayMs: number;
  compositeMs: number;
  outputFileName: string;
};

export function safeFileNamePart(value: string) {
  const normalized = value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  return normalized || "sin-nombre";
}

async function ensureTemplateExists(templatePath: string) {
  try {
    await fs.access(templatePath);
  } catch {
    throw new Error(`No se encontro la plantilla JPG requerida: ${templatePath}`);
  }
}

function ensureSvgDiagnostics(rendered: RenderedTextOverlay) {
  if (!rendered.svg.includes("@font-face")) {
    throw new ImageGenerationError("dynamic text SVG diagnostic is missing @font-face");
  }

  if (!rendered.svg.includes(rendered.normalizedText)) {
    throw new ImageGenerationError("dynamic text SVG diagnostic is missing normalized text");
  }
}

function ensureImageBuffers(input: {
  overlayBuffer: Buffer;
  finalBuffer: Buffer;
  templateName: string;
  text: string;
  outputFileName: string;
}) {
  if (!input.overlayBuffer || input.overlayBuffer.length < 1000) {
    throw new ImageGenerationError("dynamic text overlay could not be rendered");
  }

  if (!input.finalBuffer || input.finalBuffer.length < 10000) {
    throw new ImageGenerationError("final accepted image could not be rendered");
  }
}

function renderMetrics(input: {
  templateName: string;
  text: string;
  outputFileName: string;
  rendered: RenderedTextOverlay;
  finalBuffer: Buffer;
  compositeMs: number;
}): AcceptedImageRenderMetrics {
  return {
    templateName: input.templateName,
    text: input.text,
    svgLength: input.rendered.svg.length,
    svgContainsFontFace: input.rendered.svg.includes("@font-face"),
    svgContainsText: input.rendered.svg.includes(input.rendered.normalizedText),
    overlayBytes: input.rendered.overlayBuffer.length,
    finalBytes: input.finalBuffer.length,
    renderOverlayMs: input.rendered.renderOverlayMs,
    compositeMs: input.compositeMs,
    outputFileName: input.outputFileName,
  };
}

function logAcceptedImageStep(step: string, metrics: Partial<AcceptedImageRenderMetrics>) {
  console.info(`[accepted-image] ${step}`, metrics);
}

async function generateFromTemplate(input: {
  template: AcceptedAssetTemplate;
  fileName: string;
  text: string;
  type: GeneratedAcceptedAttachment["type"];
  debug?: boolean;
}) {
  await ensureTemplateExists(input.template.templatePath);

  const image = sharp(input.template.templatePath);
  const metadata = await image.metadata();
  const imageWidth = metadata.width;
  const imageHeight = metadata.height;

  if (!imageWidth || !imageHeight) {
    throw new Error(`No se pudieron leer dimensiones de la plantilla: ${input.template.templatePath}`);
  }

  const font = await loadHackathonFont();
  const rendered = await renderTextOverlay({
    imageWidth,
    imageHeight,
    text: input.text.normalize("NFC"),
    font,
    debug: input.debug,
    templateName: input.template.key,
  });
  ensureSvgDiagnostics(rendered);
  logAcceptedImageStep("SVG diagnostic built", {
    templateName: input.template.key,
    text: rendered.normalizedText,
    svgLength: rendered.svg.length,
    svgContainsFontFace: rendered.svg.includes("@font-face"),
    svgContainsText: rendered.svg.includes(rendered.normalizedText),
    outputFileName: input.fileName,
  });
  logAcceptedImageStep("Overlay buffer rendered", {
    templateName: input.template.key,
    text: rendered.normalizedText,
    overlayBytes: rendered.overlayBuffer.length,
    renderOverlayMs: rendered.renderOverlayMs,
    outputFileName: input.fileName,
  });

  const compositeStart = Date.now();
  const buffer = await image
    .composite([{ input: rendered.overlayBuffer, top: 0, left: 0 }])
    .jpeg({ quality: 92 })
    .toBuffer();
  const compositeMs = Date.now() - compositeStart;
  ensureImageBuffers({
    overlayBuffer: rendered.overlayBuffer,
    finalBuffer: buffer,
    templateName: input.template.key,
    text: rendered.normalizedText,
    outputFileName: input.fileName,
  });
  const metrics = renderMetrics({
    templateName: input.template.key,
    text: rendered.normalizedText,
    outputFileName: input.fileName,
    rendered,
    finalBuffer: buffer,
    compositeMs,
  });
  logAcceptedImageStep("Final composite rendered", metrics);

  return {
    fileName: input.fileName,
    contentType: "image/jpeg" as const,
    buffer,
    type: input.type,
  };
}

export async function generateAcceptedImageDebugAssets() {
  const template = ACCEPTED_TEMPLATES.accepted;
  await ensureTemplateExists(template.templatePath);

  const image = sharp(template.templatePath);
  const metadata = await image.metadata();
  const imageWidth = metadata.width;
  const imageHeight = metadata.height;

  if (!imageWidth || !imageHeight) {
    throw new Error(`No se pudieron leer dimensiones de la plantilla: ${template.templatePath}`);
  }

  const font = await loadHackathonFont();
  const texts = ["Christopher Marroquín", "Sofía López", "Equipo MOCK"];
  const assets: AcceptedImageDebugAsset[] = [];

  for (const text of texts) {
    const normalizedText = text.normalize("NFC");
    const outputFileName = `debug-${safeFileNamePart(normalizedText)}.jpg`;
    const rendered = await renderTextOverlay({
      imageWidth,
      imageHeight,
      text: normalizedText,
      font,
      debug: true,
      templateName: template.key,
    });
    ensureSvgDiagnostics(rendered);
    const compositeStart = Date.now();
    const finalCompositeJpg = await sharp(template.templatePath)
      .composite([{ input: rendered.overlayBuffer, top: 0, left: 0 }])
      .jpeg({ quality: 92 })
      .toBuffer();
    const compositeMs = Date.now() - compositeStart;
    ensureImageBuffers({
      overlayBuffer: rendered.overlayBuffer,
      finalBuffer: finalCompositeJpg,
      templateName: template.key,
      text: normalizedText,
      outputFileName,
    });
    const metrics = renderMetrics({
      templateName: template.key,
      text: normalizedText,
      outputFileName,
      rendered,
      finalBuffer: finalCompositeJpg,
      compositeMs,
    });
    logAcceptedImageStep("Debug image rendered", metrics);

    assets.push({
      templateName: template.key,
      text: normalizedText,
      outputFileName,
      overlayOnlyPng: rendered.overlayBuffer,
      finalCompositeJpg,
      metrics,
    });
  }

  return assets;
}

function memberDisplayName(member: TeamMember) {
  return `${member.firstName} ${member.lastName}`.trim();
}

function roleAttachmentName(member: TeamMember, index: number) {
  const safeName = safeFileNamePart(memberDisplayName(member));
  if (index <= 2) {
    return `${member.role3H}-${safeName}.jpg`;
  }

  return `extra-${member.role3H}-${safeName}.jpg`;
}

export async function assertAcceptedTemplatesExist(roles: readonly Role3H[]) {
  await ensureTemplateExists(ACCEPTED_TEMPLATES.accepted.templatePath);

  const uniqueRoles = [...new Set(roles)];
  for (const role of uniqueRoles) {
    await ensureTemplateExists(ACCEPTED_TEMPLATES[role].templatePath);
  }
}

export async function generateAcceptedEmailAttachments(
  registration: TeamRegistrationDoc,
  options: GenerateAcceptedAssetsOptions = {},
) {
  const debug = options.debug ?? ACCEPTED_IMAGE_DEBUG;
  const attachments: GeneratedAcceptedAttachment[] = [];
  const safeTeamName = safeFileNamePart(registration.teamName);

  attachments.push(
    await generateFromTemplate({
      template: ACCEPTED_TEMPLATES.accepted,
      fileName: `accepted-${safeTeamName}.jpg`,
      text: registration.teamName,
      type: "team",
      debug,
    }),
  );

  for (const [index, member] of registration.members.entries()) {
    attachments.push(
      await generateFromTemplate({
        template: ACCEPTED_TEMPLATES[member.role3H],
        fileName: roleAttachmentName(member, index),
        text: memberDisplayName(member),
        type: member.role3H,
        debug,
      }),
    );
  }

  return attachments;
}
