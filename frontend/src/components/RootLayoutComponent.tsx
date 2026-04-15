"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import { I18nextProvider } from "react-i18next";

import logo from "@/../public/images/Logo_SPLAGen1.png";
import { I18nClientReady, Navbar } from "@/components";
import { UserContextProvider } from "@/contexts/userContext";
import i18n from "@/i18n";

export const RootLayoutComponent = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isOnboardingFlow = useMemo(
    () => ["/signup", "/login", "/forgotLogin", "/directoryForm"].includes(pathname),
    [pathname],
  );
  const isDirectoryMap = useMemo(() => pathname.startsWith("/directoryMap"), [pathname]);
  // Hide mobile header on full-screen pages (onboarding flow handles its own layout,
  // directoryMap has no sidebar at all)
  const showMobileHeader = !isOnboardingFlow && !isDirectoryMap;

  return (
    <html lang="en">
      <body>
        <UserContextProvider>
          <I18nextProvider i18n={i18n}>
            <I18nClientReady>
              <div className="layout-container">
                {/* Mobile top header — only visible at ≤768px via CSS */}
                {showMobileHeader && (
                  <header className="mobile-header">
                    <button
                      className="hamburger-button"
                      aria-label="Toggle navigation menu"
                      onClick={() => {
                        setIsMobileMenuOpen((open) => !open);
                      }}
                    >
                      <span />
                      <span />
                      <span />
                    </button>
                    <Link href="/" className="mobile-logo">
                      <Image src={logo} alt="SPLAGen logo" width={32} height={32} />
                      <strong>SPLAGen</strong>
                    </Link>
                  </header>
                )}

                {/* Backdrop — closes drawer when tapped */}
                {isMobileMenuOpen && (
                  <div
                    className="mobile-overlay"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                    }}
                  />
                )}

                <Navbar
                  isMobileOpen={isMobileMenuOpen}
                  onClose={() => {
                    setIsMobileMenuOpen(false);
                  }}
                />
                <section className={`viewPort ${isOnboardingFlow ? "purpleBackground" : ""}`}>
                  <main className={isOnboardingFlow ? "whiteBackground" : ""}>{children}</main>
                </section>
              </div>
            </I18nClientReady>
          </I18nextProvider>
        </UserContextProvider>
      </body>
    </html>
  );
};
