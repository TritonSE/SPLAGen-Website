'use client';

import React, { useState } from 'react';
import './EditBasicInfoModal.css';

const EditBasicInfoModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const handleSave = () => {
    // Handle saving logic
    console.log('Saved:', { firstName, lastName, email, phone });
    onClose();
  };

  return isOpen ? (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>Edit Basic Info</h2>
          <button onClick={() => { onClose(); }}>X</button> {/* Updated to use explicit arrow function */}
        </div>
        <div className="modal-body">
          <div className="form-group">
            <label>First Name*</label>
            <input 
              type="text" 
              value={firstName} 
              onChange={(e) => { setFirstName(e.target.value); }} // Updated to use explicit arrow function
              placeholder="First Name" 
            />
          </div>
          <div className="form-group">
            <label>Last Name*</label>
            <input 
              type="text" 
              value={lastName} 
              onChange={(e) => { setLastName(e.target.value); }} // Updated to use explicit arrow function
              placeholder="Last Name" 
            />
          </div>
          <div className="form-group">
            <label>Email*</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => { setEmail(e.target.value); }} // Updated to use explicit arrow function
              placeholder="Email" 
            />
          </div>
          <div className="form-group">
            <label>Phone*</label>
            <input 
              type="tel" 
              value={phone} 
              onChange={(e) => { setPhone(e.target.value); }} // Updated to use explicit arrow function
              placeholder="Phone" 
            />
          </div>
        </div>
        <div className="modal-footer">
          <button onClick={handleSave}>Save</button>
        </div>
      </div>
    </div>
  ) : null;
};

export default EditBasicInfoModal;
