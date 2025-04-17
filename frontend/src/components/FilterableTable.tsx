"use client";
import React, { useState, useCallback } from "react";

import styles from "./FilterableTable.module.css";

type Column = {
  key: string;
  label: string;
  render?: (row: Record<string,unknown>) => React.ReactNode;
};

type FilterableTableProps = {
  data: Record<string,unknown>[];
  columns: Column[];
  filters: Record<string, string[]>;
  title?: string;
  csvFilename?: string;
};

export const FilterableTable: React.FC<FilterableTableProps> = ({
  data,
  columns,
  filters,
  title = "Manage Data",
  csvFilename = "data.csv",
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const toggleFilterPanel = useCallback(() => {
    setIsFilterOpen((prev) => !prev);
  }, [setIsFilterOpen]);

  const resetFilters = () => {
    setActiveFilters({});
  };

  const handleFilterChange = (category: string, value: string) => {
    setActiveFilters((prev) => ({
      ...prev,
      [category]: prev[category]?.includes(value)
        ? prev[category].filter((v) => v !== value)
        : [...(prev[category] || []), value],
    }));
  };

  const filteredData = data.filter((row) => {
    const matchesSearch = Object.values(row)
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesFilters = Object.entries(activeFilters).every(([category, selected]) => {
      if (!selected.length) return true;
      const rowValue = row[category];
      if (Array.isArray(rowValue)) {
        return rowValue.some((val) => selected.includes(val));
      }
      return selected.includes(rowValue);
    });

    return matchesSearch && matchesFilters;
  });

  const downloadCSV = () => {
    const header = columns.map((col) => col.label).join(",");
    const rows = filteredData.map((row) =>
      columns.map((col) => `"${row[col.key] ?? ""}"`).join(","),
    );

    const csv = [header, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = csvFilename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className={styles["filterable-table"]}>
      <div className={styles.header}>
        <h1 className={styles.title}>{title}</h1>
      </div>

      <div className={styles.controls}>
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
          }}
          className={styles["search-bar"]}
        />
        <button onClick={toggleFilter} className={styles["action-button"]}>
          Filter
          <img src="/icons/filter.svg" alt="Filter icon" className={styles["button-icon"]} />
        </button>
        <button onClick={downloadCSV} className={styles["action-button"]}>
          Download
          <img src="/icons/download.svg" alt="Download icon" className={styles["button-icon"]} />
        </button>
      </div>

      <div className={`${styles["filter-sidebar"]} ${isFilterOpen ? styles.open : ""}`}>
        {Object.entries(filters).map(([category, options]) => (
          <div key={category} className={styles["filter-category"]}>
            <h4>{category}</h4>
            {options.map((option) => (
              <label key={option}>
                <input
                  type="checkbox"
                  checked={activeFilters[category]?.includes(option) || false}
                  onChange={() => {
                    handleFilterChange(category, option);
                  }}
                />
                {option}
              </label>
            ))}
          </div>
        ))}
        <div className={styles["filter-actions"]}>
          <button onClick={resetFilters}>Reset</button>
          <button onClick={toggleFilter}>Apply</button>
        </div>
      </div>

      <div className={styles["table-wrapper"]}>
        <table className={styles["counselor-table"]}>
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col.key}>{col.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredData.map((row, idx) => (
              <tr key={idx}>
                {columns.map((col) => (
                  <td key={col.key}>{col.render ? col.render(row) : row[col.key]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
