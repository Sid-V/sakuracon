import type { Metadata, Viewport } from "next";
import Image from "next/image";
import "./globals.css";
import BottomNav from "@/components/BottomNav";

export const metadata: Metadata = {
  title: "Sakura-Con 2026",
  description: "Event schedule for Sakura-Con 2026 — April 3–5, Seattle",
  icons: { icon: "/logo.png" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#ec4899",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="sakura-bg min-h-full">
        {/* Header */}
        <header className="sticky top-0 z-50 border-b border-pink-100/60 bg-white/80 px-4 py-3 backdrop-blur-xl">
          <div className="mx-auto flex max-w-lg items-center justify-center gap-2">
            <Image
              src="/logo.png"
              alt="Sakura-Con logo"
              width={32}
              height={32}
              className="shrink-0"
            />
            <div>
              <h1 className="text-center font-[var(--font-display)] text-xl font-bold tracking-tight text-stone-800">
                <span className="text-pink-500">Sakura</span>-Con{" "}
                <span className="text-sm font-semibold text-stone-400">2026</span>
              </h1>
              <p className="text-center text-[10px] font-medium tracking-widest text-stone-400 uppercase">
                April 3–5 &middot; Seattle, WA
              </p>
            </div>
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
