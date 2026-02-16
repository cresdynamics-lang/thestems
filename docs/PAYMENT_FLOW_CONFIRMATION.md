# Payment flow confirmation – The Stems

This document confirms how each payment method behaves: **callback**, **email to admin**, **redirect to WhatsApp**, and **recording in the admin dashboard**.

---

## 1. M-Pesa Till Number & M-Pesa Paybill

| Step | Behaviour |
|------|-----------|
| **Callback** | No payment callback (customer pays manually via M-Pesa; you confirm via WhatsApp). |
| **Email** | Yes. When the order is created, an email is sent to the admin (`ADMIN_EMAIL`) with order details and “Customer to pay via M-Pesa”. |
| **Redirect to WhatsApp** | Yes. After creating the order, the site opens WhatsApp with the order summary so the customer can send it to you. Then the user is redirected to the order success page. |
| **Admin dashboard** | Yes. The order is saved in the database and appears in **Admin → Orders**. |

---

## 2. M-Pesa STK and Card Payments (Pesapal)

| Step | Behaviour |
|------|-----------|
| **Callback** | Yes. Pesapal calls `POST /api/pesapal/callback` when payment status changes. The server waits for this callback and updates the order status (e.g. to `paid`). |
| **Email** | Yes. When the callback reports `status === "paid"`, an email is sent to the admin with order and payment confirmation. |
| **Redirect to WhatsApp** | Yes. On the order success page, after payment is confirmed (polling sees `paid`), the page waits 15 seconds then opens WhatsApp with “I just completed payment for order #…” so the customer can message you. |
| **Admin dashboard** | Yes. The order is created when checkout starts and is updated when the callback arrives. It appears in **Admin → Orders** with the correct status. |

---

## Summary

- **Callback:** Only for Pesapal (M-Pesa STK and Card). Till/Paybill have no payment callback.
- **Email:** All orders trigger an email to admin – Till/Paybill when the order is created; Pesapal when the callback reports `paid`.
- **WhatsApp:** All methods open WhatsApp – Till/Paybill right after order creation with the order summary; Pesapal after payment is confirmed on the success page (with a short delay).
- **Admin dashboard:** Every order (Till, Paybill, Pesapal) is stored and listed in **Admin → Orders**.

---

*Last updated: Feb 2026*
