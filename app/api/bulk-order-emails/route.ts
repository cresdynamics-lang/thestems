import { NextRequest, NextResponse } from "next/server";
import { getOrders, updateOrder } from "@/lib/db";
import { Resend } from "resend";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { SHOP_INFO } from "@/lib/constants";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      sendAllPaid = false, 
      orderIds = [], 
      dateRange = null,
      minAmount = null,
      status = "paid" 
    } = body;

    console.log("📧 Processing bulk order email request:", {
      sendAllPaid,
      orderIds: orderIds.length,
      dateRange,
      minAmount,
      status
    });

    // Get orders based on criteria
    let orders = [];
    
    if (sendAllPaid) {
      // Get all paid orders
      orders = await getOrders({ status });
    } else if (orderIds.length > 0) {
      // Get all orders and filter by IDs
      const allOrders = await getOrders({ status });
      orders = allOrders.filter(order => orderIds.includes(order.id));
    } else {
      return NextResponse.json({
        success: false,
        message: "Please specify either sendAllPaid=true or provide orderIds array"
      }, { status: 400 });
    }

    // Filter orders by criteria
    if (dateRange) {
      const { start, end } = dateRange;
      orders = orders.filter(order => {
        const orderDate = new Date(order.created_at);
        return orderDate >= new Date(start) && orderDate <= new Date(end);
      });
    }

    if (minAmount) {
      orders = orders.filter(order => 
        (order.total_amount || order.total || 0) >= minAmount
      );
    }

    if (orders.length === 0) {
      return NextResponse.json({
        success: false,
        message: "No orders found matching the criteria"
      }, { status: 404 });
    }

    console.log(`📦 Found ${orders.length} orders to process`);

    // Send emails for each order
    const emailResults = [];
    let successCount = 0;
    let errorCount = 0;

    for (const order of orders) {
      try {
        console.log(`📧 Sending email for order: ${order.id.slice(0, 8)}`);
        
        const emailResult = await sendOrderDetailsEmail(order);
        emailResults.push({
          orderId: order.id,
          success: true,
          emailId: emailResult.data?.id,
          customerName: order.customer_name,
          total: formatCurrency(order.total_amount || order.total || 0)
        });
        
        // Mark order as email sent (you could add a field to track this)
        // await updateOrder(order.id, { email_sent_at: new Date().toISOString() });
        
        successCount++;
      } catch (error: any) {
        console.error(`❌ Failed to send email for order ${order.id}:`, error);
        emailResults.push({
          orderId: order.id,
          success: false,
          error: error.message,
          customerName: order.customer_name
        });
        errorCount++;
      }
    }

    return NextResponse.json({
      success: true,
      message: `Processed ${orders.length} orders. ${successCount} emails sent successfully, ${errorCount} failed.`,
      summary: {
        totalOrders: orders.length,
        successCount,
        errorCount,
        totalRevenue: orders.reduce((sum, order) => sum + (order.total_amount || order.total || 0), 0)
      },
      orders: emailResults
    });

  } catch (error: any) {
    console.error("❌ Bulk email processing error:", error);
    return NextResponse.json({
      success: false,
      error: error.message,
      message: "Failed to process bulk email request"
    }, { status: 500 });
  }
}

