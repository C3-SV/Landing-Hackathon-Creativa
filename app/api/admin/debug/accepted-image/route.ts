import { NextResponse } from "next/server";
import { requireAdminUser } from "@/lib/auth/admin";
import { generateAcceptedImageDebugAssets } from "@/lib/image-generation/generate-accepted-assets";

export const runtime = "nodejs";

export async function GET() {
  const auth = await requireAdminUser();
  if (!auth.ok) {
    return auth.response;
  }

  try {
    const assets = await generateAcceptedImageDebugAssets();

    return NextResponse.json({
      generatedAt: new Date().toISOString(),
      assets: assets.map((asset) => ({
        templateName: asset.templateName,
        text: asset.text,
        outputFileName: asset.outputFileName,
        overlayOnlyFileName: "overlay-only.png",
        finalCompositeFileName: "final-composite.jpg",
        overlayOnlyPng: `data:image/png;base64,${asset.overlayOnlyPng.toString("base64")}`,
        finalCompositeJpg: `data:image/jpeg;base64,${asset.finalCompositeJpg.toString("base64")}`,
        metrics: asset.metrics,
      })),
    });
  } catch (error) {
    console.error("[accepted-image] Debug endpoint failed", {
      error: error instanceof Error ? error.message : error,
      nodeEnv: process.env.NODE_ENV,
      vercelEnv: process.env.VERCEL_ENV,
    });

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "image_generation_failed: accepted image debug render failed",
      },
      { status: 500 },
    );
  }
}
