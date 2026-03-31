import { NextRequest, NextResponse } from "next/server";
import { getOrderById, updateOrder } from "@/lib/db";
import { Resend } from "resend";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { SHOP_INFO } from "@/lib/constants";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId, newStatus, notifyCustomer = false } = body;

    console.log("🔄 Order Status Update Request:", { orderId, newStatus, notifyCustomer });

    if (!orderId || !newStatus) {
      return NextResponse.json(
        { error: "Missing required fields: orderId, newStatus" },
        { status: 400 }
      );
    }

    // Validate status
    const validStatuses = ["pending", "paid", "failed", "shipped", "delivered", "cancelled"];
    if (!validStatuses.includes(newStatus)) {
      return NextResponse.json(
        { error: `Invalid status. Must be one of: ${validStatuses.join(", ")}` },
        { status: 400 }
      );
    }

    // Get current order
    const order = await getOrderById(orderId);
    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    console.log("📦 Current order status:", {
      orderId: order.id,
      currentStatus: order.status,
      newStatus,
      customerName: order.customer_name
    });

    // Update order status
    const updateData: any = {
      status: newStatus,
      updated_at: new Date().toISOString(),
    };

    // Add status-specific timestamps
    if (newStatus === "paid" && !order.paid_at) {
      updateData.paid_at = new Date().toISOString();
    } else if (newStatus === "shipped" && !order.shipped_at) {
      updateData.shipped_at = new Date().toISOString();
    } else if (newStatus === "delivered" && !order.delivered_at) {
      updateData.delivered_at = new Date().toISOString();
    }

    const updatedOrder = await updateOrder(orderId, updateData);

    if (!updatedOrder) {
      return NextResponse.json(
        { error: "Failed to update order status" },
        { status: 500 }
      );
    }

    console.log("✅ Order status updated successfully:", {
      orderId: updatedOrder.id,
      previousStatus: order.status,
      newStatus: updatedOrder.status
    });

    // Send email notification for status changes
    try {
      await sendStatusNotificationEmail(updatedOrder, order.status);
    } catch (emailErr) {
      console.error("❌ Failed to send status notification email:", emailErr);
    }

    // Send customer SMS/WhatsApp notification if requested
    if (notifyCustomer) {
      try {
        await sendCustomerNotification(updatedOrder);
      } catch (smsErr) {
        console.error("❌ Failed to send customer notification:", smsErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Order status updated successfully",
      order: updatedOrder
    });

  } catch (error: any) {
    console.error("❌ Order status update error:", error);
    return NextResponse.json(
      {
        error: "Status update failed",
        message: error.message,
      },
      { status: 500 }
    );
  }
}

