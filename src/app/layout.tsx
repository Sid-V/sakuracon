import type { Metadata, Viewport } from "next";
import Image from "next/image";
import "./globals.css";
import BottomNav from "@/components/BottomNav";
import ThemeToggle from "@/components/ThemeToggle";

export const metadata: Metadata = {
  title: "Sakura-Con 2026",
  description: "Event schedule for Sakura-Con 2026 — April 3–5, Seattle",
  icons: { icon: "/logo.svg" },
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
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
          </div>
        </header>

        {/* Content */}
        <main className="mx-auto max-w-lg">{children}</main>

        {/* Bottom nav */}
        <BottomNav />
      </body>
    </html>
  );
}
