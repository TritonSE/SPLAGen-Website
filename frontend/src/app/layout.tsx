"use client";
import { UserContextProvider } from "../contexts/userContext";

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
        //TODO fix up and check ordering
      <body className={isSignUpPage ? "bg-primary" : ""}>
      <UserContextProvider>
        <div className="layout-container">
          <SideNavbar />
          <section className="viewPort">
            <main>{children}</main>
          </section>
        </div>
      </UserContextProvider>
      </body>
    </html>
  );
}
