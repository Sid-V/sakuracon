import type { Metadata, Viewport } from "next";
import Image from "next/image";
import "./globals.css";
import BottomNav from "@/components/BottomNav";
import ThemeToggle from "@/components/ThemeToggle";
import InfoPopover from "@/components/InfoPopover";
import { Analytics } from "@vercel/analytics/next";

export const metadata: Metadata = {
  metadataBase: new URL("https://sakuracon.vercel.app"),
  title: {
    default: "Sakura-Con 2026 Schedule",
    template: "%s | Sakura-Con 2026",
  },
  description:
    "Browse the full Sakura-Con 2026 event schedule — April 3–5, Seattle Convention Center. Filter by day, venue, age rating, and tags. Save your favorite panels, workshops, and events.",
  keywords: [
    "sakura-con",
    "sakuracon",
    "sakura con 2026",
    "sakura-con schedule",
    "sakuracon schedule",
    "anime convention seattle",
    "sakura-con events",
    "sakura-con panels",
  ],
  icons: { icon: "/logo.svg", apple: "/icon-192.png" },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Sakura-Con",
  },
  openGraph: {
    title: "Sakura-Con 2026 Schedule",
    description:
      "Browse the full Sakura-Con 2026 event schedule — April 3–5, Seattle. Filter by day, venue, and tags. Save your favorites.",
    url: "https://sakuracon.vercel.app",
    siteName: "Sakura-Con 2026 Schedule",
    images: "/logo.svg",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Sakura-Con 2026 Schedule",
    description:
      "Browse the full Sakura-Con 2026 event schedule — April 3–5, Seattle. Filter by day, venue, and tags. Save your favorites.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#ec4899",
};

// Inline script to prevent flash of wrong theme
// Default to dark mode. Only go light if explicitly set to "light".
const themeScript = `(function(){try{var t=localStorage.getItem("sakuracon-theme");if(t!=="light"){document.documentElement.classList.add("dark")}}catch(e){document.documentElement.classList.add("dark")}})()`;
const swScript = `if("serviceWorker"in navigator){navigator.serviceWorker.register("/sw.js")}`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script dangerouslySetInnerHTML={{ __html: swScript }} />
      </head>
      <body className="min-h-full bg-[#fffbfc] text-stone-900 dark:bg-stone-950 dark:text-stone-100">
        {/* Header */}
        <header className="sticky top-0 z-50 border-b border-pink-100/60 bg-white/80 px-4 py-3 backdrop-blur-xl dark:border-stone-800/60 dark:bg-stone-950/80">
          <div className="mx-auto flex max-w-lg items-center justify-center gap-2">
            <Image
              src="/logo.svg"
              alt="Sakura-Con logo"
              width={32}
              height={32}
              className="shrink-0"
            />
            <div className="flex-1">
              <h1 className="text-center font-[var(--font-display)] text-xl font-bold tracking-tight text-stone-800 dark:text-stone-100">
                <span className="text-pink-500">Sakura</span>-Con{" "}
                <span className="text-sm font-semibold text-stone-400 dark:text-stone-500">2026</span>
              </h1>
              <p className="text-center text-[10px] font-medium tracking-widest text-stone-400 uppercase dark:text-stone-500">
                April 3–5 &middot; Seattle, WA
              </p>
            </div>
            <ThemeToggle />
            <InfoPopover />
          </div>
        </header>

        {/* Content */}
        <main className="mx-auto max-w-lg">{children}</main>

        {/* Bottom nav */}
        <BottomNav />
        <Analytics />
      </body>
    </html>
  );
}
