import React, { useState } from 'react';
import './ProfessionalInfoModal.css';

const ProfessionalInfoModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [professionalTitle, setProfessionalTitle] = useState('');
  const [country, setCountry] = useState('');
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);

  const toggleLanguage = (language: string) => {
    setSelectedLanguages((prev) => {
      if (prev.includes(language)) {
        return prev.filter((lang) => lang !== language);
      } else {
        return [...prev, language];
      }
    });
  };

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCountry(e.target.value);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
        <h2>Edit Professional Info</h2>
        <form className="modal-form">
          {/* Professional Title */}
          <label>
            Professional Title*
            <input
              type="text"
              placeholder="e.g. Genetic Counselor"
              value={professionalTitle}
              onChange={(e) => {
                setProfessionalTitle(e.target.value);
              }}
            />
          </label>

          {/* Country */}
          <label>
            Country*
            <select 
              value={country} 
              onChange={handleCountryChange} 
              className={country ? 'country-selected' : ''}
            >
              <option value="" disabled>Select...</option>
              <option value="USA">USA</option>
              <option value="Canada">Canada</option>
              <option value="India">India</option>
              <option value="Mexico">Mexico</option>
              <option value="Brazil">Brazil</option>
              <option value="UK">UK</option>
              <option value="Australia">Australia</option>
              <option value="Germany">Germany</option>
              <option value="France">France</option>
              <option value="Italy">Italy</option>
              <option value="Japan">Japan</option>
              <option value="China">China</option>
              <option value="South Korea">South Korea</option>
            </select>
          </label>

          {/* Languages */}
          <label>Languages*</label>
          <div className="language-options">
            {['English', 'Spanish'].map((language) => (
              <button
                type="button"
                key={language}
                className={`language-button ${
                  selectedLanguages.includes(language) ? 'selected' : ''
                }`}
                onClick={() => {
                  toggleLanguage(language);
                }}
              >
                {language}
              </button>
            ))}
          </div>

          {/* SPLAGen Directory */}
          <label>
            SPLAGen Directory*
            <div>Yes</div>
          </label>

          {/* Save Button */}
          <button type="button" className="save-button" onClick={() => {
            console.log('Saved!');
          }}>
            Save
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfessionalInfoModal;
