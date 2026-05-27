export type ParsedDevice = {
  label: string;
  deviceType: "mobile" | "tablet" | "desktop" | "unknown";
  deviceName: string;
  browser: string;
  os: string;
  icon: string;
};

export function parseUserAgent(
  ua: string | null | undefined,
  screen?: { width?: number; height?: number }
): ParsedDevice {
  if (!ua) {
    return {
      label: "Unknown visitor",
      deviceType: "unknown",
      deviceName: "Visitor",
      browser: "Unknown",
      os: "",
      icon: "👤",
    };
  }

  const u = ua.toLowerCase();
  let deviceType: ParsedDevice["deviceType"] = "desktop";
  if (/ipad|tablet|playbook|silk|(android(?!.*mobile))/i.test(ua)) deviceType = "tablet";
  else if (/mobile|iphone|ipod|android.*mobile|windows phone|blackberry/i.test(ua))
    deviceType = "mobile";
  else if (screen?.width && screen.width < 768) deviceType = "mobile";
  else if (screen?.width && screen.width < 1024) deviceType = "tablet";

  let deviceName = deviceType === "desktop" ? "Desktop" : "Mobile";
  let icon = deviceType === "desktop" ? "💻" : "📱";

  if (/iphone/i.test(ua)) {
    deviceName = "iPhone";
    icon = "📱";
    deviceType = "mobile";
  } else if (/ipad/i.test(ua)) {
    deviceName = "iPad";
    icon = "📱";
    deviceType = "tablet";
  } else if (/macintosh|mac os/i.test(ua) && deviceType === "desktop") {
    deviceName = "Mac";
    icon = "💻";
  } else if (/android/i.test(ua)) {
    deviceName = deviceType === "tablet" ? "Android tablet" : "Android phone";
    icon = "📱";
  } else if (/windows/i.test(ua)) {
    deviceName = "Windows PC";
    icon = "🖥️";
  } else if (/linux/i.test(ua) && !/android/i.test(ua)) {
    deviceName = "Linux";
    icon = "💻";
  }

  let browser = "Browser";
  if (/edg\//i.test(ua)) browser = "Edge";
  else if (/opr\/|opera/i.test(ua)) browser = "Opera";
  else if (/firefox\//i.test(ua)) browser = "Firefox";
  else if (/samsungbrowser/i.test(ua)) browser = "Samsung Internet";
  else if (/crios/i.test(ua)) browser = "Chrome";
  else if (/chrome\//i.test(ua) && !/edg/i.test(ua)) browser = "Chrome";
  else if (/safari/i.test(ua) && !/chrome/i.test(ua)) browser = "Safari";

  let os = "";
  if (/windows nt 10/i.test(u)) os = "Windows 10/11";
  else if (/windows/i.test(u)) os = "Windows";
  else if (/mac os x|macintosh/i.test(u)) os = "macOS";
  else if (/android ([\d.]+)/i.test(ua)) {
    const m = ua.match(/android ([\d.]+)/i);
    os = m ? `Android ${m[1]}` : "Android";
  }
  else if (/android/i.test(u)) os = "Android";
  else if (/iphone os|cpu os/i.test(u)) os = "iOS";
  else if (/linux/i.test(u)) os = "Linux";

  const label = os ? `${deviceName} · ${browser} (${os})` : `${deviceName} · ${browser}`;

  return { label, deviceType, deviceName, browser, os, icon };
}

export function formatPageLabel(path: string | null | undefined): string {
  if (!path || path === "/") return "Homepage";
  const map: Record<string, string> = {
    "/collections/flowers": "Flower bouquets",
    "/collections/gift-hampers": "Gift hampers",
    "/collections/teddy-bears": "Teddy bears",
    "/collections/wines": "Wines",
    "/collections/chocolates": "Chocolates",
    "/collections": "All collections",
    "/cart": "Cart",
    "/checkout": "Checkout",
    "/blog": "Blog",
  };
  if (map[path]) return map[path];
  if (path.startsWith("/product/")) return `Product: ${path.replace("/product/", "")}`;
  if (path.startsWith("/blog/")) return `Blog: ${path.replace("/blog/", "")}`;
  return path;
}
