"use client";

import Image from "next/image";
import { useCallback, useState } from "react";

import { FilterableTable } from "@/components";
import styles from "@/components/FilterableTable.module.css";
import { ProfilePicture } from "@/components/ProfilePicture";
import {
  useRedirectToHomeIfNotSuperAdmin,
  useRedirectToLoginIfNotSignedIn,
} from "@/hooks/useRedirection";

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
  {
    id: 3,
    name: "Water Test",
    email: "water.edu",
    phone: "(000) 000-0000",
    Title: "Genetic Counselor",
    Membership: "Associate Member",
    Education: "Masters",
    Location: {
      Address: "123 Campus Way",
      Hospital: "UC San Diego",
      Country: "Brazil",
    },
    Languages: ["English", "Portuguese"],
    Services: ["Pediatric Genetics"],
    Joined: "03/20/2023",
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
  useRedirectToLoginIfNotSignedIn();
  useRedirectToHomeIfNotSuperAdmin();

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [invitedName, setInvitedName] = useState<string | null>(null);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

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
          <button
            className={styles["action-button"]}
            onClick={() => {
              setIsInviteModalOpen(true);
            }}
          >
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
      {/* Invite Modal */}
      {isInviteModalOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.4)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: "#fff",
              padding: "2rem",
              borderRadius: "10px",
              width: "500px",
              maxHeight: "80vh",
              overflowY: "auto",
            }}
          >
            <h2 style={{ marginBottom: "1rem" }}>Invite Admins</h2>
            <input
              placeholder="Search Counselors"
              style={{
                width: "100%",
                padding: "0.5rem",
                marginBottom: "1rem",
                borderRadius: "6px",
                border: "1px solid #ccc",
              }}
            />
            {dummyAdmins
              .filter((a) => a.Membership !== "Admin")
              .map((person) => (
                <div
                  key={person.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "1rem",
                    borderBottom: "1px solid #eee",
                    paddingBottom: "0.5rem",
                  }}
                >
                  <div>
                    <strong>{person.name}</strong>
                    <div style={{ fontSize: "0.85rem", color: "#555" }}>{person.email}</div>
                  </div>
                  <button
                    onClick={() => {
                      setIsInviteModalOpen(false);
                      setInvitedName(person.name);
                    }}
                    style={{
                      background: "#2B1D53",
                      color: "#fff",
                      borderRadius: "5px",
                      padding: "0.5rem 1rem",
                      border: "none",
                    }}
                  >
                    Invite
                  </button>
                </div>
              ))}
            <button
              onClick={() => {
                setIsInviteModalOpen(false);
              }}
              style={{
                background: "#ccc",
                padding: "0.4rem 1rem",
                borderRadius: "5px",
                marginTop: "1rem",
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {invitedName && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1001,
          }}
        >
          <div
            style={{
              background: "#fff",
              padding: "2rem",
              borderRadius: "10px",
              width: "400px",
              textAlign: "center",
            }}
          >
            <p>
              Invite <strong>{invitedName}</strong> to be an admin?
            </p>
            <p style={{ fontSize: "0.85rem", marginBottom: "1rem" }}>
              They’ll have access to manage counselors, create announcements, and moderate
              discussions.
            </p>
            <button
              onClick={() => {
                setInvitedName(null);
              }}
              style={{ marginRight: "1rem" }}
            >
              Cancel
            </button>
            <button
              onClick={() => {
                setInvitedName(null);
                setShowSuccessToast(true);
                setTimeout(() => {
                  setShowSuccessToast(false);
                }, 3000);
              }}
              style={{
                backgroundColor: "#2B1D53",
                color: "#fff",
                padding: "0.5rem 1rem",
                borderRadius: "5px",
                border: "none",
              }}
            >
              Send Invite
            </button>
          </div>
        </div>
      )}

      {/* Success Toast */}
      {showSuccessToast && (
        <div
          style={{
            position: "fixed",
            top: "1rem",
            right: "1rem",
            backgroundColor: "#38a169",
            color: "#fff",
            padding: "1rem",
            borderRadius: "8px",
            zIndex: 9999,
          }}
        >
          ✅ Admin has been invited!
        </div>
      )}

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
            <ProfilePicture size="large" letter={selectedAdmin.name} />
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
