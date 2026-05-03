import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import VisitTracker from "@/components/VisitTracker";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ThemeToggle } from "@/components/ThemeToggle";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const keywords = [
  "bd result", "bd result 2026", "ssc result 2026", "hsc result 2026", "jsc result 2026", 
  "ssc result", "hsc result", "jsc result", "education board result", "bd education board result",
  "result bd", "bdresult", "educationboardresults", "eboardresults", "web based result", 
  "webbasedresult", "marksheet result bd", "bd result with marksheet", "ssc marksheet", "hsc marksheet",
  "dhaka board result", "rajshahi board result", "comilla board result", "jessore board result",
  "chittagong board result", "barisal board result", "sylhet board result", "dinajpur board result",
  "mymensingh board result", "madrasha board result", "technical board result", "bteb result",
  "bou result", "national university result", "nu result", "bd education board", "bangladesh result",
  "education ministry bd", "result checker bd", "fast result bd", "ssc result check", "hsc result check",
  "2026 ssc result", "2026 hsc result", "ssc exam result 2026", "hsc exam result 2026",
  "how to check ssc result", "how to check hsc result", "result by sms bd", "sms result bd",
  "ssc result by sms", "hsc result by sms", "ssc result online", "hsc result online",
  "online result check bd", "bd board result 2026", "bangladesh education board result 2026",
  "eboard result", "bd eboard result", "result app bd", "bd result app", "ssc result app",
  "hsc result app", "best bd result site", "fastest bd result", "bd result fast",
  "ssc result publish date 2026", "hsc result publish date 2026", "jsc result publish date",
  "bd result update", "ssc result news", "hsc result news", "education board news bd",
  "ssc routine", "hsc routine", "ssc exam 2026", "hsc exam 2026", "bangladesh board result",
  "dhaka board ssc result", "dhaka board hsc result", "rajshahi board ssc result", "rajshahi board hsc result",
  "comilla board ssc result", "comilla board hsc result", "jessore board ssc result", "jessore board hsc result",
  "chittagong board ssc result", "chittagong board hsc result", "barisal board ssc result", "barisal board hsc result",
  "sylhet board ssc result", "sylhet board hsc result", "dinajpur board ssc result", "dinajpur board hsc result",
  "mymensingh board ssc result", "mymensingh board hsc result", "madrasha board alim result", "madrasha board dakhil result",
  "technical board ssc vocational result", "technical board hsc vocational result", "nu degree result", "nu honours result",
  "nu masters result", "bou ssc result", "bou hsc result", "bou ba result", "bangladesh open university result"
];

export const metadata: Metadata = {
  title: "BD Result - SSC & HSC Marksheet 2026",
  description: "Check your SSC, HSC, and JSC results instantly. BD Result is the fastest and most reliable platform for Bangladesh Education Board Results. Supports 2020 to 2026 results.",
  keywords: keywords.join(", "),
  authors: [{ name: "BD Result" }],
  openGraph: {
    title: "BD Result - Fast Academic Result Checker",
    description: "Instant SSC and HSC result checker for all Bangladesh education boards.",
    url: "https://bdresult2026.vercel.app",
    siteName: "BD Result",
    images: [
      {
        url: "/bd-result.png",
        width: 1200,
        height: 630,
        alt: "BD Result Platform",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  verification: {
    google: "_huw8eei97VKnquFyaozKEe9L2T2terMpbudNm5sumA",
  },
};

import AdSocialBar from "@/components/AdSocialBar";
import AdBanner from "@/components/AdBanner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <VisitTracker />
          <AdSocialBar />
          <ThemeToggle />
          <main className="flex-1 flex flex-col">
            {children}
          </main>
          
          {/* 320x50 Mobile Banner (Global) */}
          <div className="w-full flex justify-center bg-slate-50 dark:bg-slate-950 pt-2 z-10 relative">
            <AdBanner dataKey="f5d6a62114fa3a7bd35ed356e1c398a0" width={320} height={50} />
          </div>

          <footer className="w-full text-center py-3 bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 text-xs font-medium transition-colors duration-300 z-10 relative">
            BD Result Platform &copy; {new Date().getFullYear()} • v1.1.1
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
