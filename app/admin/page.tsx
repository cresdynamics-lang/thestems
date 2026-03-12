"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { formatCurrency } from "@/lib/utils";

interface DashboardStats {
  totalOrders: number;
  pendingOrders: number;
  paidOrders: number;
  totalRevenue: number;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [liveVisitors, setLiveVisitors] = useState<number | null>(null);
  const [previousVisitors, setPreviousVisitors] = useState<number | null>(null);

  useEffect(() => {
    // Check if admin is logged in
    const token = localStorage.getItem("admin_token");
    if (!token) {
      router.push("/admin/login");
      return;
    }

    // Validate token by making an API call
    async function validateAndFetchStats() {
      try {
        // First validate the token by checking if it's valid
        const statsResponse = await axios.get("/api/admin/stats", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setStats(statsResponse.data);
      } catch (error: any) {
        // If unauthorized, clear token and redirect to login
        if (error.response?.status === 401 || error.response?.status === 403) {
          localStorage.removeItem("admin_token");
          router.push("/admin/login");
          return;
        } else {
          console.error("Error fetching stats:", error);
        }
      } finally {
        setIsLoading(false);
      }
    }

    validateAndFetchStats();
  }, [router]);

  // Poll live visitors
  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) return;

    let isMounted = true;
    let audio: HTMLAudioElement | null = null;

    const fetchLiveVisitors = async () => {
      try {
        const res = await axios.get("/api/admin/live-visitors", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!isMounted) return;
        const count = res.data?.count ?? 0;
        setPreviousVisitors((prev) => {
          if (prev !== null && count > prev) {
            if (!audio) {
              audio = new Audio("/sounds/live-visitor.mp3");
            }
            audio
              ?.play()
              .catch(() => {
                // ignore play failures (e.g. autoplay restrictions)
              });
          }
          return prev === null ? count : prev;
        });
        setLiveVisitors(count);
      } catch (err) {
        // ignore errors; live visitors are a nice-to-have
      }
    };

    fetchLiveVisitors();
    const interval = setInterval(fetchLiveVisitors, 10000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    router.push("/admin/login");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-brand-gray-600">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading font-bold text-2xl text-brand-gray-900">
          Admin Dashboard
        </h1>
        <button
          type="button"
          onClick={handleLogout}
          className="btn-outline text-sm"
        >
          Logout
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
        <div className="card p-4 md:p-6">
          <h3 className="text-xs md:text-sm font-medium text-brand-gray-600 mb-1 md:mb-2">
            Total Orders
          </h3>
          <p className="text-2xl md:text-3xl font-bold text-brand-gray-900">
            {stats?.totalOrders || 0}
          </p>
        </div>
        <div className="card p-4 md:p-6">
          <h3 className="text-xs md:text-sm font-medium text-brand-gray-600 mb-1 md:mb-2">
            Pending Orders
          </h3>
          <p className="text-2xl md:text-3xl font-bold text-brand-pink">
            {stats?.pendingOrders || 0}
          </p>
        </div>
        <div className="card p-4 md:p-6">
          <h3 className="text-xs md:text-sm font-medium text-brand-gray-600 mb-1 md:mb-2">
            Paid Orders
          </h3>
          <p className="text-2xl md:text-3xl font-bold text-brand-green">
            {stats?.paidOrders || 0}
          </p>
        </div>
        <div className="card p-4 md:p-6">
          <h3 className="text-xs md:text-sm font-medium text-brand-gray-600 mb-1 md:mb-2">
            Total Revenue
          </h3>
          <p className="text-2xl md:text-3xl font-bold text-brand-gray-900">
            {stats ? formatCurrency(stats.totalRevenue) : formatCurrency(0)}
          </p>
        </div>
        <div className="card p-4 md:p-6 col-span-2 md:col-span-1">
          <h3 className="text-xs md:text-sm font-medium text-brand-gray-600 mb-1 md:mb-2">
            Live Visitors (last 5 minutes)
          </h3>
          <p className="text-2xl md:text-3xl font-bold text-brand-green">
            {liveVisitors ?? 0}
          </p>
          <p className="text-[11px] md:text-xs text-brand-gray-500 mt-1">
            Updates every 10 seconds. A chime plays when a new visitor appears while this page is open.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <Link href="/admin/products" className="card p-5 md:p-6 hover:shadow-cardHover transition-shadow block">
            <h2 className="font-heading font-bold text-xl text-brand-gray-900 mb-2">Manage Products</h2>
            <p className="text-brand-gray-600 mb-4">Add, edit, or remove products from your catalog</p>
            <span className="text-brand-green font-medium">Go to Products →</span>
          </Link>

        <Link href="/admin/orders" className="card p-5 md:p-6 hover:shadow-cardHover transition-shadow block">
            <h2 className="font-heading font-bold text-xl text-brand-gray-900 mb-2">Manage Orders</h2>
            <p className="text-brand-gray-600 mb-4">View orders, update status, and process payments</p>
            <span className="text-brand-green font-medium">Go to Orders →</span>
          </Link>

        <Link href="/admin/blogs" className="card p-5 md:p-6 hover:shadow-cardHover transition-shadow block">
            <h2 className="font-heading font-bold text-xl text-brand-gray-900 mb-2">Manage Blog</h2>
            <p className="text-brand-gray-600 mb-4">Create, edit, or delete blog posts</p>
            <span className="text-brand-green font-medium">Go to Blog →</span>
          </Link>
      </div>
    </>
  );
}

