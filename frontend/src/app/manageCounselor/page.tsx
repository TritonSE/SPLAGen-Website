"use client";
import Image from "next/image";

import { FilterableTable } from "@/components";
import styles from "@/components/FilterableTable.module.css";

type CounselorRow = {
  id: number;
  name: string;
  email: string;
  phone: string;
  Title: string;
  Membership: string;
  Education: string;
  Location: {
    Address: string;
    Hospital: string;
    Country: string;
  };
  Languages: string[];
  Services: string[];
  Joined: string;
};

const dummyData = [
  {
    id: 1,
    name: "John Doe",
    email: "johndoe@example.com",
    phone: "(123) 456-7890",
    Title: "Medical Geneticist",
    Membership: "Student Member",
    Education: "Bachelors",
    Location: {
      Address: "79664 Eisenlohrstrasse 6, Wehr, Baden-Württemberg",
      Hospital: "UC San Diego Health",
      Country: "Germany",
    },
    Languages: ["English", "Spanish"],
    Services: ["Pediatric Genetics", "Cancer Genetics"],
    Joined: "01/12/2025",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "janesmith@example.com",
    phone: "(987) 654-3210",
    Title: "Medical Geneticist",
    Membership: "Health Professional",
    Education: "Bachelors",
    Location: {
      Address: "9500 Gilman Dr, La Jolla, CA 92093",
      Hospital: "UC San Diego Health",
      Country: "United States",
    },
    Languages: ["English"],
    Services: ["Cancer Genetics"],
    Joined: "02/15/2024",
  },
  {
    id: 3,
    name: "Michael Johnson",
    email: "michaelj@example.com",
    phone: "(456) 789-0123",
    Title: "Medical Geneticist",
    Membership: "Associate Member",
    Education: "PHD",
    Location: {
      Address: "405 Hilgard Ave, Los Angeles, CA 90095",
      Hospital: "UCLA Medical Center",
      Country: "United States",
    },
    Languages: ["English", "French"],
    Services: ["Rare Diseases", "Prenatal Genetics"],
    Joined: "03/20/2023",
  },
  {
    id: 4,
    name: "Emily Davis",
    email: "emilyd@example.com",
    phone: "(321) 654-9870",
    Title: "Medical Geneticist",
    Membership: "Health Professional",
    Education: "Masters",
    Location: {
      Address: "405 Hilgard Ave, Los Angeles, CA 90095",
      Hospital: "UCLA Medical Center",
      Country: "United States",
    },
    Languages: ["English", "German"],
    Services: ["Neurogenetics", "Cardiovascular Genetics"],
    Joined: "04/10/2022",
  },
];

const ManageCounselor: React.FC = () => {
  const columns = [
    {
      key: "name",
      label: "NAME",
      render: (row: CounselorRow) => (
        <>
          <div>{row.name}</div>
          <div>{row.email}</div>
          <div>{row.phone}</div>
        </>
      ),
    },
    { key: "Title", label: "TITLE" },
    { key: "Membership", label: "MEMBERSHIP" },
    { key: "Education", label: "EDUCATION" },
    {
      key: "Location",
      label: "LOCATION",
      render: (row: CounselorRow) => (
        <>
          <div>
            <Image
              src="/icons/location.svg"
              alt="Location icon"
              width={16}
              height={16}
              className={styles["location-icon"]}
            />
            {row.Location.Address}
          </div>
          <div>{row.Location.Hospital}</div>
          <div>{row.Location.Country}</div>
        </>
      ),
    },
    {
      key: "Languages",
      label: "LANGUAGE",
      render: (row: CounselorRow) => row.Languages.join(", "),
    },
    {
      key: "Services",
      label: "SERVICE",
      render: (row: CounselorRow) =>
        row.Services.map((s: string, i: number) => {
          const serviceClass = s.toLowerCase().replace(/\s+/g, "-");
          return (
            <span
              key={i}
              className={`${styles["service-tag"]} ${styles[serviceClass] || styles.default}`}
            >
              {s}
            </span>
          );
        }),
    },
    { key: "Joined", label: "JOINED" },
  ];

  const filters = {
    Title: ["Medical Geneticist"],
    Membership: ["Student Member", "Health Professional", "Associate Member", "Genetic Counselor"],
    Education: ["PHD", "Masters", "Bachelors"],
    Location: ["United States", "Venezuela", "Germany", "Brazil", "Spain", "Chile"],
    Services: [
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
      <h1 className={styles.title}>Manage Members</h1>
      <FilterableTable<CounselorRow>
        data={dummyData}
        columns={columns}
        filters={filters}
        csvFilename="members.csv"
      />
    </div>
  );
};

export default ManageCounselor;
