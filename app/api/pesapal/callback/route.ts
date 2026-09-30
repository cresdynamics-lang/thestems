import { NextRequest, NextResponse } from "next/server";
import { checkPesapalPaymentStatus } from "@/lib/pesapal";
import { formatCurrency } from "@/lib/utils";
import { Resend } from "resend";
import { getOrderById, updateOrder } from "@/lib/db";
import { SITE_URL } from "@/lib/seo";
import {
  formatPaidOrderSms,
  notifyOwnerPhoneBackground,
} from "@/lib/notify-owner";

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1500;

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchPaymentStatusWithRetry(orderTrackingId: string, retries = MAX_RETRIES) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(
        `🔄 Pesapal: Fetching payment status (attempt ${attempt}/${retries}) for: ${orderTrackingId}`
      );
      const status = await checkPesapalPaymentStatus({ order_tracking_id: orderTrackingId });

      if (status && (status.payment_status_code !== undefined || status.payment_status_description)) {
        console.log(`✅ Pesapal: Status fetch successful on attempt ${attempt}`);
        return status;
      }

      console.log(`⚠️ Pesapal: Invalid status response on attempt ${attempt}`);
    } catch (error) {
      console.error(`❌ Pesapal: Status fetch failed on attempt ${attempt}:`, error);
    }

    if (attempt < retries) {
      await sleep(RETRY_DELAY_MS);
    }
  }

  console.log(`❌ Pesapal: All ${retries} status fetch attempts failed for: ${orderTrackingId}`);
  return null;
}

type ProcessResult = {
  newStatus: string;
  orderId: string;
  emailSent: boolean;
};

/**
 * Mark order paid/failed from Pesapal, email admin on paid, notify owner phone.
 * Safe to call from IPN (POST) and browser return (GET).
 */
