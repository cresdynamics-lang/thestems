import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { requireStaff } from "@/lib/staff/auth";
import { logStaffAction, getClientIp } from "@/lib/staff/audit";
import {
  loadHomepageSections,
  saveHomepageSections,
  type HomepageSectionRow,
} from "@/lib/homepage-sections";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    requireStaff(request);
    const result = await loadHomepageSections();
    return NextResponse.json({
      sections: result.sections,
      setupRequired: result.setupRequired,
      message: result.message,
    });
  } catch (e: unknown) {
    if (e instanceof Error && e.message === "Unauthorized") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ message: "Failed to load sections" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const staff = requireStaff(request);
    const body = await request.json();
    const sections = (body.sections || []) as HomepageSectionRow[];

    if (!Array.isArray(sections) || sections.length === 0) {
      return NextResponse.json({ message: "No sections to save" }, { status: 400 });
    }

    const updated = await saveHomepageSections(sections);

    await logStaffAction({
      staffEmail: staff.email,
      action: "update_homepage_sections",
      entityType: "homepage_sections",
      details: { count: sections.length },
      ipAddress: getClientIp(request),
    });

    revalidatePath("/");
    revalidateTag("products", "max");
    revalidateTag("homepage-sections", "max");

    return NextResponse.json({
      message: "Saved",
      sections: updated,
      setupRequired: false,
    });
  } catch (e: unknown) {
    if (e instanceof Error && e.message === "Unauthorized") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const message = e instanceof Error ? e.message : "Failed to save sections";
    return NextResponse.json({ message }, { status: 500 });
  }
}
