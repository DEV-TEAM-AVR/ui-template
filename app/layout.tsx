import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { brand } from "./config/brand";
import { NavigationLayout } from "./components/ui/NavigationLayout";
import { AuthProvider } from "./contexts/AuthContext";
import MuiThemeRegistry from "./providers/MuiThemeRegistry";
import { FeedbackHost } from "./components/ui/FeedbackHost";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: brand.name,
  description: brand.tagline,
  applicationName: brand.name,
  icons: { icon: brand.logo },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        {/* Apply the saved theme before first paint (no light flash in dark mode). */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.getItem('theme') === 'dark') document.documentElement.classList.add('dark');
                else document.documentElement.classList.remove('dark');
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-zinc-50 dark:bg-zinc-950 text-zinc-950 dark:text-zinc-50 overflow-x-hidden transition-colors duration-200`}
      >
        <MuiThemeRegistry>
          <AuthProvider>
            <NavigationLayout>
              {children}
              <FeedbackHost />
            </NavigationLayout>
          </AuthProvider>
        </MuiThemeRegistry>
      </body>
    </html>
  );
}
