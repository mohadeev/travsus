import React, { FC } from "react";

export interface PaginationProps {
  className?: string;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: FC<PaginationProps> = ({ className = "", currentPage, totalPages, onPageChange }) => {

  const renderPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => onPageChange(i)}
          className={`inline-flex w-11 h-11 items-center justify-center rounded-full ${
            i === currentPage
              ? "bg-primary-6000 text-white"
              : "bg-white hover:bg-neutral-100 border border-neutral-200 text-neutral-6000 dark:text-neutral-400 dark:bg-neutral-900 dark:hover:bg-neutral-800 dark:border-neutral-700"
          }`}
        >
          {i}
        </button>
      );
    }
    return pages;
  };

  return (
    <nav className={`nc-Pagination inline-flex space-x-1 text-base font-medium ${className}`}>
      {renderPageNumbers()}
    </nav>
  );
};

export default Pagination;
