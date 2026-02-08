import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

type PaginationProps = {
  currentPage: number;
  numPages: number;
  onPageChange: (newPage: number) => unknown;
};

export const Pagination = ({ currentPage, numPages, onPageChange }: PaginationProps) => {
  const { t } = useTranslation();
  const canGoBack = currentPage !== 1;
  const canGoForward = currentPage !== numPages;
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    setInputValue(currentPage.toString());
  }, [currentPage]);

  return (
    <div className="flex flex-row gap-3 text-gray-500 items-center justify-center w-full">
      <ChevronLeft
        className={canGoBack ? "cursor-pointer" : ""}
        onClick={() => {
          if (canGoBack) {
            onPageChange(currentPage - 1);
          }
        }}
      />
      {t("page")}{" "}
      <input
        className="max-w-8 text-center"
        onChange={(e) => {
          setInputValue(e.target.value);
          const newPage = parseInt(e.target.value);
          if (!isNaN(newPage) && newPage > 0) {
            onPageChange(newPage);
          }
        }}
        value={inputValue}
      />{" "}
      {t("of")} {numPages}
      <ChevronRight
        className={canGoForward ? "cursor-pointer" : ""}
        onClick={() => {
          if (canGoForward) {
            onPageChange(currentPage + 1);
          }
        }}
      />
    </div>
  );
};
