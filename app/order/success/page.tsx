"use client";

import { useCallback, useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { SHOP_INFO } from "@/lib/constants";
import type { Order } from "@/lib/db";
import {
  getPaidOrderWhatsAppUrl,
  redirectToWhatsApp,
  schedulePaidOrderWhatsAppRedirect,
} from "@/lib/whatsapp";
import axios from "axios";
import { useCartStore } from "@/lib/store/cart";

const WHATSAPP_REDIRECT_DELAY_MS = 5000;

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("id") || searchParams.get("orderId");
  const isPaymentPending = searchParams.get("pending") === "true";
  const pesapalTrackingId = searchParams.get("pesapal_tracking_id");
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPolling, setIsPolling] = useState(false);
  const [cartCleared, setCartCleared] = useState(false);
  const [paymentTimedOut, setPaymentTimedOut] = useState(false);
  const [whatsappRedirecting, setWhatsappRedirecting] = useState(false);
  const [redirectCountdown, setRedirectCountdown] = useState<number | null>(null);
  const { clearCart } = useCartStore();

  const clearCartIfNeeded = useCallback(() => {
    if (!cartCleared) {
      clearCart();
      sessionStorage.removeItem("pendingOrder");
      setCartCleared(true);
    }
  }, [cartCleared, clearCart]);

  const triggerWhatsAppRedirect = useCallback(
    (paidOrder: Order) => {
      if (paidOrder.status !== "paid") return;

      clearCartIfNeeded();

      const scheduled = schedulePaidOrderWhatsAppRedirect(paidOrder, {
        delayMs: WHATSAPP_REDIRECT_DELAY_MS,
        onScheduled: () => {
          setWhatsappRedirecting(true);
          setRedirectCountdown(Math.ceil(WHATSAPP_REDIRECT_DELAY_MS / 1000));
        },
      });

      if (!scheduled && paidOrder.status === "paid") {
        // Timer already ran — offer manual redirect via UI button
        setWhatsappRedirecting(false);
      }
    },
    [clearCartIfNeeded]
  );

  useEffect(() => {
    if (!whatsappRedirecting || redirectCountdown === null) return;
    if (redirectCountdown <= 0) return;

    const tick = window.setInterval(() => {
      setRedirectCountdown((prev) => (prev !== null && prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => window.clearInterval(tick);
  }, [whatsappRedirecting, redirectCountdown]);

  useEffect(() => {
    if (!orderId) {
      setIsLoading(false);
      return;
    }

    async function fetchOrder() {
      try {
        const response = await axios.get(`/api/orders/${orderId}`);
        const data = response.data as Order;
        setOrder(data);

        if (data.status === "paid") {
          triggerWhatsAppRedirect(data);
          return;
        }

        const shouldPoll =
          data.status === "pending" &&
          (isPaymentPending ||
            pesapalTrackingId ||
            data.mpesa_checkout_request_id ||
            data.pesapal_order_tracking_id);

        if (shouldPoll) {
          setIsPolling(true);
        }
      } catch (error) {
        console.error("Error fetching order:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchOrder();
  }, [orderId, isPaymentPending, pesapalTrackingId, triggerWhatsAppRedirect]);

  useEffect(() => {
    if (!orderId || !isPolling) return;

    const pollInterval = window.setInterval(async () => {
      try {
        const response = await axios.get(`/api/orders/${orderId}`);
        const updatedOrder = response.data as Order;
        setOrder(updatedOrder);

        if (updatedOrder.status === "paid") {
          setIsPolling(false);
          window.clearInterval(pollInterval);
          triggerWhatsAppRedirect(updatedOrder);
        }
      } catch (error) {
        console.error("Error polling order status:", error);
      }
    }, 3000);

    const timeout = window.setTimeout(() => {
      setIsPolling(false);
      window.clearInterval(pollInterval);
      setPaymentTimedOut(true);
    }, 120000);

    return () => {
      window.clearInterval(pollInterval);
      window.clearTimeout(timeout);
    };
  }, [orderId, isPolling, triggerWhatsAppRedirect]);

  if (isLoading) {
    return (
      <div className="py-12 bg-brand-blush min-h-screen">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-brand-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="py-12 bg-brand-blush min-h-screen">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-heading font-bold text-3xl md:text-4xl text-brand-gray-900 mb-4">
            Order Not Found
          </h1>
          <Link href="/collections" className="btn-primary inline-block">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  const whatsappUrl =
    order.status === "paid"
      ? getPaidOrderWhatsAppUrl(order)
      : `https://wa.me/${SHOP_INFO.whatsapp}?text=${encodeURIComponent(
          `Hello! I placed order ${order.id.slice(0, 8)}. Please confirm delivery details.`
        )}`;

  return (
    <div className="py-12 bg-brand-blush min-h-screen">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-brand-green rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="font-heading font-bold text-3xl md:text-4xl text-brand-gray-900 mb-2">
            {order.status === "pending" && paymentTimedOut
              ? "Payment Timed Out"
              : order.status === "pending"
              ? "Payment Pending"
              : order.status === "paid"
              ? "Order Confirmed!"
              : "Order Failed"}
          </h1>
          <p className="text-brand-gray-600">
            {order.status === "pending" && paymentTimedOut
              ? "Payment confirmation timed out. Please try using alternative payment methods below."
              : order.status === "pending" && order.mpesa_checkout_request_id
              ? "Waiting for M-Pesa payment confirmation. Please check your phone and enter your PIN."
              : order.status === "pending" && order.pesapal_order_tracking_id
              ? "Processing your card payment. Please wait while we confirm the transaction..."
              : order.status === "paid"
              ? "Thank you for your order. We'll process it shortly."
              : "Your payment could not be processed. Please try again or contact support."}
          </p>
          {isPolling && (
            <div className="mt-4 flex items-center justify-center gap-2 text-sm text-brand-gray-600">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-brand-green"></div>
              <span>Checking payment status...</span>
            </div>
          )}
          {order.status === "paid" && whatsappRedirecting && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
              <p className="text-sm text-green-800 font-medium">
                ✅ Payment confirmed — opening WhatsApp
                {redirectCountdown !== null && redirectCountdown > 0
                  ? ` in ${redirectCountdown}s…`
                  : "…"}
              </p>
              <p className="text-xs text-green-700 mt-1">
                You will be redirected to message us with your order details.
              </p>
              <button
                type="button"
                className="btn-secondary mt-3 text-sm w-full"
                onClick={() => redirectToWhatsApp(whatsappUrl)}
              >
                Open WhatsApp now
              </button>
            </div>
          )}
          {isPaymentPending && order.status === "pending" && !paymentTimedOut && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-sm text-blue-800">
                <strong>Your cart is safe:</strong> Items will remain in your cart until payment is
                confirmed.
              </p>
            </div>
          )}
          {cartCleared && !whatsappRedirecting && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
              <p className="text-sm text-green-800">
                ✅ <strong>Payment confirmed!</strong> Your order is being processed.
              </p>
            </div>
          )}
          {(order.status === "failed" || paymentTimedOut) && isPaymentPending && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
              <p className="text-sm text-yellow-800 mb-2">
                <strong>Payment didn&apos;t complete. Try these alternative methods:</strong>
              </p>
              <ul className="text-xs text-yellow-700 space-y-1 ml-4">
                <li>
                  • <strong>M-Pesa Till Number:</strong> {SHOP_INFO.mpesa.till}
                </li>
                <li>
                  • <strong>M-Pesa Paybill:</strong> {SHOP_INFO.mpesa.paybill} (Account:{" "}
                  {SHOP_INFO.mpesa.account})
                </li>
              </ul>
            </div>
          )}
        </div>

        <div className="card p-6 mb-6">
          <h2 className="font-heading font-semibold text-xl mb-4">Order Details</h2>

          <div className="space-y-3 mb-6">
            <div className="flex justify-between">
              <span className="text-brand-gray-600">Order ID:</span>
              <span className="font-medium">{order.id.slice(0, 8)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-brand-gray-600">Status:</span>
              <span
                className={`font-medium ${
                  order.status === "paid"
                    ? "text-brand-green"
                    : order.status === "pending"
                    ? "text-brand-pink"
                    : "text-brand-red"
                }`}
              >
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </span>
            </div>
            {order.mpesa_receipt_number && (
              <div className="flex justify-between">
                <span className="text-brand-gray-600">M-Pesa Receipt:</span>
                <span className="font-medium font-mono">{order.mpesa_receipt_number}</span>
              </div>
            )}
            {order.pesapal_confirmation_code && (
              <div className="flex justify-between">
                <span className="text-brand-gray-600">Confirmation Code:</span>
                <span className="font-medium font-mono">{order.pesapal_confirmation_code}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-brand-gray-600">Total:</span>
              <span className="font-semibold text-brand-green text-lg">
                {formatCurrency(order.total_amount || order.total || 0)}
              </span>
            </div>
          </div>

          <div className="border-t border-brand-gray-200 pt-4 space-y-2">
            <p className="text-brand-gray-900">
              <span className="font-semibold">Customer:</span> {order.customer_name}
            </p>
            <p className="text-brand-gray-900">
              <span className="font-semibold">Phone:</span> {order.phone}
            </p>
            <p className="text-brand-gray-900">
              <span className="font-semibold">Delivery Address:</span> {order.delivery_address}
            </p>
          </div>
        </div>

        <div className="card p-6 mb-6">
          <h2 className="font-heading font-semibold text-xl mb-4">Order Items</h2>
          <div className="space-y-2">
            {order.items.map((item, index) => (
              <div key={index} className="flex justify-between text-sm">
                <span className="text-brand-gray-700">
                  {item.quantity}x {item.name}
                </span>
                <span className="font-medium">{formatCurrency(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/collections" className="btn-outline flex-1 text-center">
            Continue Shopping
          </Link>
          {order.status !== "failed" && (
            <a
              href={whatsappUrl}
              className="btn-secondary flex-1 text-center"
              onClick={(e) => {
                if (order.status === "paid") {
                  e.preventDefault();
                  redirectToWhatsApp(whatsappUrl);
                }
              }}
            >
              {order.status === "paid" ? "Continue on WhatsApp" : "Contact via WhatsApp"}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="py-12 bg-brand-blush min-h-screen">
          <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-brand-gray-600">Loading...</p>
          </div>
        </div>
      }
    >
      <OrderSuccessContent />
    </Suspense>
  );
}