async function sendStatusNotificationEmail(order: any, previousStatus: string) {
  const statusColors = {
    pending: "#f59e0b",
    paid: "#10b981", 
    failed: "#ef4444",
    shipped: "#3b82f6",
    delivered: "#10b981",
    cancelled: "#6b7280"
  };

  const statusEmojis = {
    pending: "⏳",
    paid: "✅",
    failed: "❌",
    shipped: "🚚",
    delivered: "🎉",
    cancelled: "🚫"
  };

  const color = statusColors[order.status as keyof typeof statusColors] || "#6b7280";
  const emoji = statusEmojis[order.status as keyof typeof statusEmojis] || "📦";

  const emailSubject = `${emoji} Order Status Updated - #${order.id.slice(0, 8)} - ${order.status.toUpperCase()}`;
  
  const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Order Status Update - #${order.id.slice(0, 8)}</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .header { background: ${color}; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9fafb; }
        .status-change { background: white; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid ${color}; }
        .order-info { background: white; padding: 15px; border-radius: 8px; margin: 15px 0; }
        .timeline { background: white; padding: 15px; border-radius: 8px; margin: 15px 0; }
        .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>${emoji} Order Status Updated</h1>
        <p>Order #${order.id.slice(0, 8)} - ${order.status.toUpperCase()}</p>
      </div>
      
      <div class="content">
        <div class="status-change">
          <h2>🔄 Status Change</h2>
          <p><strong>Previous Status:</strong> ${previousStatus}</p>
          <p><strong>New Status:</strong> <strong style="color: ${color};">${order.status.toUpperCase()}</strong></p>
          <p><strong>Updated At:</strong> ${formatDateTime(order.updated_at)}</p>
        </div>

        <div class="order-info">
          <h2>📦 Order Information</h2>
          <p><strong>Order ID:</strong> ${order.id.slice(0, 8)}</p>
          <p><strong>Customer:</strong> ${order.customer_name}</p>
          <p><strong>Phone:</strong> ${order.phone}</p>
          <p><strong>Total Amount:</strong> ${formatCurrency(order.total_amount || order.total || 0)}</p>
          <p><strong>Payment Method:</strong> ${order.payment_method}</p>
        </div>

        <div class="timeline">
          <h2>📅 Order Timeline</h2>
          <p><strong>Order Created:</strong> ${formatDateTime(order.created_at)}</p>
          ${order.paid_at ? `<p><strong>Payment Confirmed:</strong> ${formatDateTime(order.paid_at)}</p>` : ''}
          ${order.shipped_at ? `<p><strong>Order Shipped:</strong> ${formatDateTime(order.shipped_at)}</p>` : ''}
          ${order.delivered_at ? `<p><strong>Order Delivered:</strong> ${formatDateTime(order.delivered_at)}</p>` : ''}
        </div>

        ${getActionRequiredText(order.status)}
      </div>

      <div class="footer">
        <p>This email was sent by The Stems Flower Delivery System</p>
        <p>Order ID: ${order.id.slice(0, 8)} | Status: ${order.status}</p>
        <p>Generated: ${new Date().toISOString()}</p>
      </div>
    </body>
    </html>
  `;

  const resend = new Resend(process.env.RESEND_API_KEY || "re_jE9T351o_6gDh55gy8PHW4LWZJENwXFKR");
  const recipientEmail = process.env.ADMIN_EMAIL || "thestemsflowers.ke@gmail.com";
  const fromEmail = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";

  const emailResult = await resend.emails.send({
    from: fromEmail,
    to: recipientEmail,
    subject: emailSubject,
    html: emailHtml,
  });

  if (emailResult.error) {
    throw emailResult.error;
  }

  console.log("✅ Status update email sent successfully:", {
    emailId: emailResult.data?.id,
    orderId: order.id.slice(0, 8),
    status: order.status
  });
}

function getActionRequiredText(status: string): string {
  const actions = {
    paid: `
      <div class="status-change">
        <h2>⚡ Action Required</h2>
        <p><strong>Payment confirmed - please process this order:</strong></p>
        <ul>
          <li>📦 Prepare items for delivery</li>
          <li>🚚 Arrange delivery to: Customer address</li>
          <li>📞 Contact customer to confirm delivery time</li>
        </ul>
      </div>
    `,
    shipped: `
      <div class="status-change">
        <h2>📋 Order Shipped</h2>
        <p>The order has been shipped and is on its way to the customer.</p>
        <p>Please track the delivery and update status when delivered.</p>
      </div>
    `,
    delivered: `
      <div class="status-change">
        <h2>🎉 Order Delivered</h2>
        <p>The order has been successfully delivered to the customer.</p>
        <p>No further action required for this order.</p>
      </div>
    `,
    failed: `
      <div class="status-change">
        <h2>❌ Payment Failed</h2>
        <p>The payment for this order has failed.</p>
        <p>Please contact the customer to arrange alternative payment.</p>
      </div>
    `,
    cancelled: `
      <div class="status-change">
        <h2>🚫 Order Cancelled</h2>
        <p>This order has been cancelled.</p>
        <p>No further action required.</p>
      </div>
    `
  };

  return actions[status as keyof typeof actions] || '';
}

async function sendCustomerNotification(order: any) {
  // This would integrate with an SMS/WhatsApp API
  // For now, we'll just log it
  console.log("📱 Customer notification would be sent for order:", {
    orderId: order.id.slice(0, 8),
    status: order.status,
    customerPhone: order.phone,
    customerName: order.customer_name
  });

  // Example implementation would go here:
  // const message = getCustomerMessage(order.status, order.id);
  // await sendSMS(order.phone, message);
  // or
  // await sendWhatsApp(order.phone, message);
}

function getCustomerMessage(status: string, orderId: string): string {
  const messages = {
    paid: `✅ Your payment for order #${orderId.slice(0, 8)} has been confirmed. We're preparing your order for delivery!`,
    shipped: `🚚 Your order #${orderId.slice(0, 8)} has been shipped! You'll receive it soon.`,
    delivered: `🎉 Your order #${orderId.slice(0, 8)} has been delivered. Enjoy your flowers!`,
    failed: `❌ Payment for order #${orderId.slice(0, 8)} failed. Please contact us to arrange alternative payment.`,
    cancelled: `🚫 Order #${orderId.slice(0, 8)} has been cancelled. Please contact us if you have any questions.`
  };

  return messages[status as keyof typeof messages] || `Your order #${orderId.slice(0, 8)} status has been updated to: ${status}`;
}
