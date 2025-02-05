import React from "react";
import "./ManageCounselor.css";

const dummyData = [
  {
    id: 1,
    name: "John Doe",
    email: "johndoe@example.com",
    phone: "(123) 456-7890",
    title: "Medical Geneticist",
    membership: "Student Member",
    education: "Diploma",
    location: { city: "San Diego", university: "University of San Diego", country: "USA" },
    languages: ["English", "Spanish"],
    services: ["Pediatric Genetics", "Genetic Counseling"],
    joined: "01/12/2025",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "janesmith@example.com",
    phone: "(987) 654-3210",
    title: "Medical Geneticist",
    membership: "Genetic Counselor",
    education: "Diploma",
    location: { city: "Los Angeles", university: "UCLA", country: "USA" },
    languages: ["English"],
    services: ["Cancer Genetics"],
    joined: "02/15/2024",
  },
];

export const ManageCounselor = () => {
  return (
    <div className="manage-counselor-container">
      <div className="header">
        <h1 className="title">Manage Counselors</h1>
        <div className="profile-picture">[Profile Picture]</div>
      </div>
      <div className="controls">
        <div className="search-container">
          <img src="/icons/search.svg" alt="Search" className="search-icon" />
          <input type="text" placeholder="Search Counselors" className="search-bar" />
        </div>
        <div className="filter-options">
          <button>
            Filter <img src="/icons/filter.svg" alt="Filter" className="icon-right" />
          </button>
          <button>
            Sort By <img src="/icons/sortBy.svg" alt="Sort By" className="icon-right" />
          </button>
          <button>
            Download <img src="/icons/download.svg" alt="Download" className="icon-right" />
          </button>
        </div>
      </div>
      <div className="view-switch">
        <button className="view-switch-btn">All Counselors</button>
        <button className="view-switch-btn">Directory</button>
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
          {dummyData.map((counselor) => (
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
              <td>
                <div className="icon-text">
                  <img src="/icons/location.svg" alt="Location" className="icon-left" />
                  {counselor.location.city}
                </div>
                <div className="icon-text">
                  <img src="/icons/college.svg" alt="College" className="icon-left" />
                  {counselor.location.university}
                </div>
                <div className="icon-text">
                  <img src="/icons/country.svg" alt="Country" className="icon-left" />
                  {counselor.location.country}
                </div>
              </td>
              <td>
                {counselor.languages.map((lang, index) => (
                  <span key={index} className="language-tag">
                    {lang}
                  </span>
                ))}
              </td>
              <td>
                {counselor.services.map((service, index) => (
                  <span key={index} className="service-tag">
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
  );
};
