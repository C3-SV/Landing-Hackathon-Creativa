import fs from "node:fs/promises";
import sharp from "sharp";
import { loadHackathonFont } from "./image-font";
import { renderTextOverlay } from "./render-text-overlay";
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
  const svg = renderTextOverlay({
    imageWidth,
    imageHeight,
    text: input.text.normalize("NFC"),
    font,
    debug: input.debug,
    templateName: input.template.key,
  });
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
