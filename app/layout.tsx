import "../src/index.css";
import Navbar from "../src/components/Navbar";
import Footer from "../src/components/Footer";
import { AuthProvider } from "../src/context/AuthContext";
import type { ReactNode } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Montserrat } from "next/font/google";
import { siteConfig } from "@/lib/site";

const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-montserrat",
});

export const metadata = {
  metadataBase: new URL(siteConfig.ogUrl),
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.shortName}`,
  },
  description: siteConfig.description,
  openGraph: {
    title: siteConfig.title,
    description: siteConfig.description,
    url: siteConfig.ogUrl,
    siteName: siteConfig.name,
    images: [{ url: "/thumbnail.png", width: 1200, height: 630, alt: siteConfig.name }],
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
    images: ["/thumbnail.png"],
  },
  icons: {
    icon: "/my-photo.png",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={montserrat.variable}>
      <body className={`${montserrat.className} bg-white text-gray-900 antialiased`}>
        <AuthProvider>
          <Navbar />
          <ToastContainer position="top-right" autoClose={3000} theme="dark" />
          {children}
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
