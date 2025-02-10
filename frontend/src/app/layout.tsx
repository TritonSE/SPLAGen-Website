"use client";

import SideNavbar from "./components/SideNavbar";

import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="layout-container">
          <SideNavbar />

          <section className="main-content">
            {/* Insert Top Bar Here */}
            <main>{children}</main>
          </section>
        </div>
      </body>
    </html>
  );
}
