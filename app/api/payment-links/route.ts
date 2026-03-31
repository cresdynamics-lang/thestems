import { NextRequest, NextResponse } from "next/server";
import { initiatePesapalPayment, PesapalPaymentParams } from "@/lib/pesapal";
import { generateId } from "@/lib/utils";
import { Resend } from "resend";
import { formatCurrency } from "@/lib/utils";
import { SHOP_INFO } from "@/lib/constants";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      customerName,
      customerPhone,
      customerEmail,
      amount,
      currency = "KES",
      description,
      items = [],
      notes = "",
      deliveryAddress = "To be confirmed",
      sendEmail = true
    } = body;

    console.log("💳 Creating payment link:", {
      customerName,
      customerPhone,
      amount,
      currency,
      itemCount: items.length
    });

    // Validate required fields
    if (!customerName || !customerPhone || !amount) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing required fields: customerName, customerPhone, amount",
        },
        { status: 400 }
      );
    }

    // Validate amount
    const amountNum = typeof amount === 'string' ? parseFloat(amount) : amount;
    if (isNaN(amountNum) || amountNum <= 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Amount must be greater than 0",
        },
        { status: 400 }
      );
    }

    // Generate unique order ID for payment link
    const orderId = `payment-link-${generateId()}`;
    
    // Create order description
    const orderDescription = description || 
      `Payment for ${customerName}${items.length > 0 ? ` - ${items.length} items` : ''}`;

    // Prepare billing address
    const billingAddressObj = {
      email_address: customerEmail || "",
      phone_number: customerPhone,
      country_code: "KE",
      first_name: customerName.split(" ")[0] || customerName,
      middle_name: "",
      last_name: customerName.split(" ").slice(1).join(" ") || "Customer",
      line_1: deliveryAddress,
      line_2: "",
      city: "Nairobi",
      state: "Nairobi",
      postal_code: "",
      zip_code: "",
    };

    // Get callback URL
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://thestemsflowers.co.ke";
    const callbackUrl = `${baseUrl}/api/pesapal/callback`;

    // Get IPN ID from environment variables
    const ipnId = process.env.PESAPAL_IPN_ID || "";

    const params: PesapalPaymentParams = {
      id: orderId,
      currency: currency,
      amount: amountNum,
      description: orderDescription,
      callback_url: callbackUrl,
      notification_id: ipnId,
      billing_address: billingAddressObj,
    };

    // Initiate Pesapal payment
    console.log("🔄 Initiating Pesapal payment for link...");
    const result = await initiatePesapalPayment(params);

    if (!result || !result.redirect_url) {
      throw new Error("Failed to generate payment link");
    }

    console.log("✅ Payment link generated:", {
      orderId,
      redirectUrl: result.redirect_url,
      orderTrackingId: result.order_tracking_id
    });

    // Send email with payment link if requested
    let emailResult = null;
    if (sendEmail && customerEmail) {
      try {
        // Prepare items data
        const validItems = items
          .filter(item => item.name.trim() && item.price)
          .map(item => ({
            name: item.name.trim(),
            quantity: parseInt(item.quantity) || 1,
            price: parseFloat(item.price) * 100, // Convert to cents
            slug: item.slug || null, // Add slug field
            image: item.image || null, // Add image field
          }));

        emailResult = await sendPaymentLinkEmail({
          customerName,
          customerEmail,
          customerPhone,
          amount: amountNum,
          currency,
          orderDescription,
          paymentUrl: result.redirect_url,
          orderId,
          items: validItems,
          notes,
          deliveryAddress
        });
      } catch (emailErr) {
        console.error("❌ Failed to send payment link email:", emailErr);
      }
    }

    // Send WhatsApp message with payment link
    try {
      await sendPaymentLinkWhatsApp({
        customerName,
        customerPhone,
        amount: amountNum,
        paymentUrl: result.redirect_url,
        orderId
      });
    } catch (whatsappErr) {
      console.error("❌ Failed to send WhatsApp message:", whatsappErr);
    }

    return NextResponse.json({
      success: true,
      message: "Payment link created successfully",
      data: {
        orderId,
        paymentUrl: result.redirect_url,
        orderTrackingId: result.order_tracking_id,
        merchantReference: result.merchant_reference,
        customerName,
        customerPhone,
        customerEmail,
        amount: amountNum,
        currency,
        description: orderDescription,
        items,
        notes,
        emailSent: !!emailResult,
        emailId: emailResult?.data?.id,
        createdAt: new Date().toISOString()
      }
    });

  } catch (error: any) {
    console.error("❌ Payment link creation error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        message: "Failed to create payment link",
      },
      { status: 500 }
    );
  }
}

