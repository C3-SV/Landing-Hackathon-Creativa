import path from "node:path";
import type { Role3H } from "@/lib/types/domain";

export type TextBoxConfig = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type TemplateTextConfig = {
  box: TextBoxConfig;
  font: {
    family: string;
    maxSize: number;
    minSize: number;
    color: string;
    weight: number;
    maxLines: number;
  };
};

export type AcceptedTemplateConfig = {
  templatePath: string;
  designWidth: number;
  designHeight: number;
  outputPrefix: string;
  texts: TemplateTextConfig[];
};

const templateRoot = path.join(process.cwd(), "public", "email-templates", "accepted");

const baseFont = {
  family: "Arial, Helvetica, sans-serif",
  color: "#0A1F3D",
  weight: 800,
};

export const ACCEPTED_TEAM_TEMPLATE_CONFIG: AcceptedTemplateConfig = {
  templatePath: path.join(templateRoot, "team-accepted.jpg"),
  designWidth: 1920,
  designHeight: 1080,
  outputPrefix: "accepted",
  texts: [
    {
      box: {
        x: 430,
        y: 690,
        width: 1060,
        height: 180,
      },
      font: {
        ...baseFont,
        maxSize: 86,
        minSize: 34,
        maxLines: 2,
      },
    },
  ],
};

export const ACCEPTED_ROLE_TEMPLATE_CONFIGS: Record<Role3H, AcceptedTemplateConfig> = {
  hacker: {
    templatePath: path.join(templateRoot, "hacker.jpg"),
    designWidth: 1080,
    designHeight: 1350,
    outputPrefix: "hacker",
    texts: [
      {
        box: {
          x: 150,
          y: 1035,
          width: 780,
          height: 170,
        },
        font: {
          ...baseFont,
          maxSize: 72,
          minSize: 30,
          maxLines: 2,
        },
      },
    ],
  },
  hipster: {
    templatePath: path.join(templateRoot, "hipster.jpg"),
    designWidth: 1080,
    designHeight: 1350,
    outputPrefix: "hipster",
    texts: [
      {
        box: {
          x: 150,
          y: 1035,
          width: 780,
          height: 170,
        },
        font: {
          ...baseFont,
          maxSize: 72,
          minSize: 30,
          maxLines: 2,
        },
      },
    ],
  },
  hustler: {
    templatePath: path.join(templateRoot, "hustler.jpg"),
    designWidth: 1080,
    designHeight: 1350,
    outputPrefix: "hustler",
    texts: [
      {
        box: {
          x: 150,
          y: 1035,
          width: 780,
          height: 170,
        },
        font: {
          ...baseFont,
          maxSize: 72,
          minSize: 30,
          maxLines: 2,
        },
      },
    ],
  },
};
