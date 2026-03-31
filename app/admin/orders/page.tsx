"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import type { Order } from "@/lib/db";

export default function AdminOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      router.push("/admin/login");
      return;
    }

    async function fetchOrders() {
      try {
        const response = await axios.get(`/api/admin/orders?status=${filter === "all" ? "" : filter}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setOrders(response.data);
      } catch (error: any) {
        if (error.response?.status === 401) {
          localStorage.removeItem("admin_token");
          router.push("/admin/login");
        }
      } finally {
        setIsLoading(false);
      }
    }

    fetchOrders();
  }, [router, filter]);

  const sendOrderEmail = async (orderId: string) => {
    try {
      console.log("📧 Sending email for order:", orderId);
      
      const response = await fetch("/api/bulk-order-emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sendAllPaid: false,
          orderIds: [orderId],
          status: "paid"
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        alert(`✅ Email sent successfully for order #${orderId.slice(0, 8)}!`);
      } else {
        alert(`❌ Failed to send email: ${result.message}`);
      }
    } catch (error: any) {
      console.error("Error sending order email:", error);
      alert(`❌ Error sending email: ${error.message}`);
    }
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    const token = localStorage.getItem("admin_token");
    try {
      await axios.put(
        `/api/admin/orders/${orderId}`,
        { status },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setOrders(orders.map((o) => (o.id === orderId ? { ...o, status: status as any } : o)));
    } catch (error) {
      alert("Failed to update order status");
    }
  };

  const viewOrderDetails = (order: Order) => {
    setSelectedOrder(order);
    setShowOrderDetails(true);
  };

  const exportCSV = () => {
    const headers = ["ID", "Customer", "Phone", "Email", "Total", "Status", "Payment Method", "Date"];
    const rows = orders.map((order) => [
      order.id.slice(0, 8),
      order.customer_name,
      order.phone,
      order.email || "",
      formatCurrency(order.total_amount || order.total || 0),
      order.status,
      order.payment_method,
      formatDateTime(order.created_at),
    ]);

    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `orders-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-brand-gray-600">Loading orders...</div>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link href="/admin" className="text-brand-gray-600 hover:text-brand-green text-sm">
            ← Dashboard
          </Link>
          <h1 className="font-heading font-bold text-xl md:text-2xl text-brand-gray-900">
            Orders
          </h1>
        </div>
        <button type="button" onClick={exportCSV} className="btn-outline text-sm">
          Export CSV
        </button>
      </div>
      <div className="mb-4 flex gap-2 flex-wrap">
          {["all", "pending", "paid", "failed", "shipped", "delivered"].map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === status
                  ? "bg-brand-green text-white"
                  : "bg-white text-brand-gray-900 border-2 border-brand-gray-200 hover:border-brand-green"
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

      <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-brand-gray-200">
              <thead className="bg-brand-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-brand-gray-500 uppercase">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-brand-gray-500 uppercase">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-brand-gray-500 uppercase">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-brand-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-brand-gray-500 uppercase">
                    Payment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-brand-gray-500 uppercase">
                    Date
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-brand-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-brand-gray-200">
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-brand-gray-500">
                      No orders found
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr key={order.id} className="hover:bg-brand-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-brand-gray-600">
                        {order.id.slice(0, 8)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-brand-gray-900">
                          {order.customer_name}
                        </div>
                        <div className="text-sm text-brand-gray-500">{order.phone}</div>
                        {order.email && (
                          <div className="text-xs text-brand-gray-400">{order.email}</div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-brand-green">
                          {formatCurrency(order.total_amount || order.total || 0)}
                        </div>
                        <div className="text-xs text-brand-gray-500">
                          {(order.items || []).length} items
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded ${
                            order.status === "paid"
                              ? "bg-brand-green/10 text-brand-green"
                              : order.status === "pending"
                              ? "bg-brand-pink/10 text-brand-pink"
                              : order.status === "failed"
                              ? "bg-brand-red/10 text-brand-red"
                              : order.status === "shipped"
                              ? "bg-brand-blue/10 text-brand-blue"
                              : order.status === "delivered"
                              ? "bg-brand-green/20 text-brand-green"
                              : "bg-brand-gray-100 text-brand-gray-600"
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-brand-gray-600 capitalize">
                          {order.payment_method}
                        </div>
                        {order.mpesa_receipt_number && (
                          <div className="text-xs text-brand-gray-500 font-mono">
                            M-Pesa: {order.mpesa_receipt_number}
                          </div>
                        )}
                        {order.pesapal_confirmation_code && (
                          <div className="text-xs text-brand-gray-500 font-mono">
                            Pesapal: {order.pesapal_confirmation_code}
                          </div>
                        )}
                        {order.pesapal_order_tracking_id && (
                          <div className="text-xs text-brand-gray-400 font-mono">
                            Track: {order.pesapal_order_tracking_id.slice(0, 12)}...
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-brand-gray-600">
                        {formatDateTime(order.created_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm space-x-2">
                        <button
                          type="button"
                          onClick={() => viewOrderDetails(order)}
                          className="text-brand-blue hover:text-brand-blue/80"
                        >
                          View Details
                        </button>
                        {order.status === "pending" && (
                          <>
                            <button
                              type="button"
                              onClick={() => updateOrderStatus(order.id, "paid")}
                              className="text-brand-green hover:text-brand-green/80"
                            >
                              Mark Paid
                            </button>
                            <button
                              type="button"
                              onClick={() => updateOrderStatus(order.id, "failed")}
                              className="text-brand-red hover:text-brand-red/80"
                            >
                              Mark Failed
                            </button>
                          </>
                        )}
                        {order.status === "paid" && (
                          <button
                            type="button"
                            onClick={() => updateOrderStatus(order.id, "shipped")}
                            className="text-brand-green hover:text-brand-green/80"
                          >
                            Mark Shipped
                          </button>
                        )}
                        {order.status === "shipped" && (
                          <button
                            type="button"
                            onClick={() => updateOrderStatus(order.id, "delivered")}
                            className="text-brand-blue hover:text-brand-blue/80"
                          >
                            Mark Delivered
                          </button>
                        )}
                        {(order.status === "paid" || order.status === "shipped") && (
                          <button
                            type="button"
                            onClick={() => sendOrderEmail(order.id)}
                            className="text-brand-pink hover:text-brand-pink/80"
                          >
                            Send Email
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
      </div>

      {/* Order Details Modal */}
      {showOrderDetails && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Order Details - #{selectedOrder.id.slice(0, 8)}</h2>
                <button
                  type="button"
                  onClick={() => setShowOrderDetails(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="font-semibold mb-2">Customer Information</h3>
                  <p className="text-sm"><strong>Name:</strong> {selectedOrder.customer_name}</p>
                  <p className="text-sm"><strong>Phone:</strong> {selectedOrder.phone}</p>
                  {selectedOrder.email && (
                    <p className="text-sm"><strong>Email:</strong> {selectedOrder.email}</p>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Delivery Information</h3>
                  <p className="text-sm"><strong>Address:</strong> {selectedOrder.delivery_address}</p>
                  <p className="text-sm"><strong>Date:</strong> {formatDateTime(selectedOrder.delivery_date)}</p>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold mb-2">Order Items</h3>
                <div className="border rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Item</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Qty</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {(selectedOrder.items || []).map((item, index) => {
                    const itemTotal = (item.price || 0) * (item.quantity || 1);
                    const productUrl = item.slug ? `/product/${item.slug}` : '#';
                    const imageUrl = item.image ? item.image.startsWith('http') ? item.image : `https://thestemsflowers.co.ke${item.image.startsWith('/') ? item.image : `/${item.image}`}` : null;
                    return (
                      <tr key={index}>
                        <td className="px-4 py-2 text-sm">
                          <div className="flex items-center gap-3">
                            {imageUrl && (
                              <div className="w-12 h-12 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                                <img 
                                  src={imageUrl} 
                                  alt={item.name || 'Item'} 
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                  }}
                                />
                              </div>
                            )}
                            <div className="flex-1">
                              {item.slug ? (
                                <div>
                                  <a 
                                    href={productUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-brand-green hover:text-brand-green/80 font-medium underline flex items-center gap-1"
                                  >
                                    {item.name || 'Item'} 🔗
                                  </a>
                                  {item.options && (
                                    <div className="text-xs text-gray-500 mt-1">
                                      {Object.entries(item.options).map(([k, v]) => `${k}: ${v}`).join(", ")}
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <div>
                                  <strong>{item.name || 'Item'}</strong>
                                  {item.options && (
                                    <div className="text-xs text-gray-500 mt-1">
                                      {Object.entries(item.options).map(([k, v]) => `${k}: ${v}`).join(", ")}
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-2 text-sm">{item.quantity}</td>
                        <td className="px-4 py-2 text-sm">{formatCurrency(item.price)}</td>
                        <td className="px-4 py-2 text-sm font-medium">
                          {formatCurrency(itemTotal)}
                        </td>
                      </tr>
                    );
                  })}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold mb-2">Payment Information</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p><strong>Method:</strong> {selectedOrder.payment_method}</p>
                    <p><strong>Status:</strong> 
                      <span className={`ml-2 px-2 py-1 text-xs font-medium rounded ${
                        selectedOrder.status === "paid"
                          ? "bg-green-100 text-green-800"
                          : selectedOrder.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : selectedOrder.status === "failed"
                          ? "bg-red-100 text-red-800"
                          : selectedOrder.status === "shipped"
                          ? "bg-blue-100 text-blue-800"
                          : selectedOrder.status === "delivered"
                          ? "bg-green-200 text-green-900"
                          : "bg-gray-100 text-gray-800"
                      }`}>
                        {selectedOrder.status}
                      </span>
                    </p>
                  </div>
                  <div>
                    <p><strong>Total Amount:</strong> {formatCurrency(selectedOrder.total_amount || selectedOrder.total || 0)}</p>
                    {selectedOrder.mpesa_receipt_number && (
                      <p><strong>M-Pesa Receipt:</strong> {selectedOrder.mpesa_receipt_number}</p>
                    )}
                    {selectedOrder.pesapal_confirmation_code && (
                      <p><strong>Pesapal Confirmation:</strong> {selectedOrder.pesapal_confirmation_code}</p>
                    )}
                  </div>
                </div>
              </div>

              {selectedOrder.notes && (
                <div className="mb-6">
                  <h3 className="font-semibold mb-2">Order Notes</h3>
                  <p className="text-sm text-gray-600">{selectedOrder.notes}</p>
                </div>
              )}

              <div className="mb-6">
                <h3 className="font-semibold mb-2">Order Timeline</h3>
                <div className="space-y-2 text-sm">
                  <p><strong>Created:</strong> {formatDateTime(selectedOrder.created_at)}</p>
                  {selectedOrder.paid_at && (
                    <p><strong>Paid:</strong> {formatDateTime(selectedOrder.paid_at)}</p>
                  )}
                  {selectedOrder.shipped_at && (
                    <p><strong>Shipped:</strong> {formatDateTime(selectedOrder.shipped_at)}</p>
                  )}
                  {selectedOrder.delivered_at && (
                    <p><strong>Delivered:</strong> {formatDateTime(selectedOrder.delivered_at)}</p>
                  )}
                  <p><strong>Last Updated:</strong> {formatDateTime(selectedOrder.updated_at)}</p>
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                {selectedOrder.status === "pending" && (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        updateOrderStatus(selectedOrder.id, "paid");
                        setShowOrderDetails(false);
                      }}
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                    >
                      Mark as Paid
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        updateOrderStatus(selectedOrder.id, "failed");
                        setShowOrderDetails(false);
                      }}
                      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                    >
                      Mark as Failed
                    </button>
                  </>
                )}
                {selectedOrder.status === "paid" && (
                  <button
                    type="button"
                    onClick={() => {
                      updateOrderStatus(selectedOrder.id, "shipped");
                      setShowOrderDetails(false);
                    }}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                  >
                    Mark as Shipped
                  </button>
                )}
                {selectedOrder.status === "shipped" && (
                  <button
                    type="button"
                    onClick={() => {
                      updateOrderStatus(selectedOrder.id, "delivered");
                      setShowOrderDetails(false);
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Mark as Delivered
                  </button>
                )}
                {(selectedOrder.status === "paid" || selectedOrder.status === "shipped") && (
                  <button
                    type="button"
                    onClick={() => {
                      sendOrderEmail(selectedOrder.id);
                    }}
                    className="px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700"
                  >
                    Send Email
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setShowOrderDetails(false)}
                  className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

