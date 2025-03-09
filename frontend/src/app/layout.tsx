"use client";

import { usePathname } from "next/navigation";

import SideNavbar from "./components/SideNavbar";
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  const isSignUpPage = pathname === "/signup";

  return (
    <html lang="en">
      <body className={isSignUpPage ? "bg-primary" : ""}>
        <div className="layout-container">
          <SideNavbar />
          <section className="main-content">
            <main className="h-full">{children}</main>
          </section>
        </div>
      </body>
    </html>
  );
}
