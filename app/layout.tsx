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
