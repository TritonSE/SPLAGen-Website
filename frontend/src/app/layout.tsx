"use client";
import { usePathname } from "next/navigation";
import { I18nextProvider } from "react-i18next";

import { I18nClientReady, Navbar } from "@/components";
import { UserContextProvider } from "@/contexts/userContext";
import "./globals.css";
import i18n from "@/i18n";

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
          <I18nextProvider i18n={i18n}>
            <I18nClientReady>
              <div className="layout-container">
                <Navbar />
                <section className="viewPort">
                  <main>{children}</main>
                </section>
              </div>
            </I18nClientReady>
          </I18nextProvider>
        </UserContextProvider>
      </body>
    </html>
  );
}
