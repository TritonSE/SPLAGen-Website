"use client";
import Image from "next/image";

import { FilterableTable } from "@/components";
import styles from "@/components/FilterableTable.module.css";

type AdminRow = {
  id: number;
  name: string;
  title: string;
  membership: string;
  location: {
    address: string;
    hospital?: string;
    country: string;
  };
  languages: string[];
  services: string[];
};

const dummyAdmins: AdminRow[] = [
  {
    id: 1,
    name: "Alice Brown",
    title: "Program Manager",
    membership: "admin",
    location: {
      address: "123 Admin St",
      country: "United States",
    },
    languages: ["english", "spanish"],
    services: ["cancer genetics", "pediatric genetics"],
  },
  {
    id: 2,
    name: "Bob White",
    title: "Operations Lead",
    membership: "admin",
    location: {
      address: "456 Infra Ln",
      country: "Brazil",
    },
    languages: ["english"],
    services: ["biochemical genetics", "prenatal genetics"],
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
          <div>{row.email}</div>
          <div>{row.phone}</div>
        </>
      ),
    },
    { key: "title", label: "TITLE" },
    { key: "membership", label: "MEMBERSHIP" },
    {
      key: "location",
      label: "LOCATION",
      render: (row: AdminRow) => (
        <>
          <div>
            <Image
              src="/icons/location.svg"
              alt="Location icon"
              width={16}
              height={16}
              className={styles["location-icon"]}
            />
            {row.location.address}
          </div>
          <div>{row.location.hospital}</div>
          <div>{row.location.country}</div>
        </>
      ),
    },
    {
      key: "languages",
      label: "LANGUAGE",
      render: (row: AdminRow) =>
        row.languages.map((lang: string, i: number) => {
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
        row.services.map((s: string, i: number) => {
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
    title: ["Program Manager", "Operations Lead", "Admin Manager", "System Admin"],
    membership: ["superadmin", "admin"],
    location: ["United States", "Brazil", "Canada", "Germany", "Chile"],
    services: [
      "pediatric genetics",
      "cardiovascular genetics",
      "neurogenetics",
      "rare diseases",
      "cancer genetics",
      "biochemical genetics",
      "prenatal genetics",
      "adult genetics",
      "psychiatric genetics",
      "reproductive genetics",
      "ophthalmic genetics",
      "research genetics",
      "pharmacogenomics",
      "metabolic genetics",
      "other genetics",
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

// Helpers
function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function capitalizeWords(str: string) {
  return str.replace(/\b\w/g, (c) => c.toUpperCase());
}