async function sendOrderDetailsEmail(order: any) {
  const getImageUrl = (imagePath: string): string => {
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    return `https://thestemsflowers.co.ke${imagePath.startsWith('/') ? imagePath : `/${imagePath}`}`;
  };

  const emailSubject = `📦 PAID ORDER - Order #${order.id.slice(0, 8)} - ${formatCurrency(order.total_amount || order.total || 0)}`;
  
  const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Paid Order - #${order.id.slice(0, 8)}</title>
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
        .bulk-indicator { background: #3b82f6; color: white; padding: 8px 12px; border-radius: 4px; font-size: 12px; font-weight: bold; display: inline-block; margin-bottom: 10px; }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="bulk-indicator">📧 BULK EMAIL PROCESSING</div>
        <h1>✅ PAID ORDER - READY FOR PROCESSING</h1>
        <p>Order #${order.id.slice(0, 8)} - Payment Confirmed</p>
      </div>
      
      <div class="content">
        <div class="order-info">
          <h2>📦 Order Information</h2>
          <p><strong>Order ID:</strong> ${order.id.slice(0, 8)}</p>
          <p><strong>Customer:</strong> ${order.customer_name}</p>
          <p><strong>Phone:</strong> ${order.phone}</p>
          <p><strong>Email:</strong> ${order.email || 'Not provided'}</p>
          <p><strong>Delivery Address:</strong> ${order.delivery_address}</p>
          <p><strong>Delivery Date:</strong> ${formatDateTime(order.delivery_date)}</p>
          <p><strong>Order Date:</strong> ${formatDateTime(order.created_at)}</p>
        </div>

        <div class="payment-info">
          <h2>💳 Payment Information</h2>
          <p><strong>Payment Method:</strong> ${order.payment_method}</p>
          <p><strong>Payment Status:</strong> ✅ <strong style="color: #10b981;">PAID</strong></p>
          ${order.mpesa_receipt_number ? `<p><strong>M-Pesa Receipt:</strong> <code style="background: #f3f4f6; padding: 2px 6px; border-radius: 4px;">${order.mpesa_receipt_number}</code></p>` : ''}
          ${order.pesapal_confirmation_code ? `<p><strong>Pesapal Confirmation:</strong> <code style="background: #f3f4f6; padding: 2px 6px; border-radius: 4px;">${order.pesapal_confirmation_code}</code></p>` : ''}
          ${order.pesapal_order_tracking_id ? `<p><strong>Pesapal Tracking ID:</strong> <code style="background: #f3f4f6; padding: 2px 6px; border-radius: 4px;">${order.pesapal_order_tracking_id}</code></p>` : ''}
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
                    ${item.slug ? `<br/><small style="color: #10b981;"><a href="https://thestemsflowers.co.ke/product/${item.slug}" target="_blank">🔗 View Product</a></small>` : ''}
                    ${imageUrl ? `<br/><small><a href="${imageUrl}" style="color: #10b981; text-decoration: none;">📷 View Image</a></small>` : ''}
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
          <h2>⚡ Action Required - Process This Order</h2>
          <p><strong>This order has been paid and is ready for processing:</strong></p>
          <ul>
            <li>✅ Payment confirmed and received</li>
            <li>📦 Prepare items for delivery</li>
            <li>🚚 Arrange delivery to: ${order.delivery_address}</li>
            <li>📞 Contact customer at: ${order.phone}</li>
            <li>🔄 Update order status to "Shipped" when sent</li>
          </ul>
          <p><strong>Expected Delivery:</strong> ${formatDateTime(order.delivery_date)}</p>
        </div>

        <div class="order-info" style="background: #dbeafe; border-left-color: #3b82f6;">
          <h2>📧 Email Information</h2>
          <p><strong>Email Type:</strong> Bulk Processing</p>
          <p><strong>Sent at:</strong> ${formatDateTime(new Date().toISOString())}</p>
          <p><strong>Processing ID:</strong> ${Math.random().toString(36).substring(2, 15)}</p>
        </div>
      </div>

      <div class="footer">
        <p>This email was sent by The Stems Flower Delivery System - Bulk Processing</p>
        <p>Order ID: ${order.id.slice(0, 8)} | Status: ${order.status}</p>
        <p>Generated: ${new Date().toISOString()}</p>
        <p style="color: #3b82f6; font-weight: bold;">📧 BULK EMAIL - Process this order immediately</p>
      </div>
    </body>
    </html>
  `;

  const resend = new Resend(process.env.RESEND_API_KEY || "re_jE9T351o_6gDh55gy8PHW4LWZJENwXFKR");
  const recipientEmail = process.env.ADMIN_EMAIL || "thestemsflowers.ke@gmail.com";
  const fromEmail = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";

  console.log("📧 Sending bulk order email to:", recipientEmail);
  
  const emailResult = await resend.emails.send({
    from: fromEmail,
    to: recipientEmail,
    subject: emailSubject,
    html: emailHtml,
  });

  if (emailResult.error) {
    throw emailResult.error;
  }

  console.log('✅ Bulk order email sent successfully:', {
    emailId: emailResult.data?.id,
    orderId: order.id.slice(0, 8),
    recipient: recipientEmail
  });

  return emailResult;
}
