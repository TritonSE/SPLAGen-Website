import { ChevronLeft, ChevronRight } from "lucide-react";

type PaginationProps = {
  currentPage: number;
  numPages: number;
  onPageChange: (newPage: number) => unknown;
};

export const Pagination = ({ currentPage, numPages, onPageChange }: PaginationProps) => {
  const canGoBack = currentPage !== 1;
  const canGoForward = currentPage !== numPages;

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
      Page{" "}
      <input
        className="max-w-8 text-center"
        defaultValue={currentPage}
        onChange={(e) => {
          const newPage = parseInt(e.target.value);
          if (!isNaN(newPage) && newPage > 0) {
            onPageChange(newPage);
          }
        }}
      />{" "}
      of {numPages}
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
