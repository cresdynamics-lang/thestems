"use client";

import dynamic from "next/dynamic";

const GoogleAnalytics = dynamic(() => import("@/components/GoogleAnalytics"), {
  ssr: false,
});

export default function ClientGoogleAnalytics() {
  return <GoogleAnalytics />;
}
