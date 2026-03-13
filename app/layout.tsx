import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { ConvexClientProvider } from "@/shared/providers/ConvexClientProvider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { ServiceWorker } from "@/components/pwa/service-worker";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "OpenClaw | Next-Generation AI Workspace",
  description: "The ultimate infrastructure built for autonomous agents, combining real-time database capabilities and enterprise auth.",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/favicon.svg",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "#0B0B0B" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ConvexClientProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster />
            <ServiceWorker />
          </ThemeProvider>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
