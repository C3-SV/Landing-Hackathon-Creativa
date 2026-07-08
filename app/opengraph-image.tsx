import { ImageResponse } from "next/og";
import { BRANDING } from "@/lib/constants/branding";

export const runtime = "edge";

export const alt =
  "Hackathon de Turismo Creativo Vol. 1, + Turismo + CÃ³digo + Cultura, organizado por C3 y PoliÃ©drica";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          position: "relative",
          width: "100%",
          height: "100%",
          alignItems: "stretch",
          justifyContent: "space-between",
          background:
            "linear-gradient(135deg, #081326 0%, #0d1f41 52%, #132e5f 100%)",
          color: "#f5f8ff",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: "48px 48px auto auto",
            width: "180px",
            height: "180px",
            borderRadius: "999px",
            background: "rgba(255, 122, 0, 0.18)",
            filter: "blur(2px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: "auto auto 32px 24px",
            width: "300px",
            height: "300px",
            borderRadius: "999px",
            background: "rgba(26, 130, 255, 0.18)",
            filter: "blur(2px)",
          }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "100%",
            padding: "52px 58px",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              alignSelf: "flex-start",
              border: "2px solid rgba(255, 122, 0, 0.8)",
              borderRadius: "999px",
              padding: "12px 18px",
              color: "#ffb07a",
              fontSize: "22px",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
            }}
          >
            {BRANDING.eventName}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            <div
              style={{
                fontSize: "72px",
                fontWeight: 800,
                lineHeight: 1.02,
                letterSpacing: "-0.03em",
                maxWidth: "12ch",
              }}
            >
              {BRANDING.eventName}
            </div>

            <div
              style={{
                fontSize: "36px",
                fontWeight: 700,
                color: "#ffb07a",
              }}
            >
              {BRANDING.thematicLine}
            </div>

            <div
              style={{
                fontSize: "28px",
                lineHeight: 1.4,
                color: "rgba(245, 248, 255, 0.88)",
                maxWidth: "20ch",
              }}
            >
              Todo Suma
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              gap: "24px",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <div
                style={{
                  fontSize: "24px",
                  fontWeight: 700,
                  color: "#ffb07a",
                }}
              >
                C3 / Competitive Coding Club
              </div>
              <div
                style={{
                  fontSize: "24px",
                  fontWeight: 700,
                  color: "#f5f8ff",
                }}
              >
                PoliÃ©drica
              </div>
            </div>
            <div
              style={{
                fontSize: "18px",
                color: "rgba(245, 248, 255, 0.7)",
                textAlign: "right",
                maxWidth: "28ch",
              }}
            >
              Hackathon para construir prototipos y soluciones colaborativas a retos reales.
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    },
  );
}
