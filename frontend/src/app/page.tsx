"use client";
// import Image from "next/image";
import React, { useContext, useEffect, useState } from "react";

import styles from "./dashboard.module.css";

import { UserContext } from "@/contexts/userContext";

export default function Dashboard() {
  const { user } = useContext(UserContext);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (user) {
      switch (user.role) {
        case "member":
          break;
        case "admin":
        case "superadmin":
          setIsAdmin(true);
          break;
      }
    }
  }, [user]);

  const resourceCards = [
    {
      href: "https://drive.google.com/drive/folders/1yv2D8KsLlUgcRScUS86G_DOOzUiXM3ln?usp=drive_link",
      imgSrc: "/images/educational.svg",
      imgAlt: "educationIcon",
      title: "Educational",
      description: "Meeting notes, educational materials, and curriculum development resources.",
    },
    {
      href: "https://drive.google.com/drive/folders/1Xxd0MRpT-RBxMVUakFr9ykWz6qzitLnX?usp=drive_link",
      imgSrc: "/images/publicPolicy.svg",
      imgAlt: "publicIcon",
      title: "Public Policy",
      description: "Access meeting notes, review policy statements, and advocacy resources.",
    },
    {
      href: "https://drive.google.com/drive/folders/1LJ4UUgTKIUS6Bj8bip0hj2rQBaetzWsb",
      imgSrc: "/images/research.svg",
      imgAlt: "researchIcon",
      title: "Research",
      description: "Access meeting notes and other research related resources.",
    },
    {
      href: "https://drive.google.com/drive/folders/1D_0kRA4leoOnFMjdvlF5YMdt1x6KGxjU?usp=drive_link",
      imgSrc: "/images/members.svg",
      imgAlt: "membersIcon",
      title: "Members",
      description: "Access meeting notes, marketing materials, and outreach resources.",
    },
  ];

  return (
    <div className={styles.dash}>
      <div className={styles.titleBar}>
        <h1 className={styles.title}> Dashboard </h1>
      </div>
      <div className={styles.content}>
        {isAdmin && (
          <div className={styles.countContainer}>
            <div className={styles.countCard}>
              <div className={styles.countNum}>
                <h1 className={styles.numHeader}>##</h1>
                <h2 className={styles.numSubheader}>Members</h2>
              </div>
              <img src="/Icons/arrow.svg" alt="arrowIcon" />
            </div>
            <div className={styles.countCard}>
              <div className={styles.countNum}>
                <h1 className={styles.numHeader}>##</h1>
                <h2 className={styles.numSubheader}>in Directory</h2>
              </div>
              <img src="/Icons/arrow.svg" alt="arrowIcon" />
            </div>
            <div className={styles.countCard}>
              <div className={styles.countNum}>
                <h1 className={styles.numHeader}>##</h1>
                <h2 className={styles.numSubheader}>Admins</h2>
              </div>
              <img src="/Icons/arrow.svg" alt="arrowIcon" />
            </div>
          </div>
        )}
        <div className={styles.resources}>
          <div className={styles.resourceHeading}>
            <h2 className={styles.resourcesH2}>Resources</h2>
            <span className={styles.numCircle}>
              <p className={styles.cardsNum}>{resourceCards.length}</p>
            </span>
          </div>
          <div className={styles.resourceCards}>
            {resourceCards.map((card, idx) => (
              <a key={idx} href={card.href} target="_blank" className={styles.resourceCard}>
                <div className={styles.cardInfo}>
                  <img src={card.imgSrc} alt={card.imgAlt} />
                  <div className={styles.cardText}>
                    <h3 className={styles.cardTitle}>{card.title}</h3>
                    <p className={styles.cardDescription}>{card.description}</p>
                  </div>
                </div>
                <span className={styles.rectangle}></span>
              </a>
            ))}
          </div>
        </div>
        <h2 className={styles.resourcesH2}>Recent Announcements</h2>
      </div>
    </div>
  );
}
