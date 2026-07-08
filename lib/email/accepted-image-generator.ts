import fs from "node:fs/promises";
import sharp from "sharp";
import {
  ACCEPTED_ROLE_TEMPLATE_CONFIGS,
  ACCEPTED_TEAM_TEMPLATE_CONFIG,
  type AcceptedTemplateConfig,
  type TemplateTextConfig,
  type TextBoxConfig,
} from "@/lib/email/accepted-template-config";
import { fitTextToBox } from "@/lib/email/text-fit";
import type { Role3H, TeamMember, TeamRegistrationDoc } from "@/lib/types/domain";

export type GeneratedAcceptedAttachment = {
  fileName: string;
  contentType: "image/jpeg";
  buffer: Buffer;
  type: "team" | Role3H;
};

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function safeFileNamePart(value: string) {
  const normalized = value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  return normalized || "sin-nombre";
}

function scaleBox(box: TextBoxConfig, source: AcceptedTemplateConfig, width: number, height: number) {
  const scaleX = width / source.designWidth;
  const scaleY = height / source.designHeight;

  return {
    x: box.x * scaleX,
    y: box.y * scaleY,
    width: box.width * scaleX,
    height: box.height * scaleY,
  };
}

function renderText(text: string, config: TemplateTextConfig, source: AcceptedTemplateConfig, width: number, height: number) {
  const box = scaleBox(config.box, source, width, height);
  const fitted = fitTextToBox({
    text,
    boxWidth: box.width,
    boxHeight: box.height,
    maxFontSize: Math.round(config.font.maxSize * (width / source.designWidth)),
    minFontSize: Math.round(config.font.minSize * (width / source.designWidth)),
    fontFamily: config.font.family,
    maxLines: config.font.maxLines,
  });
  const startY = box.y + (box.height - fitted.totalHeight) / 2 + fitted.fontSize * 0.86;
  const centerX = box.x + box.width / 2;

  return fitted.lines
    .map((line, index) => {
      const y = startY + index * fitted.lineHeight;
      return `<text x="${centerX}" y="${y}" text-anchor="middle" font-family="${escapeXml(
        fitted.fontFamily,
      )}" font-size="${fitted.fontSize}" font-weight="${config.font.weight}" fill="${config.font.color}">${escapeXml(
        line,
      )}</text>`;
    })
    .join("");
}

async function ensureTemplateExists(templatePath: string) {
  try {
    await fs.access(templatePath);
  } catch {
    throw new Error(`No se encontro la plantilla JPG requerida: ${templatePath}`);
  }
}

async function generateFromTemplate(input: {
  config: AcceptedTemplateConfig;
  fileName: string;
  text: string;
  type: GeneratedAcceptedAttachment["type"];
}) {
  await ensureTemplateExists(input.config.templatePath);

  const image = sharp(input.config.templatePath);
  const metadata = await image.metadata();
  const width = metadata.width ?? input.config.designWidth;
  const height = metadata.height ?? input.config.designHeight;
  const svg = [
    `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">`,
    ...input.config.texts.map((textConfig) =>
      renderText(input.text, textConfig, input.config, width, height),
    ),
    "</svg>",
  ].join("");

  const buffer = await image
    .composite([{ input: Buffer.from(svg), top: 0, left: 0 }])
    .jpeg({ quality: 92 })
    .toBuffer();

  return {
    fileName: input.fileName,
    contentType: "image/jpeg" as const,
    buffer,
    type: input.type,
  };
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
  await ensureTemplateExists(ACCEPTED_TEAM_TEMPLATE_CONFIG.templatePath);

  const uniqueRoles = [...new Set(roles)];
  for (const role of uniqueRoles) {
    await ensureTemplateExists(ACCEPTED_ROLE_TEMPLATE_CONFIGS[role].templatePath);
  }
}

export async function generateAcceptedEmailAttachments(registration: TeamRegistrationDoc) {
  const attachments: GeneratedAcceptedAttachment[] = [];
  const safeTeamName = safeFileNamePart(registration.teamName);

  attachments.push(
    await generateFromTemplate({
      config: ACCEPTED_TEAM_TEMPLATE_CONFIG,
      fileName: `accepted-${safeTeamName}.jpg`,
      text: registration.teamName,
      type: "team",
    }),
  );

  for (const [index, member] of registration.members.entries()) {
    attachments.push(
      await generateFromTemplate({
        config: ACCEPTED_ROLE_TEMPLATE_CONFIGS[member.role3H],
        fileName: roleAttachmentName(member, index),
        text: memberDisplayName(member),
        type: member.role3H,
      }),
    );
  }

  return attachments;
}
