"use client";
import { usePathname } from "next/navigation";

import { Navbar } from "@/components";
import { UserContextProvider } from "@/contexts/userContext";
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
        <UserContextProvider>
          <div className="layout-container">
            <Navbar />
            <section className="viewPort">
              <main>{children}</main>
            </section>
          </div>
        </UserContextProvider>
      </body>
    </html>
  );
}