async function sendPaymentLinkEmail(data: {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  amount: number;
  currency: string;
  orderDescription: string;
  paymentUrl: string;
  orderId: string;
  items: any[];
  notes: string;
  deliveryAddress: string;
}) {
  const { customerName, customerEmail, customerPhone, amount, currency, orderDescription, paymentUrl, orderId, items, notes, deliveryAddress } = data;

  const emailSubject = `💳 Payment Link - The Stems - ${formatCurrency(amount)}`;
  
  const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Payment Link - The Stems</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .header { background: #ec4899; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #fdf2f8; }
        .payment-info { background: white; padding: 20px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #ec4899; }
        .payment-button { background: #10b981; color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold; margin: 20px 0; }
        .payment-button:hover { background: #059669; }
        .items-table { width: 100%; border-collapse: collapse; margin: 15px 0; background: white; }
        .items-table th, .items-table td { padding: 12px; text-align: left; border-bottom: 1px solid #e5e7eb; }
        .items-table th { background: #fdf2f8; font-weight: bold; }
        .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 12px; }
        .instructions { background: #fef3c7; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #f59e0b; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>🌸 The Stems</h1>
        <p>Secure Payment Link</p>
      </div>
      
      <div class="content">
        <div class="payment-info">
          <h2>💳 Payment Request</h2>
          <p><strong>Customer:</strong> ${customerName}</p>
          <p><strong>Phone:</strong> ${customerPhone}</p>
          <p><strong>Amount:</strong> <span style="color: #ec4899; font-size: 18px; font-weight: bold;">${formatCurrency(amount)}</span></p>
          <p><strong>Description:</strong> ${orderDescription}</p>
          <p><strong>Payment ID:</strong> ${orderId.slice(0, 8)}</p>
        </div>

        ${items.length > 0 ? `
          <div class="payment-info">
            <h3>🛍️ Order Items</h3>
            <table class="items-table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Quantity</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                ${items.map((item, index) => `
                  <tr>
                    <td><strong>${item.name}</strong></td>
                    <td>${item.quantity || 1}</td>
                    <td>${formatCurrency(item.price || 0)}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        ` : ''}

        ${notes ? `
          <div class="payment-info">
            <h3>📝 Notes</h3>
            <p>${notes.replace(/\n/g, '<br>')}</p>
          </div>
        ` : ''}

        <div class="instructions">
          <h3>💡 How to Pay</h3>
          <ol>
            <li>Click the green "Pay Now" button below</li>
            <li>You'll be redirected to secure Pesapal payment page</li>
            <li>Choose payment method: M-Pesa, Card, or Mobile Money</li>
            <li>Complete payment and receive confirmation</li>
            <li>We'll process your order immediately after payment</li>
          </ol>
        </div>

        <div style="text-align: center; margin: 30px 0;">
          <a href="${paymentUrl}" class="payment-button">
            💳 Pay Now - ${formatCurrency(amount)}
          </a>
        </div>

        <div class="payment-info">
          <h3>📞 Need Help?</h3>
          <p>If you have any questions or issues with payment:</p>
          <ul>
            <li>📱 Call us: <a href="tel:${SHOP_INFO.phone}">${SHOP_INFO.phone}</a></li>
            <li>💬 WhatsApp: <a href="https://wa.me/${SHOP_INFO.whatsapp}">${SHOP_INFO.whatsapp}</a></li>
            <li>📧 Email: ${process.env.ADMIN_EMAIL || 'thestemsflowers.ke@gmail.com'}</li>
          </ul>
        </div>
      </div>

      <div class="footer">
        <p>This payment link was created by The Stems Flower Delivery</p>
        <p>Payment ID: ${orderId.slice(0, 8)} | Amount: ${formatCurrency(amount)}</p>
        <p>Generated: ${new Date().toISOString()}</p>
        <p><small>This link will expire after 24 hours. Please complete payment soon.</small></p>
      </div>
    </body>
    </html>
  `;

  const resend = new Resend(process.env.RESEND_API_KEY || "re_jE9T351o_6gDh55gy8PHW4LWZJENwXFKR");
  const fromEmail = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";

  const emailResult = await resend.emails.send({
    from: fromEmail,
    to: customerEmail,
    subject: emailSubject,
    html: emailHtml,
  });

  if (emailResult.error) {
    throw emailResult.error;
  }

  console.log("✅ Payment link email sent:", {
    emailId: emailResult.data?.id,
    customerEmail,
    orderId: orderId.slice(0, 8)
  });

  return emailResult;
}

async function sendPaymentLinkWhatsApp(data: {
  customerName: string;
  customerPhone: string;
  amount: number;
  paymentUrl: string;
  orderId: string;
}) {
  const { customerName, amount, paymentUrl, orderId } = data;

  const whatsappMessage = `🌸 *The Stems - Payment Link* 🌸

Hello ${customerName}! 

💳 *Payment Details:*
• Amount: ${formatCurrency(amount)}
• Order ID: ${orderId.slice(0, 8)}
• Status: Awaiting Payment

🔗 *Pay Now:* ${paymentUrl}

📋 *How to Pay:*
1. Click the link above
2. Choose M-Pesa, Card, or Mobile Money
3. Complete secure payment
4. Receive instant confirmation

📞 *Need Help?*
• Call: ${SHOP_INFO.phone}
• WhatsApp: ${SHOP_INFO.whatsapp}

⏰ *Note:* Payment link expires in 24 hours
Thank you for choosing The Stems! 🌺`;

  console.log("📱 WhatsApp message prepared for:", data.customerPhone);
  console.log("📱 Message length:", whatsappMessage.length, "characters");
  
  // In a real implementation, you would integrate with a WhatsApp API here
  // For now, we'll just log the message that would be sent
  console.log("📱 WhatsApp message content:", whatsappMessage);
  
  return { success: true, message: "WhatsApp message prepared" };
}
