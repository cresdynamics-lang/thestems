"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { formatCurrency, formatDateTime, formatPhone, generateId } from "@/lib/utils";
import { SHOP_INFO } from "@/lib/constants";

interface PaymentLink {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  amount: number;
  currency: string;
  description: string;
  paymentUrl: string;
  orderTrackingId?: string;
  merchantReference?: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  notes?: string;
  status: "pending" | "paid" | "expired";
  emailSent: boolean;
  createdAt: string;
  expiresAt: string;
}

export default function PaymentLinksPage() {
  const router = useRouter();
  const [links, setLinks] = useState<PaymentLink[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Form state
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [notes, setNotes] = useState("");
  const [sendEmail, setSendEmail] = useState(true);
  const [items, setItems] = useState<Array<{ name: string; quantity: string; price: string }>>([
    { name: "", quantity: "1", price: "" }
  ]);

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      router.push("/admin/login");
      return;
    }

    fetchPaymentLinks();
  }, [router]);

  const fetchPaymentLinks = async () => {
    try {
      // For now, we'll simulate data since we don't have a dedicated endpoint yet
      // In a real implementation, you'd fetch from an API endpoint
      setLinks([]);
    } catch (error) {
      console.error("Error fetching payment links:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const addItem = () => {
    setItems([...items, { name: "", quantity: "1", price: "" }]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: string, value: string) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const calculateTotal = () => {
    return items.reduce((total, item) => {
      const price = parseFloat(item.price) || 0;
      const quantity = parseInt(item.quantity) || 0;
      return total + (price * quantity);
    }, 0);
  };

  const createPaymentLink = async () => {
    setError("");
    setSuccess("");
    setIsCreating(true);

    try {
      // Validate form
      if (!customerName.trim() || !customerPhone.trim()) {
        setError("Customer name and phone are required");
        setIsCreating(false);
        return;
      }

      const finalAmount = parseFloat(amount) || calculateTotal();
      if (finalAmount <= 0) {
        setError("Amount must be greater than 0");
        setIsCreating(false);
        return;
      }

      // Prepare items data
      const validItems = items
        .filter(item => item.name.trim() && item.price)
        .map(item => ({
          name: item.name.trim(),
          quantity: parseInt(item.quantity) || 1,
          price: parseFloat(item.price) * 100 // Convert to cents
        }));

      const linkData = {
        customerName: customerName.trim(),
        customerPhone: formatPhone(customerPhone),
        customerEmail: customerEmail.trim() || null,
        amount: finalAmount * 100, // Convert to cents
        currency: "KES",
        description: description.trim() || `Payment for ${customerName.trim()}`,
        items: validItems,
        notes: notes.trim() || "",
        sendEmail: sendEmail && customerEmail.trim() !== ""
      };

      console.log("🔄 Creating payment link:", linkData);

      const response = await axios.post("/api/payment-links", linkData);

      if (response.data.success) {
        setSuccess("Payment link created successfully!");
        setShowCreateForm(false);
        
        // Reset form
        setCustomerName("");
        setCustomerPhone("");
        setCustomerEmail("");
        setAmount("");
        setDescription("");
        setNotes("");
        setSendEmail(true);
        setItems([{ name: "", quantity: "1", price: "" }]);

        // Copy payment URL to clipboard
        if (response.data.data.paymentUrl) {
          navigator.clipboard.writeText(response.data.data.paymentUrl);
          setSuccess(prev => prev + " Payment link copied to clipboard!");
        }

        // Refresh links list
        fetchPaymentLinks();
      } else {
        setError(response.data.message || "Failed to create payment link");
      }
    } catch (error: any) {
      console.error("Error creating payment link:", error);
      setError(error.response?.data?.message || error.message || "Failed to create payment link");
    } finally {
      setIsCreating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-brand-gray-600">Loading payment links...</div>
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
            Payment Links
          </h1>
        </div>
        <button
          type="button"
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="btn-primary"
        >
          {showCreateForm ? "Cancel" : "Create Payment Link"}
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-brand-red/10 border border-brand-red rounded-md text-brand-red text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-brand-green/10 border border-brand-green rounded-md text-brand-green text-sm">
          {success}
        </div>
      )}

      {showCreateForm && (
        <div className="card mb-6">
          <h2 className="font-heading font-semibold text-xl mb-6">Create Payment Link</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Customer Information */}
            <div>
              <h3 className="font-semibold mb-4">Customer Information</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-brand-gray-700 mb-1">
                    Customer Name *
                  </label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3 py-2 border border-brand-gray-200 rounded-md focus:ring-brand-green focus:border-brand-green"
                    placeholder="Enter customer name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-brand-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full px-3 py-2 border border-brand-gray-200 rounded-md focus:ring-brand-green focus:border-brand-green"
                    placeholder="07xxxxxxxx or 2547xxxxxxxx"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-brand-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-brand-gray-200 rounded-md focus:ring-brand-green focus:border-brand-green"
                    placeholder="customer@example.com"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="sendEmail"
                    checked={sendEmail}
                    onChange={(e) => setSendEmail(e.target.checked)}
                    className="w-4 h-4 text-brand-green focus:ring-brand-green"
                  />
                  <label htmlFor="sendEmail" className="ml-2 text-sm text-brand-gray-700">
                    Send payment link via email
                  </label>
                </div>
              </div>
            </div>

            {/* Order Details */}
            <div>
              <h3 className="font-semibold mb-4">Order Details</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-brand-gray-700 mb-1">
                    Amount (Ksh) *
                  </label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full px-3 py-2 border border-brand-gray-200 rounded-md focus:ring-brand-green focus:border-brand-green"
                    placeholder="Enter amount or add items below"
                  />
                  <p className="text-xs text-brand-gray-500 mt-1">
                    Or add items below to calculate total
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-brand-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3 py-2 border border-brand-gray-200 rounded-md focus:ring-brand-green focus:border-brand-green"
                    rows={2}
                    placeholder="Order description (optional)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-brand-gray-700 mb-1">
                    Notes
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-3 py-2 border border-brand-gray-200 rounded-md focus:ring-brand-green focus:border-brand-green"
                    rows={2}
                    placeholder="Additional notes (optional)"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Items Section */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Order Items (Optional)</h3>
              <button
                type="button"
                onClick={addItem}
                className="text-sm text-brand-green hover:text-brand-green/80"
              >
                + Add Item
              </button>
            </div>

            <div className="space-y-3">
              {items.map((item, index) => (
                <div key={index} className="flex gap-3 items-end">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-brand-gray-700 mb-1">
                      Item Name
                    </label>
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) => updateItem(index, "name", e.target.value)}
                      className="w-full px-3 py-2 border border-brand-gray-200 rounded-md focus:ring-brand-green focus:border-brand-green"
                      placeholder="Item name"
                    />
                  </div>
                  <div className="w-20">
                    <label className="block text-sm font-medium text-brand-gray-700 mb-1">
                      Qty
                    </label>
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => updateItem(index, "quantity", e.target.value)}
                      className="w-full px-3 py-2 border border-brand-gray-200 rounded-md focus:ring-brand-green focus:border-brand-green"
                      min="1"
                    />
                  </div>
                  <div className="w-24">
                    <label className="block text-sm font-medium text-brand-gray-700 mb-1">
                      Price (Ksh)
                    </label>
                    <input
                      type="number"
                      value={item.price}
                      onChange={(e) => updateItem(index, "price", e.target.value)}
                      className="w-full px-3 py-2 border border-brand-gray-200 rounded-md focus:ring-brand-green focus:border-brand-green"
                      placeholder="0"
                    />
                  </div>
                  {items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      className="text-brand-red hover:text-brand-red/80 pb-2"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>

            {calculateTotal() > 0 && (
              <div className="mt-4 p-3 bg-brand-gray-50 rounded-md">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Total Amount:</span>
                  <span className="text-lg font-bold text-brand-green">
                    {formatCurrency(calculateTotal() * 100)}
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={createPaymentLink}
              disabled={isCreating}
              className="btn-primary"
            >
              {isCreating ? "Creating..." : "Create Payment Link"}
            </button>
          </div>
        </div>
      )}

      {/* Payment Links List */}
      <div className="card">
        <h2 className="font-heading font-semibold text-xl mb-4">Recent Payment Links</h2>
        
        {links.length === 0 ? (
          <div className="text-center py-8 text-brand-gray-500">
            <p>No payment links created yet</p>
            <p className="text-sm mt-2">Create your first payment link to get started</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-brand-gray-200">
              <thead className="bg-brand-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-brand-gray-500 uppercase">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-brand-gray-500 uppercase">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-brand-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-brand-gray-500 uppercase">
                    Email Sent
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-brand-gray-500 uppercase">
                    Created
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-brand-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-brand-gray-200">
                {links.map((link) => (
                  <tr key={link.id} className="hover:bg-brand-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-brand-gray-900">
                        {link.customerName}
                      </div>
                      <div className="text-sm text-brand-gray-500">{link.customerPhone}</div>
                      {link.customerEmail && (
                        <div className="text-xs text-brand-gray-400">{link.customerEmail}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-brand-green">
                      {formatCurrency(link.amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded ${
                          link.status === "paid"
                            ? "bg-brand-green/10 text-brand-green"
                            : link.status === "expired"
                            ? "bg-brand-red/10 text-brand-red"
                            : "bg-brand-pink/10 text-brand-pink"
                        }`}
                      >
                        {link.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-brand-gray-600">
                      {link.emailSent ? "✅ Yes" : "❌ No"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-brand-gray-600">
                      {formatDateTime(link.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm space-x-2">
                      <button
                        type="button"
                        onClick={() => navigator.clipboard.writeText(link.paymentUrl)}
                        className="text-brand-blue hover:text-brand-blue/80"
                      >
                        Copy Link
                      </button>
                      <button
                        type="button"
                        onClick={() => window.open(link.paymentUrl, "_blank")}
                        className="text-brand-green hover:text-brand-green/80"
                      >
                        Test
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
