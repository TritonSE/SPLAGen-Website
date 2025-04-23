"use client";

import Image from "next/image";
import React, { useCallback, useMemo, useState } from "react";

import styles from "./FilterableTable.module.css";

type RowData = Record<string, unknown>;

type Column = {
  key: string;
  label: string;
  render?: (row: RowData) => React.ReactNode;
};

type FilterableTableProps = {
  data: RowData[];
  columns: Column[];
  filters: Record<string, string[]>;
  csvFilename?: string;
};

export const FilterableTable: React.FC<FilterableTableProps> = ({
  data,
  columns,
  filters,
  csvFilename = "data.csv",
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const toggleFilterPanel = useCallback(() => {
    setIsFilterOpen((prev) => !prev);
  }, []);

  const resetFilters = useCallback(() => {
    setActiveFilters({});
  }, []);

  const handleFilterChange = useCallback((category: string, value: string) => {
    setActiveFilters((prev) => {
      const current = prev[category] || [];
      const newSelection = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      return { ...prev, [category]: newSelection };
    });
  }, []);

  const filteredData = useMemo(() => {
    return data.filter((row) => {
      const matchesSearch = Object.values(row)
        .map((val) => (typeof val === "string" ? val : ""))
        .join(" ")
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const matchesFilters = Object.entries(activeFilters).every(([category, selected]) => {
        if (!selected.length) return true;
        const rowValue = row[category];
        if (Array.isArray(rowValue)) {
          return rowValue.some((val) => selected.includes(String(val)));
        }
        return selected.includes(String(rowValue));
      });

      return matchesSearch && matchesFilters;
    });
  }, [searchTerm, activeFilters, data]);

  const safeStringifyCell = (value: unknown): string => {
    if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
      return String(value);
    }
    return ""; // Prevents [object Object] output
  };

  const downloadCSV = (): void => {
    const header = columns.map((col) => col.label).join(",");
    const rows = filteredData.map((row) =>
      columns.map((col) => `"${safeStringifyCell(row[col.key])}"`).join(","),
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
    <div>
      {/* Controls */}
      <div className={styles.controls}>
        <input
          type="text"
          placeholder="Search Members"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
          }}
          className={styles["search-bar"]}
        />
        <button
          onClick={() => {
            toggleFilterPanel();
          }}
          className={styles["action-button"]}
        >
          Filter
          <Image
            src="/icons/filter.svg"
            alt="Filter icon"
            width={16}
            height={16}
            className={styles["button-icon"]}
          />
        </button>
        <button
          onClick={() => {
            downloadCSV();
          }}
          className={styles["action-button"]}
        >
          Download
          <Image
            src="/icons/download.svg"
            alt="Download icon"
            width={16}
            height={16}
            className={styles["button-icon"]}
          />
        </button>
      </div>

      {/* Filter Panel */}
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
          <button
            onClick={() => {
              resetFilters();
            }}
          >
            Reset
          </button>
          <button
            onClick={() => {
              toggleFilterPanel();
            }}
          >
            Apply
          </button>
        </div>
      </div>

      {/* Table */}
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
                  <td key={col.key}>
                    {col.render ? col.render(row) : safeStringifyCell(row[col.key])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
