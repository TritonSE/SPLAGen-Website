import { Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";

type LoadingIndicatorProps = {
  /** Optional label shown beneath the spinner. Defaults to the translated "Loading..." text. */
  label?: string;
  className?: string;
};

/**
 * Centered spinner used as a loading state placeholder while page/table data is being fetched.
 */
export const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ label, className }) => {
  const { t } = useTranslation();

  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 py-12 text-gray-500 ${className ?? ""}`}
      role="status"
      aria-live="polite"
    >
      <Loader2 className="h-8 w-8 animate-spin" style={{ color: "var(--color-secondary2)" }} />
      <span className="text-sm">{label ?? t("loading")}</span>
    </div>
  );
};
