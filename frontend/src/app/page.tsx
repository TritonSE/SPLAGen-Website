"use client";
// import React, { useContext } from "react";

// import { UserContext } from "@/contexts/userContext";
import "./dashboard.css";

export default function Dashboard() {
  // const { user } = useContext(UserContext);
  return (
    <div className="dash">
      <h1 className="title"> Dashboard </h1>
      <div className="resources">
        <h2 className="resourcesH2">Resources</h2>
        <div className="resourceCards">
          <a
            href="https://drive.google.com/drive/folders/1yv2D8KsLlUgcRScUS86G_DOOzUiXM3ln?usp=drive_link"
            target="_blank"
            className="resourceCard"
          >
            <div className="cardInfo">
              <img src="/images/educational.svg" alt="educationIcon"></img>
              <div className="cardText">
                <h3 className="cardTitle">Educational</h3>
                <p className="cardDescription">This is a description of education.</p>
              </div>
            </div>
            <span className="rectangle"></span>
          </a>
          <a
            href="https://drive.google.com/drive/folders/1Xxd0MRpT-RBxMVUakFr9ykWz6qzitLnX?usp=drive_link"
            target="_blank"
            className="resourceCard"
          >
            <div className="cardInfo">
              <img src="/images/publicPolicy.svg" alt="publicIcon"></img>
              <div className="cardText">
                <h3 className="cardTitle">Public Policy</h3>
                <p className="cardDescription">This is a description of public policy.</p>
              </div>
            </div>
            <span className="rectangle"></span>
          </a>
          <a
            href="https://drive.google.com/drive/folders/1LJ4UUgTKIUS6Bj8bip0hj2rQBaetzWsb"
            target="_blank"
            className="resourceCard"
          >
            <div className="cardInfo">
              <img src="/images/research.svg" alt="researchIcon"></img>
              <div className="cardText">
                <h3 className="cardTitle">Research</h3>
                <p className="cardDescription">This is a description of research.</p>
              </div>
            </div>
            <span className="rectangle"></span>
          </a>
          <a
            href="https://drive.google.com/drive/folders/1D_0kRA4leoOnFMjdvlF5YMdt1x6KGxjU?usp=drive_link"
            target="_blank"
            className="resourceCard"
          >
            <div className="cardInfo">
              <img src="/images/members.svg" alt="membersIcon"></img>
              <div className="cardText">
                <h3 className="cardTitle">Members</h3>
                <p className="cardDescription">This is a description of members.</p>
              </div>
            </div>
            <span className="rectangle"></span>
          </a>
        </div>
      </div>
      <h2 className="resourcesH2">Recent Announcements</h2>
    </div>
  );
}
