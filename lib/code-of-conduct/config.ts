import { SITE_ORIGIN } from "@/lib/seo/metadata";

export const PUBLIC_CODE_OF_CONDUCT_URL = new URL(
  "/codigo-de-conducta",
  SITE_ORIGIN,
).toString();

export const CODE_OF_CONDUCT_EMAIL_CONFIG = {
  publicCodeOfConductUrl: PUBLIC_CODE_OF_CONDUCT_URL,
  whatsappGroupLink:
    process.env.HTC_WHATSAPP_GROUP_LINK ?? "TODO_AGREGAR_LINK_WHATSAPP",
  keyRegulationsUrl:
    process.env.HTC_KEY_REGULATIONS_URL ?? "TODO_AGREGAR_REGLAMENTO_KEY",
  keyRegulationsText:
    process.env.HTC_KEY_REGULATIONS_TEXT ?? "TODO_AGREGAR_REGLAMENTO_KEY",
  welcomeMessage:
    process.env.HTC_WELCOME_MESSAGE ?? "TODO_AGREGAR_TEXTO_BIENVENIDA",
  eventLogisticsText:
    process.env.HTC_EVENT_LOGISTICS_TEXT ?? "TODO_AGREGAR_LOGISTICA",
} as const;

export function buildCodeOfConductAcceptUrl(token: string) {
  return new URL(`/codigo-de-conducta/aceptar/${token}`, SITE_ORIGIN).toString();
}
