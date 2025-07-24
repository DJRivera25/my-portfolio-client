import "../src/index.css";
import Navbar from "../src/components/Navbar";
import Footer from "../src/components/Footer";
import { AuthProvider } from "../src/context/AuthContext";
import type { ReactNode } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const metadata = {
  title: "Derem Joshua | Web Developer",
  description: "Portfolio of Derem Joshua, a full stack web developer",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/my-photo.png" type="image/png" />
        <title>Derem Joshua | Web Developer</title>
        <meta name="description" content="Portfolio of Derem Joshua, a full stack web developer" />
        {/* Open Graph tags for social sharing */}
        <meta property="og:title" content="Derem Joshua | Web Developer" />
        <meta property="og:description" content="Portfolio of Derem Joshua, a full stack web developer" />
        <meta property="og:image" content="/thumbnail.png" />
        <meta property="og:url" content="https://my-portfolio-client-one.vercel.app/" />
        <meta property="og:type" content="website" />
        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Derem Joshua | Web Developer" />
        <meta name="twitter:description" content="Portfolio of Derem Joshua, a full stack web developer" />
        <meta name="twitter:image" content="/thumbnail.png" />
      </head>
      <body className="font-[Montserrat] bg-white text-gray-900">
        <AuthProvider>
          <Navbar />
          <ToastContainer position="top-right" autoClose={3000} />
          {children}
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
