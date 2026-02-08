"use client";

import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { I18nextProvider } from "react-i18next";

import { TopNavbar } from "./TopNavbar";

import { I18nClientReady, Navbar } from "@/components";
import { UserContextProvider } from "@/contexts/userContext";
import i18n from "@/i18n";

export const RootLayoutComponent = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const pathname = usePathname();

  const isOnboardingFlow = useMemo(
    () => ["/signup", "/login", "/forgotLogin", "/directoryForm"].includes(pathname),
    [pathname],
  );
  const isDirectoryMap = useMemo(() => pathname.startsWith("/directoryMap"), [pathname]);
  const isOnboardingFlowOrMap = isOnboardingFlow || isDirectoryMap;

  return (
    <html lang="en">
      <body>
        <UserContextProvider>
          <I18nextProvider i18n={i18n}>
            <I18nClientReady>
              <div className="layout-container">
                <Navbar />
                <section className={`viewPort ${isOnboardingFlow ? "purpleBackground" : ""}`}>
                  <main className={isOnboardingFlow ? "whiteBackground" : ""}>
                    {children}
                    <TopNavbar
                      languageVisible={!isDirectoryMap}
                      currentUserVisible={!isOnboardingFlowOrMap}
                    />
                  </main>
                </section>
              </div>
            </I18nClientReady>
          </I18nextProvider>
        </UserContextProvider>
      </body>
    </html>
  );
};
