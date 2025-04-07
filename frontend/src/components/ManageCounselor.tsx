"use client";

import { FilterableTable } from "./FilterableTable";
import styles from "./FilterableTable.module.css";

const dummyData = [
  {
    id: 1,
    name: "John Doe",
    email: "johndoe@example.com",
    phone: "(123) 456-7890",
    Title: "Medical Geneticist", // Capitalized 'title'
    Membership: "Student Member", // Capitalized 'membership'
    Education: "Bachelors", // Capitalized 'education'
    Location: {
      // Capitalized 'location'
      Address: "79664 Eisenlohrstrasse 6, Wehr, Baden-Württemberg", // Capitalized 'address'
      Hospital: "UC San Diego Health", // Capitalized 'hospital'
      Country: "Germany", // Capitalized 'country'
    },
    Languages: ["English", "Spanish"], // Capitalized 'languages'
    Services: ["Pediatric Genetics", "Cancer Genetics"], // Capitalized 'services'
    Joined: "01/12/2025", // Capitalized 'joined'
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
export const ManageCounselor = () => {
  const columns = [
    {
      key: "name",
      label: "NAME",
      render: (row: any) => (
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
      render: (row: any) => (
        <>
          <div>{row.Location.Address}</div>
          <div>{row.Location.Hospital}</div>
          <div>{row.Location.Country}</div>
        </>
      ),
    },
    {
      key: "Languages",
      label: "LANGUAGE",
      render: (row: any) => row.Languages.join(", "),
    },
    {
      key: "Services",
      label: "SERVICE",
      render: (row: any) =>
        row.Services.map((s: string, i: number) => {
          // Generate a class for each service based on its name
          const serviceClass = s.toLowerCase().replace(/\s+/g, "-"); // Converts "Pediatric Genetics" -> "pediatric-genetics"
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
    <FilterableTable
      title="Manage Members"
      data={dummyData}
      columns={columns}
      filters={filters}
      csvFilename="members.csv"
    />
  );
};
