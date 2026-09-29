import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { verifyAdminToken } from "@/lib/auth";
import { verifyStaffToken } from "@/lib/staff/auth";
import { describeProductImage } from "@/lib/gemini";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

function isSafePublicImagePath(imageUrl: string): boolean {
  if (!imageUrl.startsWith("/images/")) return false;
  if (imageUrl.includes("..") || imageUrl.includes("\\")) return false;
  return true;
}

export async function POST(request: NextRequest) {
  try {
    if (!verifyAdminToken(request) && !verifyStaffToken(request)) {
      return NextResponse.json(
        { message: "Please log in to generate product descriptions" },
        { status: 401 }
      );
    }

    if (!process.env.GEMINI_API_KEY?.trim()) {
      return NextResponse.json(
        { message: "Gemini is not configured on this server" },
        { status: 503 }
      );
    }

    const contentType = request.headers.get("content-type") || "";
    let buffer: Buffer;
    let mimeType = "image/jpeg";

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const file = formData.get("file") as File | null;
      if (!file) {
        return NextResponse.json(
          { message: "Please provide an image file" },
          { status: 400 }
        );
      }
      if (!file.type.startsWith("image/")) {
        return NextResponse.json(
          { message: "File must be an image" },
          { status: 400 }
        );
      }
      mimeType = file.type || "image/jpeg";
      buffer = Buffer.from(await file.arrayBuffer());
    } else {
      const body = await request.json().catch(() => null);
      const imageUrl = typeof body?.imageUrl === "string" ? body.imageUrl.trim() : "";
      if (!imageUrl || !isSafePublicImagePath(imageUrl)) {
        return NextResponse.json(
          { message: "Provide a local /images/… URL or multipart file" },
          { status: 400 }
        );
      }

      const absolute = path.join(process.cwd(), "public", imageUrl.replace(/^\//, ""));
      try {
        buffer = await fs.readFile(absolute);
      } catch {
        return NextResponse.json(
          { message: "Image file not found on server" },
          { status: 404 }
        );
      }
      const ext = path.extname(absolute).toLowerCase();
      mimeType =
        ext === ".png"
          ? "image/png"
          : ext === ".webp"
            ? "image/webp"
            : ext === ".gif"
              ? "image/gif"
              : "image/jpeg";
    }

    if (buffer.length > 12 * 1024 * 1024) {
      return NextResponse.json(
        { message: "Image is too large (max 12MB)" },
        { status: 400 }
      );
    }

    const suggestion = await describeProductImage(buffer, mimeType);
    return NextResponse.json({ suggestion });
  } catch (error: unknown) {
    console.error("[describe-product]", error);
    const message =
      error instanceof Error ? error.message : "Failed to describe image";
    return NextResponse.json({ message }, { status: 500 });
  }
}
