"use client";

import { usePathname } from "next/navigation";

import { SideNavbar } from "@/components";
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
          <section className="viewPort">
            <main>{children}</main>
          </section>
        </div>
      </body>
    </html>
  );
}
