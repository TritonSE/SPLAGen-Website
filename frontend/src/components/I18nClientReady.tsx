"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

// Component to ensure that i18n is initialized before rendering children to avoid hydration issues
export function I18nClientReady({ children }: { children: React.ReactNode }) {
  const { i18n } = useTranslation();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    i18n.on("initialized", () => {
      setReady(true);
    });

    // If it's already initialized (e.g. from cache), still set ready
    if (i18n.isInitialized) {
      setReady(true);
    }
  }, [i18n]);

  if (!ready) return null;

  return <>{children}</>;
}
