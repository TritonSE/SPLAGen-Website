"use client";

import { useTranslation } from "react-i18next";

const External = () => {
  const { t } = useTranslation();

  return <div className="relative inline-block text-left">{t("welcome")}</div>;
};

export default External;
