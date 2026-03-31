import { NextRequest, NextResponse } from "next/server";
import { checkPesapalPaymentStatus } from "@/lib/pesapal";
import { formatCurrency } from "@/lib/utils";
import { Resend } from "resend";
import { SHOP_INFO } from "@/lib/constants";
import { getOrderById, updateOrder } from "@/lib/db";

// Retry configuration
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 2000; // 2 seconds

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchPaymentStatusWithRetry(orderTrackingId: string, retries = MAX_RETRIES): Promise<any> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`🔄 Pesapal: Fetching payment status (attempt ${attempt}/${retries}) for: ${orderTrackingId}`);
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
      console.log(`⏳ Pesapal: Waiting ${RETRY_DELAY_MS}ms before retry...`);
      await sleep(RETRY_DELAY_MS);
    }
  }
  
  console.log(`❌ Pesapal: All ${retries} status fetch attempts failed for: ${orderTrackingId}`);
  return null;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    console.log("Pesapal callback received:", JSON.stringify(body, null, 2));

    const {
      OrderTrackingId,
      OrderMerchantReference,
      OrderNotificationType,
    } = body;

    // Validate required fields
    if (!OrderTrackingId || !OrderMerchantReference) {
      console.error("Missing required fields in Pesapal callback");
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Update order status in database
    const orderId = OrderMerchantReference;

    // Find the order in database
    console.log("🔍 Pesapal: Looking up order:", { orderId });
    const order = await getOrderById(orderId);

    if (!order) {
      console.error("❌ Pesapal: Order not found in database:", { orderId, searchAttempted: true });
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    console.log("✅ Pesapal: Order found:", {
      orderId: order.id,
      currentStatus: order.status,
      customerName: order.customer_name,
      totalAmount: order.total_amount || order.total,
      paymentMethod: order.payment_method,
      createdAt: order.created_at
    });

    // Fetch actual payment status from Pesapal API with retry logic
    let paymentStatus: any = null;
    console.log("🔍 Pesapal: Starting payment status fetch with retry for:", OrderTrackingId);
    
    try {
      paymentStatus = await fetchPaymentStatusWithRetry(OrderTrackingId);
      console.log("📊 Pesapal: Final status response:", JSON.stringify(paymentStatus, null, 2));
    } catch (statusError) {
      console.error("❌ Pesapal: Critical error in payment status fetch:", { 
        error: statusError, 
        orderTrackingId: OrderTrackingId,
        orderId 
      });
    }

    // Determine order status from Pesapal response
    let newStatus = "pending";
    let confirmationCode = "";
    let paymentMethod = "";

    if (paymentStatus) {
      // Pesapal status_code: 0 = INVALID, 1 = COMPLETED, 2 = FAILED, 3 = REVERSED
      // Note: status_code is numeric, payment_status_description is a string
      const statusCode = paymentStatus.status_code;
      const statusDesc = paymentStatus.payment_status_description?.toUpperCase();

      if (statusCode === 1 || statusDesc === "COMPLETED") {
        newStatus = "paid";
      } else if (statusCode === 2 || statusDesc === "FAILED") {
        newStatus = "failed";
      } else if (statusCode === 3 || statusDesc === "REVERSED") {
        newStatus = "failed";
      }

      confirmationCode = paymentStatus.confirmation_code || "";
      paymentMethod = paymentStatus.payment_method || "";

      console.log(`📊 Pesapal status: code=${statusCode}, desc=${statusDesc}, newStatus=${newStatus}`);
    } else {
      console.log("⚠️ Pesapal: No payment status received, keeping order as pending");
    }

    console.log("🔄 Pesapal: Updating order status:", {
      orderId,
      previousStatus: order.status,
      newStatus,
      orderTrackingId: OrderTrackingId,
      paymentMethod,
      confirmationCode
    });

    const updateData: any = {
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
      console.error("❌ Pesapal: Error updating order in database:", { orderId, updateData });
      return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
    }

    console.log("✅ Pesapal: Order updated successfully:", {
      orderId: updatedOrder.id,
      previousStatus: order.status,
      newStatus: updatedOrder.status,
      pesapalTrackingId: updatedOrder.pesapal_order_tracking_id,
      confirmationCode: updatedOrder.pesapal_confirmation_code
    });

    // Send email notification for successful payments
    if (newStatus === "paid") {
      console.log("📧 Pesapal: Sending payment confirmation email for order:", orderId);
      
      try {
        const getImageUrl = (imagePath: string): string => {
          if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
            return imagePath;
          }
          return `https://thestemsflowers.co.ke${imagePath.startsWith('/') ? imagePath : `/${imagePath}`}`;
        };

        const emailSubject = `✅ PAYMENT CONFIRMED - Order #${orderId.slice(0, 8)} - ${formatCurrency(order.total_amount || order.total || 0)}`;
        
        const emailHtml = `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Payment Confirmed - Order #${orderId.slice(0, 8)}</title>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .header { background: #10b981; color: white; padding: 20px; text-align: center; }
              .content { padding: 20px; background: #f9fafb; }
              .order-info { background: white; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #10b981; }
              .items-table { width: 100%; border-collapse: collapse; margin: 15px 0; background: white; }
              .items-table th, .items-table td { padding: 12px; text-align: left; border-bottom: 1px solid #e5e7eb; }
              .items-table th { background: #f3f4f6; font-weight: bold; }
              .total-row { font-weight: bold; background: #f3f4f6; }
              .payment-info { background: #ecfdf5; padding: 15px; border-radius: 8px; margin: 15px 0; }
              .action-required { background: #fef3c7; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #f59e0b; }
              .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 12px; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>✅ PAYMENT CONFIRMED</h1>
              <p>Order #${orderId.slice(0, 8)} - Ready for Processing</p>
            </div>
            
            <div class="content">
              <div class="order-info">
                <h2>📦 Order Information</h2>
                <p><strong>Order ID:</strong> ${orderId.slice(0, 8)}</p>
                <p><strong>Customer:</strong> ${order.customer_name}</p>
                <p><strong>Phone:</strong> ${order.phone}</p>
                <p><strong>Email:</strong> ${order.email || 'Not provided'}</p>
                <p><strong>Delivery Address:</strong> ${order.delivery_address}</p>
                <p><strong>Delivery Date:</strong> ${order.delivery_date}</p>
                <p><strong>Order Date:</strong> ${order.created_at}</p>
              </div>

              <div class="payment-info">
                <h2>💳 Payment Information</h2>
                <p><strong>Payment Method:</strong> ${paymentMethod || 'Pesapal'}</p>
                <p><strong>Payment Status:</strong> ✅ <strong style="color: #10b981;">PAID</strong></p>
                ${confirmationCode ? `<p><strong>Confirmation Code:</strong> <code style="background: #f3f4f6; padding: 2px 6px; border-radius: 4px;">${confirmationCode}</code></p>` : ''}
                <p><strong>Pesapal Tracking ID:</strong> <code style="background: #f3f4f6; padding: 2px 6px; border-radius: 4px;">${OrderTrackingId}</code></p>
              </div>

              <h2>🛍️ Order Items</h2>
              <table class="items-table">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Quantity</th>
                    <th>Unit Price</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${(order.items || []).map((item: any, index: number) => {
                    const imageUrl = item.image ? getImageUrl(item.image) : '';
                    const itemTotal = (item.price || 0) * (item.quantity || 1);
                    return `
                      <tr>
                        <td>
                          <strong>${item.name || 'Item'}</strong>
                          ${item.options ? `<br/><small style="color: #6b7280;">${Object.entries(item.options).map(([k, v]) => `${k}: ${v}`).join(", ")}</small>` : ''}
                          ${imageUrl ? `<br/><a href="${imageUrl}" style="color: #10b981; text-decoration: none;">📷 View Image</a>` : ''}
                        </td>
                        <td>${item.quantity || 1}</td>
                        <td>${formatCurrency(item.price || 0)}</td>
                        <td><strong>${formatCurrency(itemTotal)}</strong></td>
                      </tr>
                    `;
                  }).join('')}
                  <tr class="total-row">
                    <td colspan="3"><strong>Total Amount:</strong></td>
                    <td><strong style="color: #10b981; font-size: 18px;">${formatCurrency(order.total_amount || order.total || 0)}</strong></td>
                  </tr>
                </tbody>
              </table>

              ${order.notes ? `
                <div class="order-info">
                  <h2>📝 Order Notes</h2>
                  <p>${order.notes.replace(/\n/g, '<br>')}</p>
                </div>
              ` : ''}

              <div class="action-required">
                <h2>⚡ Action Required</h2>
                <p><strong>Please process this order immediately:</strong></p>
                <ul>
                  <li>✅ Payment has been confirmed and received</li>
                  <li>📦 Prepare items for delivery</li>
                  <li>🚚 Arrange delivery to: ${order.delivery_address}</li>
                  <li>📞 Contact customer at: ${order.phone}</li>
                </ul>
                <p><strong>Expected Delivery:</strong> ${order.delivery_date}</p>
              </div>
            </div>

            <div class="footer">
              <p>This email was sent by The Stems Flower Delivery System</p>
              <p>Order ID: ${orderId.slice(0, 8)} | Tracking ID: ${OrderTrackingId}</p>
              <p>Generated: ${new Date().toISOString()}</p>
            </div>
          </body>
          </html>
        `;

        const resend = new Resend(process.env.RESEND_API_KEY || "re_jE9T351o_6gDh55gy8PHW4LWZJENwXFKR");
        const recipientEmail = process.env.ADMIN_EMAIL || "thestemsflowers.ke@gmail.com";
        const fromEmail = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";

        console.log("📧 Pesapal: Sending email to:", recipientEmail);
        
        const emailResult = await resend.emails.send({
          from: fromEmail,
          to: recipientEmail,
          subject: emailSubject,
          html: emailHtml,
        });

        if (emailResult.error) {
          console.error('❌ Pesapal: Email sending failed:', emailResult.error);
        } else {
          console.log('✅ Pesapal: Email notification sent successfully:', {
            emailId: emailResult.data?.id,
            orderId: orderId.slice(0, 8),
            recipient: recipientEmail
          });
        }
      } catch (emailErr) {
        console.error('❌ Pesapal: Failed to send email notification:', {
          error: emailErr,
          orderId: orderId.slice(0, 8)
        });
      }
    } else {
      console.log("ℹ️ Pesapal: Not sending email - payment status is:", newStatus);
    }

    console.log(`💰 Pesapal payment ${newStatus} for order ${orderId}`);

    // Log summary for failed payments
    if (newStatus === "failed") {
      console.log("❌ Pesapal: Payment failure summary:", {
        orderId,
        customerName: order.customer_name,
        phone: order.phone,
        amount: order.total_amount || order.total,
        paymentMethod,
        failureReason: paymentStatus?.payment_status_code || 'unknown',
        orderTrackingId: OrderTrackingId
      });
    }

    return NextResponse.json({
      status: "success",
      message: "Callback processed successfully"
    });

  } catch (error: any) {
    console.error("Pesapal callback error:", error);
    return NextResponse.json(
      {
        error: "Callback processing failed",
        message: error.message,
      },
      { status: 500 }
    );
  }
}

// Handle GET requests for Pesapal redirects (optional)
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const orderTrackingId = searchParams.get("OrderTrackingId");
  const orderMerchantReference = searchParams.get("OrderMerchantReference");

  if (orderTrackingId && orderMerchantReference) {
    // Redirect to order success page and mark as pending so we can poll + WhatsApp redirect
    const redirectUrl = `/order/success?id=${orderMerchantReference}&pesapal_tracking_id=${orderTrackingId}&pending=true`;
    return NextResponse.redirect(new URL(redirectUrl, request.url));
  }

  return NextResponse.json({ error: "Invalid redirect parameters" }, { status: 400 });
}
