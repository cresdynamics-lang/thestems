import { NextRequest, NextResponse } from "next/server";
import { createOrder, getOrders } from "@/lib/db";
import { Resend } from "resend";
import { formatCurrency } from "@/lib/utils";
import { SHOP_INFO } from "@/lib/constants";

/** Fire-and-forget "new order (pending)" email: admin always, customer when email provided. */
async function sendPendingOrderNotifications(order: any) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("⚠️ RESEND_API_KEY not configured — pending-order email skipped");
    return;
  }
  const resend = new Resend(apiKey);
  const fromEmail = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";
  const adminEmail = process.env.ADMIN_EMAIL || "thestemsflowers.ke@gmail.com";

  const shortId = order.id.slice(0, 8);
  const isOnlinePayment = order.payment_method === "pesapal" || order.payment_method === "card";
  const itemsRows = (order.items || [])
    .map(
      (item: any) =>
        `<tr><td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;">${item.quantity || 1}x ${item.name || "Item"}</td><td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;text-align:right;">${formatCurrency((item.price || 0) * (item.quantity || 1))}</td></tr>`
    )
    .join("");

  const adminHtml = `
    <div style="font-family:Arial,sans-serif;color:#333;">
      <div style="background:#f59e0b;color:#fff;padding:16px;text-align:center;">
        <h1 style="margin:0;">🛒 NEW ORDER — PENDING ${isOnlinePayment ? "PAYMENT" : "CONFIRMATION"}</h1>
      </div>
      <div style="padding:16px;background:#f9fafb;">
        <div style="background:#fff;border-left:4px solid #f59e0b;padding:12px;border-radius:8px;">
          <p><strong>Order ID:</strong> ${order.id.slice(0, 8)}</p>
          <p><strong>Customer:</strong> ${order.customer_name || "—"}</p>
          <p><strong>Phone:</strong> ${order.phone || "—"}</p>
          <p><strong>Email:</strong> ${order.email || "Not provided"}</p>
          <p><strong>Delivery Address:</strong> ${order.delivery_address || "—"}</p>
          <p><strong>Delivery Date:</strong> ${order.delivery_date || "—"}</p>
          <p><strong>Payment Method:</strong> ${order.payment_method}</p>
          <p><strong>Status:</strong> ⏳ PENDING</p>
        </div>
        <table style="width:100%;border-collapse:collapse;background:#fff;margin:12px 0;">
          <thead><tr><th style="text-align:left;padding:8px 12px;background:#f3f4f6;">Item</th><th style="text-align:right;padding:8px 12px;background:#f3f4f6;">Total</th></tr></thead>
          <tbody>${itemsRows}
            <tr><td style="padding:10px 12px;"><strong>Total</strong></td><td style="padding:10px 12px;text-align:right;font-weight:bold;color:#10b981;">${formatCurrency(order.total_amount || order.total || 0)}</td></tr>
          </tbody>
        </table>
        ${order.notes ? `<p><strong>Notes:</strong> ${String(order.notes).replace(/\n/g, "<br>")}</p>` : ""}
        <div style="background:#fef3c7;padding:12px;border-radius:8px;">
          <p style="margin:0;">⚡ Reach out to the customer to confirm: <strong>${order.phone || ""}</strong>${order.email ? ` · ${order.email}` : ""}</p>
        </div>
      </div>
      <p style="text-align:center;color:#6b7280;font-size:12px;">Order #${order.id.slice(0, 8)} · ${new Date().toISOString()} · The Stems Flower Delivery System</p>
    </div>
  `;

  const customerHtml = `
    <div style="font-family:Arial,sans-serif;color:#333;">
      <div style="background:#16a34a;color:#fff;padding:16px;text-align:center;">
        <h1 style="margin:0;">🌸 Thank You for Your Order!</h1>
      </div>
      <div style="padding:16px;background:#f9fafb;">
        <p>Hi ${order.customer_name || "there"},</p>
        <p>We've received your order <strong>#${order.id.slice(0, 8)}</strong>${isOnlinePayment ? " and you're being taken to our secure payment page" : ""}. Your order status is <strong>PENDING</strong> until payment is confirmed.</p>
        <div style="background:#fff;padding:12px;border-radius:8px;margin:12px 0;">
          <p><strong>Order ID:</strong> ${order.id.slice(0, 8)}</p>
          <p><strong>Total:</strong> ${formatCurrency(order.total_amount || order.total || 0)}</p>
          <p><strong>Delivery:</strong> ${order.delivery_address || "—"} · ${order.delivery_date || ""}</p>
        </div>
        ${isOnlinePayment
          ? `<p>If the payment page didn't open, you can pay via M-Pesa:</p>
             <ul><li><strong>Till Number:</strong> ${SHOP_INFO.mpesa.till}</li><li><strong>Paybill:</strong> ${SHOP_INFO.mpesa.paybill} (Account: ${SHOP_INFO.mpesa.account})</li></ul>
             <p>After payment, confirm with us on <a href="https://wa.me/${SHOP_INFO.whatsapp}?text=${encodeURIComponent(`Hello! I placed order ${order.id.slice(0, 8)}.`)}" style="color:#16a34a;">WhatsApp</a>.</p>`
          : ""}
        <p style="margin:0;">Track your order: <a href="https://thestemsflowers.co.ke/order/success?id=${order.id}" style="color:#16a34a;">View order status</a></p>
      </div>
      <p style="text-align:center;color:#6b7280;font-size:12px;">The Stems — Fresh flowers, delivered same-day in Nairobi.</p>
    </div>
  `;

  try {
    const adminResult = await resend.emails.send({
      from: fromEmail,
      to: adminEmail,
      subject: `🛒 NEW ORDER (PENDING) #${order.id.slice(0, 8)} — ${formatCurrency(order.total_amount || order.total || 0)} — ${order.customer_name || order.phone || ""}`,
      html: adminHtml,
    });
    if (adminResult.error) {
      console.error("❌ Pending-order admin email failed:", adminResult.error);
    } else {
      console.log("✅ Pending-order admin email sent:", { emailId: adminResult.data?.id, orderId: order.id.slice(0, 8) });
    }
  } catch (e) {
    console.error("❌ Pending-order admin email error:", e);
  }

  if (order.email) {
    try {
      const custResult = await resend.emails.send({
        from: fromEmail,
        to: order.email,
        subject: `🌸 Order received — #${order.id.slice(0, 8)} (pending payment)`,
        html: customerHtml,
      });
      if (custResult.error) {
        console.error("❌ Pending-order customer email failed:", custResult.error);
      } else {
        console.log("✅ Pending-order customer email sent:", { emailId: custResult.data?.id, to: order.email });
      }
    } catch (e) {
      console.error("❌ Pending-order customer email error:", e);
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("📦 Creating new order:", {
      customerName: body.customer_name,
      phone: body.phone,
      paymentMethod: body.payment_method,
      totalAmount: body.total || body.total_amount,
      itemCount: body.items?.length || 0,
      deliveryAddress: body.delivery_address
    });

    const order = await createOrder({
      items: body.items,
      total_amount: body.total || body.total_amount,
      total: body.total || body.total_amount,
      customer_name: body.customer_name,
      phone: body.phone,
      email: body.email || null,
      delivery_address: body.delivery_address,
      delivery_city: body.delivery_city || body.delivery_location || "Nairobi",
      delivery_location: body.delivery_location || body.delivery_city || null,
      gift_message: body.gift_message || null,
      special_instructions: body.special_instructions || null,
      recipient_name: body.recipient_name || null,
      recipient_phone: body.recipient_phone || null,
      delivery_date: body.delivery_date,
      payment_method: body.payment_method || "whatsapp",
      status: "pending",
      notes: body.notes || null,
    } as Parameters<typeof createOrder>[0]);

    if (!order) {
      console.error("❌ Failed to create order in database");
      return NextResponse.json(
        { message: "Failed to create order. Please check server logs." },
        { status: 500 }
      );
    }

    console.log("✅ Order created successfully:", {
      orderId: order.id,
      status: order.status,
      paymentMethod: order.payment_method
    });

    // Notify admin (+ customer when email provided) that a pending order was placed.
    // Awaited but error-safe: email failures never fail the order response.
    try {
      await sendPendingOrderNotifications(order);
    } catch (emailErr) {
      console.error("❌ Pending-order notification error:", emailErr);
    }

    return NextResponse.json(order);
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to create order";
    console.error("❌ Create order error:", message);
    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get("status") || undefined;

    const orders = await getOrders({ status });

    // Log failed orders summary
    if (status === "failed" || !status) {
      const failedOrders = status === "failed" ? orders : orders.filter(o => o.status === "failed");
      
      console.log(`📊 Failed Orders Summary: Found ${failedOrders.length} failed orders`);
      
      failedOrders.forEach((order, index) => {
        console.log(`❌ Failed Order ${index + 1}:`, {
          orderId: order.id.slice(0, 8),
          customerName: order.customer_name,
          phone: order.phone,
          amount: order.total_amount || order.total || 0,
          paymentMethod: order.payment_method,
          createdAt: order.created_at,
          pesapalTrackingId: order.pesapal_order_tracking_id,
          pesapalPaymentMethod: order.pesapal_payment_method,
          deliveryAddress: order.delivery_address
        });
      });
    }

    return NextResponse.json(orders);
  } catch (error: any) {
    console.error("Get orders error:", error);
    return NextResponse.json(
      { message: error.message || "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

