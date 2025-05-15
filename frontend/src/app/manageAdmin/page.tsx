"use client";

import Image from "next/image";
import { useCallback, useState } from "react";

import { FilterableTable } from "@/components";
import styles from "@/components/FilterableTable.module.css";
import { ProfilePicture } from "@/components/ProfilePicture";

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function capitalizeWords(str: string) {
  return str.replace(/\b\w/g, (c) => c.toUpperCase());
}

type AdminRow = {
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

const dummyAdmins: AdminRow[] = [
  {
    id: 1,
    name: "John Doe",
    email: "johndoe@example.com",
    phone: "(123) 456-7890",
    Title: "Medical Geneticist",
    Membership: "Admin",
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
    Membership: "Admin",
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
];

const InfoItem = ({ icon, label, value }: { icon: string; label: string; value: string }) => (
  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
    <Image src={icon} alt={`${label} icon`} width={18} height={18} />
    <div>
      <span style={{ fontWeight: 500 }}>{label}:</span> {value}
    </div>
  </div>
);

const ManageAdmin: React.FC = () => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const handleRowClick = useCallback((row: AdminRow) => {
    const index = dummyAdmins.findIndex((r) => r.id === row.id);
    if (index !== -1) setSelectedIndex(index);
  }, []);
  /*Moving the popup*/ 
  const handlePrev = () => {
    if (selectedIndex !== null) {
      setSelectedIndex((prev) => {
        if (prev === null) return prev;
        return prev === 0 ? dummyAdmins.length - 1 : prev - 1;
      });
    }
  };

  const handleNext = () => {
    if (selectedIndex !== null) {
      setSelectedIndex((prev) => {
        if (prev === null) return prev;
        return prev === dummyAdmins.length - 1 ? 0 : prev + 1;
      });
    }
  };


  const selectedAdmin = selectedIndex !== null ? dummyAdmins[selectedIndex] : null;

  const columns = [
    {
      key: "name",
      label: "NAME",
      render: (row: AdminRow) => (
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <input
            type="checkbox"
            onClick={(e) => {
              e.stopPropagation();
            }}
            onChange={() => {
              // TODO: Handle checkbox change
            }}
          />
          <span>{row.name}</span>
        </div>
      ),
    },
    {
      key: "Title",
      label: "TITLE",
      render: (row: AdminRow) => <div>{row.Title}</div>,
    },
    {
      key: "Membership",
      label: "MEMBERSHIP",
      render: (row: AdminRow) => <div>{row.Membership}</div>,
    },
    {
      key: "Location",
      label: "LOCATION",
      render: (row: AdminRow) => <div>{row.Location.Country}</div>,
    },
    {
      key: "languages",
      label: "LANGUAGE",
      render: (row: AdminRow) => (
        <div>
          {row.Languages.map((lang, i) => {
            const langClass = lang.toLowerCase().replace(/\s+/g, "-");
            return (
              <span
                key={i}
                className={`${styles["service-tag"]} ${styles[langClass] || styles.default}`}
              >
                {capitalize(lang)}
              </span>
            );
          })}
        </div>
      ),
    },
    {
      key: "services",
      label: "SERVICE",
      render: (row: AdminRow) => (
        <div>
          {row.Services.map((s, i) => {
            const serviceClass = s.toLowerCase().replace(/\s+/g, "-");
            return (
              <span
                key={i}
                className={`${styles["service-tag"]} ${styles[serviceClass] || styles.default}`}
              >
                {capitalizeWords(s)}
              </span>
            );
          })}
        </div>
      ),
    },
  ];

  const filters = {
    Title: ["Medical Geneticist", "Genetic Counselor"],
    Membership: ["SuperAdmin", "Admin"],
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
    <div style={{ position: "relative" }}>
      <h1 className={styles.title}>Manage Admins</h1>

      <FilterableTable
        data={dummyAdmins}
        columns={columns}
        filters={filters}
        csvFilename="admins.csv"
        additionalButton={
          <button className={styles["action-button"]}>
            Invite Admin
            <Image
              src="/icons/plus.svg"
              alt="Plus icon"
              width={16}
              height={16}
              className={styles["button-icon"]}
            />
          </button>
        }
        onRowClick={handleRowClick}
      />

      {selectedAdmin && (
        <div
          style={{
            position: "fixed",
            top: 0,
            right: 0,
            width: "28vw",
            height: "100vh",
            backgroundColor: "#fff",
            boxShadow: "-2px 0 12px rgba(0,0,0,0.1)",
            padding: "2rem",
            zIndex: 1000,
            overflowY: "auto",
          }}
        >
          {/* Close Button */}
          <button
            onClick={() => {
              setSelectedIndex(null);
            }}
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

          {/* Row Navigation */}
          <div
            style={{
              position: "absolute",
              top: "10px",
              left: "10px",
              display: "flex",
              gap: "0.5rem",
              zIndex: 1001,
            }}
          >
            <button
              onClick={handlePrev}
              style={{
                fontSize: "1.2rem",
                background: "transparent",
                border: "none",
                cursor: "pointer",
              }}
            >
              &lt;
            </button>
            <button
              onClick={handleNext}
              style={{
                fontSize: "1.2rem",
                background: "transparent",
                border: "none",
                cursor: "pointer",
              }}
            >
              &gt;
            </button>
          </div>

          {/* Admin Info */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              marginBottom: "2rem",
            }}
          >
            <ProfilePicture size="medium" letter={selectedAdmin.name} />
            <div>
              <h2 style={{ fontSize: "1.2rem", marginBottom: "0.25rem", fontWeight: "bold" }}>
                {selectedAdmin.name}
              </h2>
              <p style={{ color: "#666" }}>{selectedAdmin.Title}</p>
            </div>
          </div>

          <div style={{ borderTop: "1px solid #eee", paddingTop: "1rem" }}>
            <h3 style={{ fontSize: "1rem", marginBottom: "1rem", fontWeight: "bold" }}>
              Contact Information
            </h3>
            <InfoItem icon="/icons/email.svg" label="Email" value={selectedAdmin.email} />
            <InfoItem icon="/icons/phone.svg" label="Phone" value={selectedAdmin.phone} />
          </div>

          <div style={{ borderTop: "1px solid #eee", paddingTop: "1rem", marginTop: "1rem" }}>
            <h3 style={{ fontSize: "1rem", marginBottom: "1rem", fontWeight: "bold" }}>About Me</h3>
            <InfoItem
              icon="/icons/membership.svg"
              label="Membership"
              value={selectedAdmin.Membership}
            />
            <InfoItem icon="/icons/calendar.svg" label="Admin Since" value={selectedAdmin.Joined} />
            <InfoItem
              icon="/icons/services.svg"
              label="Service"
              value={selectedAdmin.Services.join(", ")}
            />
            <InfoItem
              icon="/icons/language.svg"
              label="Language"
              value={selectedAdmin.Languages.join(", ")}
            />
          </div>

          <div style={{ borderTop: "1px solid #eee", paddingTop: "1rem", marginTop: "1rem" }}>
            <h3 style={{ fontSize: "1rem", marginBottom: "1rem", fontWeight: "bold" }}>Location</h3>
            <InfoItem
              icon="/icons/location.svg"
              label="Address"
              value={selectedAdmin.Location.Address}
            />
            <InfoItem
              icon="/icons/hospital.svg"
              label="Hospital"
              value={selectedAdmin.Location.Hospital}
            />
            <InfoItem
              icon="/icons/country.svg"
              label="Country"
              value={selectedAdmin.Location.Country}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageAdmin;
