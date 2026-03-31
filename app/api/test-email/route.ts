import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { SHOP_INFO } from "@/lib/constants";

export async function POST(request: NextRequest) {
  try {
    console.log("📧 Sending test order email...");

    // Sample order data for testing
    const testOrder = {
      id: "test-order-12345678",
      customer_name: "Test Customer",
      phone: "+254712345678",
      email: "test@example.com",
      delivery_address: "123 Test Street, Nairobi, Kenya",
      delivery_date: new Date().toISOString(),
      created_at: new Date().toISOString(),
      total_amount: 5500, // 55.00 USD in cents
      payment_method: "card",
      status: "paid",
      pesapal_order_tracking_id: "TEST-TRACKING-123",
      pesapal_confirmation_code: "TEST-CONF-456",
      pesapal_payment_method: "Card",
      items: [
        {
          name: "Beautiful Red Roses Bouquet",
          quantity: 2,
          price: 2500, // 25.00 USD in cents
          image: "/images/roses.jpg",
          slug: "red-roses-bouquet",
          options: {
            size: "Large",
            color: "Red"
          }
        },
        {
          name: "Chocolate Gift Box",
          quantity: 1,
          price: 500, // 5.00 USD in cents
          image: "/images/chocolates.jpg",
          slug: "chocolate-gift-box",
          options: {}
        }
      ],
      notes: "Special delivery instructions: Please deliver after 5 PM"
    };

    const getImageUrl = (imagePath: string): string => {
      if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
        return imagePath;
      }
      return `https://thestemsflowers.co.ke${imagePath.startsWith('/') ? imagePath : `/${imagePath}`}`;
    };

    const emailSubject = `✅ PAYMENT CONFIRMED - Order #${testOrder.id.slice(0, 8)} - ${formatCurrency(testOrder.total_amount)}`;
    
    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Test Payment Confirmed - Order #${testOrder.id.slice(0, 8)}</title>
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
          .test-banner { background: #3b82f6; color: white; padding: 10px; text-align: center; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="test-banner">
          📧 THIS IS A TEST EMAIL - Order Confirmation System Test
        </div>
        
        <div class="header">
          <h1>✅ PAYMENT CONFIRMED</h1>
          <p>Order #${testOrder.id.slice(0, 8)} - Ready for Processing</p>
        </div>
        
        <div class="content">
          <div class="order-info">
            <h2>📦 Order Information</h2>
            <p><strong>Order ID:</strong> ${testOrder.id.slice(0, 8)}</p>
            <p><strong>Customer:</strong> ${testOrder.customer_name}</p>
            <p><strong>Phone:</strong> ${testOrder.phone}</p>
            <p><strong>Email:</strong> ${testOrder.email}</p>
            <p><strong>Delivery Address:</strong> ${testOrder.delivery_address}</p>
            <p><strong>Delivery Date:</strong> ${formatDateTime(testOrder.delivery_date)}</p>
            <p><strong>Order Date:</strong> ${formatDateTime(testOrder.created_at)}</p>
          </div>

          <div class="payment-info">
            <h2>💳 Payment Information</h2>
            <p><strong>Payment Method:</strong> ${testOrder.pesapal_payment_method}</p>
            <p><strong>Payment Status:</strong> ✅ <strong style="color: #10b981;">PAID</strong></p>
            <p><strong>Confirmation Code:</strong> <code style="background: #f3f4f6; padding: 2px 6px; border-radius: 4px;">${testOrder.pesapal_confirmation_code}</code></p>
            <p><strong>Pesapal Tracking ID:</strong> <code style="background: #f3f4f6; padding: 2px 6px; border-radius: 4px;">${testOrder.pesapal_order_tracking_id}</code></p>
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
              ${testOrder.items.map((item, index) => {
                const imageUrl = item.image ? getImageUrl(item.image) : '';
                const itemTotal = item.price * item.quantity;
                return `
                  <tr>
                    <td>
                      <strong>${item.name}</strong>
                      ${item.options && Object.keys(item.options).length > 0 ? `<br/><small style="color: #6b7280;">${Object.entries(item.options).map(([k, v]) => `${k}: ${v}`).join(", ")}</small>` : ''}
                      ${imageUrl ? `<br/><a href="${imageUrl}" style="color: #10b981; text-decoration: none;">📷 View Image</a>` : ''}
                    </td>
                    <td>${item.quantity}</td>
                    <td>${formatCurrency(item.price)}</td>
                    <td><strong>${formatCurrency(itemTotal)}</strong></td>
                  </tr>
                `;
              }).join('')}
              <tr class="total-row">
                <td colspan="3"><strong>Total Amount:</strong></td>
                <td><strong style="color: #10b981; font-size: 18px;">${formatCurrency(testOrder.total_amount)}</strong></td>
              </tr>
            </tbody>
          </table>

          ${testOrder.notes ? `
            <div class="order-info">
              <h2>📝 Order Notes</h2>
              <p>${testOrder.notes.replace(/\n/g, '<br>')}</p>
            </div>
          ` : ''}

          <div class="action-required">
            <h2>⚡ Action Required</h2>
            <p><strong>Please process this order immediately:</strong></p>
            <ul>
              <li>✅ Payment has been confirmed and received</li>
              <li>📦 Prepare items for delivery</li>
              <li>🚚 Arrange delivery to: ${testOrder.delivery_address}</li>
              <li>📞 Contact customer at: ${testOrder.phone}</li>
            </ul>
            <p><strong>Expected Delivery:</strong> ${formatDateTime(testOrder.delivery_date)}</p>
          </div>

          <div class="order-info" style="background: #dbeafe; border-left-color: #3b82f6;">
            <h2>🧪 Test Information</h2>
            <p><strong>Test Email Sent:</strong> ${new Date().toISOString()}</p>
            <p><strong>Email System:</strong> Resend API</p>
            <p><strong>Template Version:</strong> Enhanced HTML Template v2.0</p>
            <p><strong>Features Tested:</strong> Order details, payment confirmation, item list, styling</p>
          </div>
        </div>

        <div class="footer">
          <p>This is a TEST email sent by The Stems Flower Delivery System</p>
          <p>Order ID: ${testOrder.id.slice(0, 8)} | Tracking ID: ${testOrder.pesapal_order_tracking_id}</p>
          <p>Generated: ${new Date().toISOString()}</p>
          <p style="color: #3b82f6; font-weight: bold;">📧 TEST MODE - No action required</p>
        </div>
      </body>
      </html>
    `;

    // Send email using Resend
    const resend = new Resend(process.env.RESEND_API_KEY || "re_jE9T351o_6gDh55gy8PHW4LWZJENwXFKR");
    const recipientEmail = process.env.ADMIN_EMAIL || "thestemsflowers.ke@gmail.com";
    const fromEmail = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";

    console.log("📧 Sending test email to:", recipientEmail);
    
    const emailResult = await resend.emails.send({
      from: fromEmail,
      to: recipientEmail,
      subject: `📧 TEST: ${emailSubject}`,
      html: emailHtml,
    });

    if (emailResult.error) {
      console.error('❌ Test email sending failed:', emailResult.error);
      return NextResponse.json({
        success: false,
        error: emailResult.error,
        message: "Failed to send test email"
      }, { status: 500 });
    }

    console.log('✅ Test email sent successfully:', {
      emailId: emailResult.data?.id,
      orderId: testOrder.id.slice(0, 8),
      recipient: recipientEmail
    });

    return NextResponse.json({
      success: true,
      message: "Test email sent successfully!",
      data: {
        emailId: emailResult.data?.id,
        testOrder: {
          id: testOrder.id.slice(0, 8),
          customer: testOrder.customer_name,
          total: formatCurrency(testOrder.total_amount),
          itemCount: testOrder.items.length
        },
        recipient: recipientEmail,
        sentAt: new Date().toISOString()
      }
    });

  } catch (error: any) {
    console.error('❌ Test email error:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      message: "Failed to send test email"
    }, { status: 500 });
  }
}
