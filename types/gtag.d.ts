interface Window {
  gtag: (
    command: "config" | "event" | "js" | "set",
    targetId: string | Date,
    config?: {
      page_path?: string;
      [key: string]: any;
    }
  ) => void;
  dataLayer: any[];
  fbq?: (...args: any[]) => void;
  _fbq?: (...args: any[]) => void;
}

