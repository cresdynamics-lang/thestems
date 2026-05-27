import { NextRequest, NextResponse } from "next/server";
import { requireStaff } from "@/lib/staff/auth";
import { logStaffAction, getClientIp } from "@/lib/staff/audit";
import { canDelete } from "@/lib/staff/permissions";
import { getProducts } from "@/lib/db";
import { listProductsSummary } from "@/lib/staff/queries";
import { supabaseAdmin } from "@/lib/supabase";
import { revalidatePath, revalidateTag } from "next/cache";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    requireStaff(request);
    const category = request.nextUrl.searchParams.get("category") || undefined;
    const search = request.nextUrl.searchParams.get("search")?.toLowerCase();
    const summary = request.nextUrl.searchParams.get("summary") === "1";

    const useSummary = summary || request.nextUrl.searchParams.get("full") !== "1";

    if (useSummary) {
      let rows = await listProductsSummary(category);
      if (search) {
        rows = rows.filter(
          (p) =>
            String(p.title || "")
              .toLowerCase()
              .includes(search) ||
            String(p.slug || "")
              .toLowerCase()
              .includes(search)
        );
      }
      return NextResponse.json(rows);
    }

    let products = await getProducts(
      category ? { category, includeDrafts: true } : { includeDrafts: true }
    );
    if (search) {
      products = products.filter(
        (p) =>
          p.title.toLowerCase().includes(search) ||
          p.slug.toLowerCase().includes(search)
      );
    }
    return NextResponse.json(products);
  } catch (e: unknown) {
    if (e instanceof Error && e.message === "Unauthorized") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ message: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const staff = requireStaff(request);
    const body = await request.json();
    const { data, error } = await (supabaseAdmin.from("products") as ReturnType<typeof supabaseAdmin.from>)
      .insert({
        slug: body.slug,
        title: body.title,
        description: body.description,
        short_description: body.short_description,
        price: body.price,
        sale_price: body.sale_price || null,
        category: body.category,
        subcategory: body.subcategory || null,
        tags: body.tags || [],
        sku: body.sku || null,
        visibility: body.visibility || "published",
        stock: body.stock ?? null,
        low_stock_threshold: body.low_stock_threshold ?? 5,
        teddy_size: body.teddy_size || null,
        teddy_color: body.teddy_color || null,
        images: body.images || [],
        included_items: body.included_items || null,
      })
      .select()
      .single();

    if (error) return NextResponse.json({ message: error.message }, { status: 400 });

    await logStaffAction({
      staffId: staff.id,
      staffEmail: staff.email,
      staffName: staff.name,
      action: "product.create",
      entityType: "product",
      entityId: data.id,
      ipAddress: getClientIp(request),
    });

    revalidatePath("/");
    revalidateTag("products", "max");
    return NextResponse.json(data);
  } catch (e: unknown) {
    if (e instanceof Error && e.message === "Unauthorized") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ message: "Failed to create product" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const staff = requireStaff(request);
    const { ids, action, price } = await request.json();
    if (!ids?.length || !action) {
      return NextResponse.json({ message: "ids and action required" }, { status: 400 });
    }

    if (action === "delete" && !canDelete(staff.role)) {
      return NextResponse.json({ message: "Staff cannot bulk delete" }, { status: 403 });
    }

    if (action === "delete") {
      await (supabaseAdmin.from("products") as ReturnType<typeof supabaseAdmin.from>)
        .delete()
        .in("id", ids);
    } else if (action === "publish") {
      await (supabaseAdmin.from("products") as ReturnType<typeof supabaseAdmin.from>)
        .update({ visibility: "published" })
        .in("id", ids);
    } else if (action === "unpublish") {
      await (supabaseAdmin.from("products") as ReturnType<typeof supabaseAdmin.from>)
        .update({ visibility: "draft" })
        .in("id", ids);
    } else if (action === "update_price" && price != null) {
      await (supabaseAdmin.from("products") as ReturnType<typeof supabaseAdmin.from>)
        .update({ price })
        .in("id", ids);
    }

    await logStaffAction({
      staffId: staff.id,
      staffEmail: staff.email,
      action: `product.bulk_${action}`,
      details: { ids, price },
      ipAddress: getClientIp(request),
    });

    revalidateTag("products", "max");
    return NextResponse.json({ message: "Bulk action completed" });
  } catch (e: unknown) {
    if (e instanceof Error && e.message === "Unauthorized") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ message: "Bulk action failed" }, { status: 500 });
  }
}