async function processPesapalPayment(params: {
  OrderTrackingId: string;
  OrderMerchantReference: string;
}): Promise<ProcessResult> {
  const { OrderTrackingId, OrderMerchantReference: orderId } = params;

  const order = await getOrderById(orderId);
  if (!order) {
    throw Object.assign(new Error("Order not found"), { status: 404 });
  }

  // Already paid — still try email-once logic skipped; return early
  if (order.status === "paid") {
    console.log("ℹ️ Pesapal: Order already paid:", orderId.slice(0, 8));
    return { newStatus: "paid", orderId, emailSent: false };
  }

  const paymentStatus = await fetchPaymentStatusWithRetry(OrderTrackingId);

  let newStatus = "pending";
  let confirmationCode = "";
  let paymentMethod = "";

  if (paymentStatus) {
    // Pesapal: payment_status_code 1 = COMPLETED (also check description)
    const statusCode = paymentStatus.payment_status_code;
    const statusDesc = paymentStatus.payment_status_description?.toUpperCase();

    if (statusCode === 1 || statusDesc === "COMPLETED") {
      newStatus = "paid";
    } else if (statusCode === 2 || statusDesc === "FAILED" || statusCode === 3 || statusDesc === "REVERSED") {
      newStatus = "failed";
    }

    confirmationCode = paymentStatus.confirmation_code || "";
    paymentMethod = paymentStatus.payment_method || "";
  }

  const updateData: Record<string, unknown> = {
    status: newStatus,
    pesapal_order_tracking_id: OrderTrackingId,
    pesapal_payment_method: paymentMethod,
    updated_at: new Date().toISOString(),
  };
  if (confirmationCode) {
    updateData.pesapal_confirmation_code = confirmationCode;
  }

  const updatedOrder = await updateOrder(orderId, updateData);
  if (!updatedOrder) {
    throw Object.assign(new Error("Failed to update order"), { status: 500 });
  }

  let emailSent = false;

  if (newStatus === "paid") {
    try {
      const getImageUrl = (imagePath: string): string => {
        if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
          return imagePath;
        }
        return `https://thestemsflowers.co.ke${imagePath.startsWith("/") ? imagePath : `/${imagePath}`}`;
      };

      const emailSubject = `✅ PAYMENT CONFIRMED - Order #${orderId.slice(0, 8)} - ${formatCurrency(order.total_amount || order.total || 0)}`;

      const emailHtml = `
          <!DOCTYPE html>
          <html>
          <head><meta charset="utf-8"><title>Payment Confirmed</title></head>
          <body style="font-family:Arial,sans-serif;color:#333">
            <div style="background:#10b981;color:white;padding:20px;text-align:center">
              <h1>✅ PAYMENT CONFIRMED</h1>
              <p>Order #${orderId.slice(0, 8)} — Ready for Processing</p>
            </div>
            <div style="padding:20px;background:#f9fafb">
              <p><strong>Customer:</strong> ${order.customer_name}</p>
              <p><strong>Phone:</strong> ${order.phone}</p>
              <p><strong>Email:</strong> ${order.email || "Not provided"}</p>
              <p><strong>Delivery:</strong> ${order.delivery_address}</p>
              <p><strong>Delivery Date:</strong> ${order.delivery_date}</p>
              <p><strong>Payment:</strong> ${paymentMethod || "Pesapal"} ✅ PAID</p>
              ${confirmationCode ? `<p><strong>Confirmation:</strong> ${confirmationCode}</p>` : ""}
              <p><strong>Tracking:</strong> ${OrderTrackingId}</p>
              <h2>Items</h2>
              <ul>
                ${(order.items || [])
                  .map((item: { name?: string; quantity?: number; price?: number; image?: string }) => {
                    const itemTotal = (item.price || 0) * (item.quantity || 1);
                    const img = item.image ? getImageUrl(item.image) : "";
                    return `<li><strong>${item.quantity || 1}x ${item.name || "Item"}</strong> — ${formatCurrency(itemTotal)}${img ? ` · <a href="${img}">image</a>` : ""}</li>`;
                  })
                  .join("")}
              </ul>
              <p style="font-size:18px"><strong>Total: ${formatCurrency(order.total_amount || order.total || 0)}</strong></p>
              ${order.notes ? `<p><strong>Notes:</strong> ${String(order.notes).replace(/\n/g, "<br>")}</p>` : ""}
            </div>
          </body>
          </html>
        `;

      const apiKey = process.env.RESEND_API_KEY?.trim();
      if (!apiKey) {
        console.error("❌ Pesapal: RESEND_API_KEY missing — paid email skipped");
      } else {
        const resend = new Resend(apiKey);
        const recipientEmail = process.env.ADMIN_EMAIL || "thestemsflowers.ke@gmail.com";
        const fromEmail = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";

        const emailResult = await resend.emails.send({
          from: fromEmail,
          to: recipientEmail,
          subject: emailSubject,
          html: emailHtml,
        });

        if (emailResult.error) {
          console.error("❌ Pesapal: Email sending failed:", emailResult.error);
        } else {
          emailSent = true;
          console.log("✅ Pesapal: Email sent:", {
            emailId: emailResult.data?.id,
            orderId: orderId.slice(0, 8),
            recipient: recipientEmail,
          });
        }
      }
    } catch (emailErr) {
      console.error("❌ Pesapal: Failed to send email:", emailErr);
    }

    notifyOwnerPhoneBackground(
      formatPaidOrderSms({
        id: orderId,
        customer_name: order.customer_name,
        phone: order.phone,
        total_amount: order.total_amount,
        total: order.total,
        payment_method: paymentMethod || "pesapal",
      }),
      "payment_paid"
    );
  }

  return { newStatus, orderId, emailSent };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("Pesapal callback received:", JSON.stringify(body, null, 2));

    const { OrderTrackingId, OrderMerchantReference } = body;

    if (!OrderTrackingId || !OrderMerchantReference) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const result = await processPesapalPayment({
      OrderTrackingId,
      OrderMerchantReference,
    });

    return NextResponse.json({
      status: "success",
      message: "Callback processed successfully",
      paymentStatus: result.newStatus,
      emailSent: result.emailSent,
    });
  } catch (error: unknown) {
    const err = error as Error & { status?: number };
    console.error("Pesapal callback error:", error);
    return NextResponse.json(
      { error: "Callback processing failed", message: err.message },
      { status: err.status || 500 }
    );
  }
}

/** Browser return from Pesapal: confirm payment + email ASAP, then redirect to success → WhatsApp */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const orderTrackingId = searchParams.get("OrderTrackingId");
  const orderMerchantReference = searchParams.get("OrderMerchantReference");

  if (!orderTrackingId || !orderMerchantReference) {
    return NextResponse.json({ error: "Invalid redirect parameters" }, { status: 400 });
  }

  let paid = false;
  try {
    const result = await processPesapalPayment({
      OrderTrackingId: orderTrackingId,
      OrderMerchantReference: orderMerchantReference,
    });
    paid = result.newStatus === "paid";
    console.log("Pesapal GET return processed:", {
      orderId: orderMerchantReference.slice(0, 8),
      status: result.newStatus,
      emailSent: result.emailSent,
    });
  } catch (error) {
    console.error("Pesapal GET process error (still redirecting):", error);
  }

  const redirectUrl = paid
    ? `/order/success?id=${orderMerchantReference}&pesapal_tracking_id=${orderTrackingId}&paid=1`
    : `/order/success?id=${orderMerchantReference}&pesapal_tracking_id=${orderTrackingId}&pending=true`;

  return NextResponse.redirect(new URL(redirectUrl, SITE_URL));
}
