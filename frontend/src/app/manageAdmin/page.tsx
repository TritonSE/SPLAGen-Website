"use client";

import { useState } from "react";
import { FilterableTable } from "@/components";
import styles from "@/components/FilterableTable.module.css";

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function capitalizeWords(str: string) {
  return str.replace(/\b\w/g, (c) => c.toUpperCase());
}

type AdminRow = {
  id: number;
  name: string;
  Title: string;
  Membership: string;
  Location: {
    Country: string;
  };
  Languages: string[];
  Services: string[];
};

const dummyAdmins: AdminRow[] = [
  {
    id: 1,
    name: "John Doe",
    Title: "Medical Geneticist",
    Membership: "Student Member",
    Location: {
      Country: "Germany",
    },
    Languages: ["English", "Spanish"],
    Services: ["Pediatric Genetics", "Cancer Genetics"],
  },
  {
    id: 2,
    name: "Jane Smith",
    Title: "Medical Geneticist",
    Membership: "Health Professional",
    Location: {
      Country: "United States",
    },
    Languages: ["English"],
    Services: ["Cancer Genetics"],
  },
];

const ManageAdmin: React.FC = () => {
  const [selectedAdmin, setSelectedAdmin] = useState<AdminRow | null>(null);

  const columns = [
    {
      key: "name",
      label: "NAME",
      render: (row: AdminRow) => (
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <input
            type="checkbox"
            checked={selectedAdmin?.id === row.id}
            onChange={() =>
              setSelectedAdmin((prev) => (prev?.id === row.id ? null : row))
            }
          />
          <span>{row.name}</span>
        </div>
      ),
    },
    { key: "Title", label: "TITLE" },
    { key: "Membership", label: "MEMBERSHIP" },
    {
      key: "Location",
      label: "LOCATION",
      render: (row: AdminRow) => <div>{row.Location.Country}</div>,
    },
    {
      key: "languages",
      label: "LANGUAGE",
      render: (row: AdminRow) =>
        row.Languages.map((lang, i) => {
          const langClass = lang.toLowerCase().replace(/\s+/g, "-");
          return (
            <span
              key={i}
              className={`${styles["service-tag"]} ${styles[langClass] || styles.default}`}
            >
              {capitalize(lang)}
            </span>
          );
        }),
    },
    {
      key: "services",
      label: "SERVICE",
      render: (row: AdminRow) =>
        row.Services.map((s, i) => {
          const serviceClass = s.toLowerCase().replace(/\s+/g, "-");
          return (
            <span
              key={i}
              className={`${styles["service-tag"]} ${styles[serviceClass] || styles.default}`}
            >
              {capitalizeWords(s)}
            </span>
          );
        }),
    },
  ];

  const filters = {
    title: ["Medical Geneticist", "Genetic Counselor"],
    membership: ["SuperAdmin", "Admin"],
    location: ["United States", "Venezuela", "Germany", "Brazil", "Spain", "Chile"],
    services: [
      "Cancer Genetics",
      "Biochemical Genetics",
      "Prenatal Genetics",
      "Pediatric Genetics",
      "Cardiovascular Genetics",
      "Rare Diseases",
      "Nuerogenetics",
      "Adult Genetics",
    ],
  };

  return (
    <div style={{ position: "relative" }}>
      <h1 className={styles.title}>Manage Admins</h1>
      <FilterableTable
        data={dummyAdmins}
        columns={columns}
        filters={filters}
        csvFilename="admins.csv"
      />

      {selectedAdmin && (
        <div
          style={{
            position: "fixed",
            top: 0,
            right: 0,
            width: "320px",
            height: "100vh",
            backgroundColor: "#fff",
            boxShadow: "-2px 0 10px rgba(0,0,0,0.1)",
            padding: "1.5rem",
            zIndex: 1000,
            overflowY: "auto",
          }}
        >
          <button
            onClick={() => setSelectedAdmin(null)}
            style={{
              position: "absolute",
              top: "10px",
              right: "10px",
              background: "transparent",
              border: "none",
              fontSize: "1.2rem",
              cursor: "pointer",
            }}
          >
            ✕
          </button>
          <h2>Admin Info</h2>
          <p><strong>Name:</strong> {selectedAdmin.name}</p>
          <p><strong>Title:</strong> {selectedAdmin.Title}</p>
          <p><strong>Membership:</strong> {selectedAdmin.Membership}</p>
          <p><strong>Country:</strong> {selectedAdmin.Location.Country}</p>
          <p><strong>Languages:</strong> {selectedAdmin.Languages.join(", ")}</p>
          <p><strong>Services:</strong> {selectedAdmin.Services.join(", ")}</p>
        </div>
      )}
    </div>
  );
};

export default ManageAdmin;
