"use client";

import React, { useState } from "react";
import "./ManageCounselor.css";

const dummyData = [
  {
    id: 1,
    name: "John Doe",
    email: "johndoe@example.com",
    phone: "(123) 456-7890",
    title: "Adult Genetics",
    membership: "Student Member",
    education: "Bachelors",
    location: { city: "San Diego", university: "University of San Diego", country: "Venezuela" },
    languages: ["English", "Spanish"],
    services: ["Pediatric Genetics", "Genetic Counseling"],
    joined: "01/12/2025",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "janesmith@example.com",
    phone: "(987) 654-3210",
    title: "Prenatal Genetics",
    membership: "Health Professional",
    education: "Bachelors",
    location: { city: "Los Angeles", university: "UCLA", country: "United States" },
    languages: ["English"],
    services: ["Cancer Genetics"],
    joined: "02/15/2024",
  },
  {
    id: 3,
    name: "Michael Johnson",
    email: "michaelj@example.com",
    phone: "(456) 789-0123",
    title: "Cancer Genetics",
    membership: "Associate Member",
    education: "PHD",
    location: { city: "New York", university: "Columbia University", country: "United States" },
    languages: ["English", "French"],
    services: ["Rare Disease Diagnosis", "Prenatal Genetics"],
    joined: "03/20/2023",
  },
  {
    id: 4,
    name: "Emily Davis",
    email: "emilyd@example.com",
    phone: "(321) 654-9870",
    title: "Biochemical Genetics",
    membership: "Health Professional",
    education: "Masters",
    location: { city: "Chicago", university: "University of Mexico", country: "Venezuela" },
    languages: ["English", "German"],
    services: ["Neurogenetics", "Genomic Medicine"],
    joined: "04/10/2022",
  },
];

export const ManageCounselor = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    title: [],
    membership: [],
    education: [],
    location: [],
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState("asc");

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };
  const applyFilters = () => {
    setIsFilterOpen(false);
  };
  const resetFilters = () => {
    setFilters({ title: [], membership: [], education: [], location: [] });
  };

  const handleFilterChange = (category, value) => {
    setFilters((prev) => ({
      ...prev,
      [category]: prev[category].includes(value)
        ? prev[category].filter((v) => v !== value)
        : [...prev[category], value],
    }));
  };

  const handleSortToggle = () => {
    setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc")); // Toggle between 'asc' and 'desc'
  };

  const filteredData = dummyData.filter(
    (counselor) =>
      counselor.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filters.title.length === 0 || filters.title.includes(counselor.title)) &&
      (filters.membership.length === 0 || filters.membership.includes(counselor.membership)) &&
      (filters.education.length === 0 || filters.education.includes(counselor.education)) &&
      (filters.location.length === 0 || filters.location.includes(counselor.location.country)),
  );

  const sortedData = [...filteredData].sort((a, b) => {
    if (sortOrder === "asc") {
      return a.name.localeCompare(b.name); // Ascending order
    } else {
      return b.name.localeCompare(a.name); // Descending order
    }
  });

  const downloadCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "Name,Title,Membership,Education,Location,Languages,Services,Joined\n" +
      sortedData
        .map(
          (counselor) =>
            `${counselor.name},${counselor.title},${counselor.membership},${counselor.education},${counselor.location.country},${counselor.languages.join(",")},${counselor.services.join(",")},${counselor.joined}`,
        )
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "counselors.csv");
    document.body.appendChild(link); // Required for Firefox
    link.click();
    document.body.removeChild(link); // Clean up after download
  };

  return (
    <div className="manage-counselor-container">
      <div className="header">
        <h1 className="title">Manage Counselors</h1>
        <div className="profile-picture">[Profile Picture]</div>
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
        <button className="filter-button" onClick={toggleFilter}>
          Filter By
        </button>
        <button className="sort-button" onClick={handleSortToggle}>
          Sort By
        </button>
        <button className="download-button" onClick={downloadCSV}>
          Download
        </button>
      </div>

      {/* Sidebar Filter */}
      <div className={`filter-sidebar ${isFilterOpen ? "open" : ""}`}>
        <div className="filter-header">
          <h3>Filter By</h3>
          <button className="close-button" onClick={toggleFilter}>
            X
          </button>
        </div>
        {Object.entries({
          Title: ["Adult Genetics", "Prenatal Genetics", "Biochemical Genetics", "Cancer Genetics"],
          Membership: ["Student Member", "Health Professional", "Associate Member"],
          Education: ["PhD", "Masters", "Bachelors"],
          Location: ["United States", "Venezuela"],
        }).map(([category, options]) => (
          <div key={category} className="filter-category">
            <h4>{category}</h4>
            {options.map((option) => (
              <label key={option}>
                <input
                  type="checkbox"
                  checked={filters[category.toLowerCase()]?.includes(option)}
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

      <table className="counselor-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Title</th>
            <th>Membership</th>
            <th>Education</th>
            <th>Location</th>
            <th>Language</th>
            <th>Service</th>
            <th>Joined</th>
          </tr>
        </thead>
        <tbody>
          {sortedData.map((counselor) => (
            <tr key={counselor.id}>
              <td>
                {counselor.name}
                <br />
                <small>{counselor.email}</small>
                <br />
                <small>{counselor.phone}</small>
              </td>
              <td>{counselor.title}</td>
              <td>{counselor.membership}</td>
              <td>{counselor.education}</td>
              <td>{counselor.location.country}</td>
              <td>{counselor.languages.join(", ")}</td>
              <td>{counselor.services.join(", ")}</td>
              <td>{counselor.joined}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
