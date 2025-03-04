"use client";

import React, { useState } from "react";
import "./ManageCounselor.css";

const dummyData = [
  {
    id: 1,
    name: "John Doe",
    email: "johndoe@example.com",
    phone: "(123) 456-7890",
    title: "Medical Geneticist",
    membership: "Student Member",
    education: "Bachelors",
    location: {
      address: "79664 Eisenlohrstrasse 6, Wehr, Baden-Württemberg",
      hospital: "UC San Diego Health",
      country: "Germany",
    },
    languages: ["English", "Spanish"],
    services: ["Pediatric Genetics", "Cancer Genetics"],
    joined: "01/12/2025",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "janesmith@example.com",
    phone: "(987) 654-3210",
    title: "Medical Geneticist",
    membership: "Health Professional",
    education: "Bachelors",
    location: {
      address: "9500 Gilman Dr, La Jolla, CA 92093",
      hospital: "UC San Diego Health",
      country: "United States",
    },
    languages: ["English"],
    services: ["Cancer Genetics"],
    joined: "02/15/2024",
  },
  {
    id: 3,
    name: "Michael Johnson",
    email: "michaelj@example.com",
    phone: "(456) 789-0123",
    title: "Medical Geneticist",
    membership: "Associate Member",
    education: "PHD",
    location: {
      address: "405 Hilgard Ave, Los Angeles, CA 90095",
      hospital: "UCLA Medical Center",
      country: "United States",
    },
    languages: ["English", "French"],
    services: ["Rare Diseases", "Prenatal Genetics"],
    joined: "03/20/2023",
  },
  {
    id: 4,
    name: "Emily Davis",
    email: "emilyd@example.com",
    phone: "(321) 654-9870",
    title: "Medical Geneticist",
    membership: "Health Professional",
    education: "Masters",
    location: {
      address: "405 Hilgard Ave, Los Angeles, CA 90095",
      hospital: "UCLA Medical Center",
      country: "United States",
    },
    languages: ["English", "German"],
    services: ["Neurogenetics", "Cardiovascular Genetics"],
    joined: "04/10/2022",
  },
];

export const ManageCounselor = () => {
  // Initialize state with lowercase keys
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    title: [],
    membership: [],
    education: [],
    location: [],
    services: [],
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };
  const applyFilters = () => {
    setIsFilterOpen(false);
  };
  const resetFilters = () => {
    setFilters({
      title: [],
      membership: [],
      education: [],
      location: [],
      services: [],
    });
  };

  const handleFilterChange = (category, value) => {
    setFilters((prev) => ({
      ...prev,
      [category]: Array.isArray(prev[category])
        ? prev[category].includes(value)
          ? prev[category].filter((v) => v !== value)
          : [...prev[category], value]
        : [value],
    }));
  };

  const filteredData = dummyData.filter(
    (counselor) =>
      counselor.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filters.title.length === 0 || filters.title.includes(counselor.title)) &&
      (filters.membership.length === 0 || filters.membership.includes(counselor.membership)) &&
      (filters.education.length === 0 || filters.education.includes(counselor.education)) &&
      (filters.location.length === 0 || filters.location.includes(counselor.location.country)) &&
      (filters.services.length === 0 ||
        counselor.services.some((service) => filters.services.includes(service))),
  );

  const downloadCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "Name,Title,Membership,Education,Location,Languages,Services,Joined\n" +
      filteredData
        .map(
          (counselor) =>
            `${counselor.name},${counselor.title},${counselor.membership},${counselor.education},${counselor.location.country},${counselor.languages.join(
              ",",
            )},${counselor.services.join(",")},${counselor.joined}`,
        )
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "counselors.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="manage-counselor-container">
      <div className="header">
        <h1 className="title">Manage Members</h1>
        <div className="profile-picture">Picture</div>
      </div>
      <div className="controls">
        <div className="search-container">
          <img src="/icons/search.svg" alt="Search" className="search-icon" />
          <input
            type="text"
            placeholder="Search Counselors"
            className="search-bar"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
            }}
          />
        </div>
        <button
          className={`action-button ${isFilterOpen ? "selected" : ""}`}
          onClick={toggleFilter}
        >
          Filter By
          <img src="/icons/filter.svg" alt="Filter" className="button-icon" />
        </button>
        <button className="action-button" onClick={downloadCSV}>
          Download
          <img src="/icons/download.svg" alt="Download" className="button-icon" />
        </button>
      </div>
      <div className="button-container">
        <button className="chooseView-button">All Counselors</button>
        <button className="chooseView-button">Directory</button>
      </div>

      {/* Sidebar Filter */}
      <div className={`filter-sidebar ${isFilterOpen ? "open" : ""}`}>
        <div className="filter-header">
          <h3>Filter By</h3>
          <button onClick={toggleFilter}>
            <img src="/icons/close.svg" className="close-button" />
          </button>
        </div>
        {Object.entries({
          Title: ["Medical Geneticist"],
          Membership: [
            "Student Member",
            "Health Professional",
            "Associate Member",
            "Genetic Counselor",
          ],
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
        }).map(([category, options]) => (
          <div key={category} className="filter-category">
            <h4>{category}</h4>
            {options.map((option) => (
              <label key={option}>
                <input
                  type="checkbox"
                  // Use the lowercased category key consistently (e.g. "title", "services", etc.)
                  checked={filters[category.toLowerCase()]?.includes(option) || false}
                  onChange={() => {
                    handleFilterChange(category.toLowerCase(), option);
                  }}
                />
                {option}
              </label>
            ))}
          </div>
        ))}
        <div className="filter-actions">
          <button onClick={resetFilters}>Reset</button>
          <button onClick={applyFilters}>Apply Filters</button>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="counselor-table">
          <thead>
            <tr>
              <th>NAME</th>
              <th>TITLE</th>
              <th>MEMBERSHIP</th>
              <th>EDUCATION</th>
              <th>LOCATION</th>
              <th>LANGUAGE</th>
              <th>SERVICE</th>
              <th>JOINED</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((counselor) => (
              <tr key={counselor.id}>
                <td>
                  {counselor.name}
                  <br />
                  <div>{counselor.email}</div>
                  <div>{counselor.phone}</div>
                </td>
                <td>{counselor.title}</td>
                <td>{counselor.membership}</td>
                <td>{counselor.education}</td>
                <td>
                  x
                  <div>
                    <div>
                      <img src="/icons/location.svg" alt="Location" className="location-icon" />
                      {counselor.location.address}
                    </div>
                    <div>
                      <img src="/icons/hospital.svg" alt="Hospital" className="location-icon" />
                      {counselor.location.hospital}
                    </div>
                    <div>
                      <img src="/icons/country.svg" alt="Country" className="location-icon" />
                      {counselor.location.country}
                    </div>
                  </div>
                </td>
                <td>{counselor.languages.join(" ")}</td>
                <td>
                  {counselor.services.map((service, index) => (
                    <span
                      key={index}
                      className={`service-tag ${service.toLowerCase().replace(/ /g, "-")}`}
                    >
                      {service}
                    </span>
                  ))}
                </td>
                <td>{counselor.joined}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
