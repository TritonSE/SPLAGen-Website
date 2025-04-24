"use client";

import { FilterableTable } from "@/components";
import styles from "@/components/FilterableTable.module.css";

// Helpers
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
  const columns = [
    {
      key: "name",
      label: "NAME",
      render: (row: AdminRow) => (
        <>
          <div>{row.name}</div>
        </>
      ),
    },
    { key: "Title", label: "TITLE" },
    { key: "Membership", label: "MEMBERSHIP" },
    {
      key: "Location",
      label: "LOCATION",
      render: (row: AdminRow) => (
        <>
          <div>{row.Location.Country}</div>
        </>
      ),
    },
    {
      key: "languages",
      label: "LANGUAGE",
      render: (row: AdminRow) =>
        row.Languages.map((lang: string, i: number) => {
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
        row.Services.map((s: string, i: number) => {
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
    <div>
      <h1 className={styles.title}>Manage Admins</h1>
      <FilterableTable
        data={dummyAdmins}
        columns={columns}
        filters={filters}
        csvFilename="admins.csv"
      />
    </div>
  );
};

export default ManageAdmin;
