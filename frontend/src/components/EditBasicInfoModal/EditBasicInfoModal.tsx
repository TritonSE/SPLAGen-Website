"use client";

import React, { useState } from "react";
import "./EditBasicInfoModal.css";

// Add onSubmit prop
const EditBasicInfoModal = ({
  isOpen,
  onClose,
  onSubmit,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { firstName: string; lastName: string; email: string; phone: string }) => void;
}) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  // Modify handleSave to use onSubmit from parent
  const handleSave = () => {
    const data = { firstName, lastName, email, phone };
    onSubmit(data); // Call onSubmit with the form data
    onClose(); // Close the modal after submitting
  };

  return isOpen ? (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>Edit Basic Info</h2>
          <button
            className="close-button"
            onClick={() => {
              onClose();
            }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg">
              <line x1="0" y1="0" x2="14" y2="14" stroke="#000000" strokeWidth="1.5" />
              <line x1="14" y1="0" x2="0" y2="14" stroke="#000000" strokeWidth="1.5" />
            </svg>
          </button>
        </div>
        <div className="modal-body">
          <div className="first-name-group">
            <label>First Name*</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => {
                setFirstName(e.target.value);
              }}
              placeholder="First Name"
            />
          </div>
          <div className="last-name-group">
            <label>Last Name*</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => {
                setLastName(e.target.value);
              }}
              placeholder="Last Name"
            />
          </div>
          <div className="email-group">
            <label>Email*</label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              placeholder="Email"
            />
          </div>
          <div className="phone-group">
            <label>Phone*</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
              }}
              placeholder="Phone"
            />
          </div>
        </div>
        <div className="modal-footer">
          <button onClick={handleSave}>
            <span>Save</span>
          </button>
        </div>
      </div>
    </div>
  ) : null;
};

export default EditBasicInfoModal;
