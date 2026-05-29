"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const WhatsAppButton = dynamic(() => import("@/components/WhatsAppButton"), {
  ssr: false,
  loading: () => null,
});

export default function LazyWhatsAppButton() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const reveal = () => setShow(true);
    const timer = setTimeout(reveal, 2500);
    const onScroll = () => {
      if (window.scrollY > 400) reveal();
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  if (!show) return null;
  return <WhatsAppButton />;
}
