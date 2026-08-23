import { useEffect } from "react";

/**
 * Warns the user before they navigate away from the page if they have
 * unsaved work in progress. Covers:
 *  - Closing the tab, refreshing, or typing a new URL (via `beforeunload`).
 *  - Clicking a link elsewhere in the app (via a capture-phase click listener,
 *    since Next.js's App Router doesn't expose a "before navigate" hook).
 *
 * Note: this intentionally does not try to intercept the browser's
 * back/forward buttons. Doing so reliably requires pushing extra entries onto
 * the history stack, which conflicts with the App Router's own history
 * management and can leave the user's history in a confusing state (e.g. an
 * extra "phantom" entry after they've already left the page). The
 * `beforeunload` and link-click checks below cover the vast majority of ways
 * someone would abandon an in-progress signup.
 *
 * @param shouldWarn Whether there is currently unsaved work that would be lost.
 * @param message The confirmation message to show for in-app navigation (the
 * browser controls its own wording for the native `beforeunload` prompt).
 */
export const useUnsavedChangesWarning = (shouldWarn: boolean, message: string) => {
  useEffect(() => {
    if (!shouldWarn) {
      return;
    }

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      // Modern browsers show their own generic message regardless of what we
      // pass here; `preventDefault` is enough to trigger the native prompt.
      event.preventDefault();
    };

    const handleLinkClick = (event: MouseEvent) => {
      // Ignore clicks that aren't a plain left click (e.g. ctrl/cmd+click to
      // open in a new tab shouldn't be blocked).
      if (event.defaultPrevented || event.button !== 0) {
        return;
      }
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }

      const target = event.target as HTMLElement | null;
      const anchor = target?.closest("a");
      if (!anchor?.href) {
        return;
      }

      // Only intercept navigations that leave the current page.
      const destination = new URL(anchor.href, window.location.href);
      if (destination.href === window.location.href) {
        return;
      }

      if (!window.confirm(message)) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    document.addEventListener("click", handleLinkClick, true);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("click", handleLinkClick, true);
    };
  }, [shouldWarn, message]);
};
