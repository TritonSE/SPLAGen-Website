import React, { useState } from "react";
import { z } from "zod";
import "./DirectoryInfoModal.css";

// eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
const directoryInfoSchema = z.object({
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
  degree: z.string().min(3, "Degree must be at least 3 characters"),
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
  institution: z.string().min(3, "Institution must be at least 3 characters"),
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
  clinic: z.string().optional(),
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
  website: z.string().url("Invalid website URL").optional(),
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
  country: z.string().nonempty("Country is required"),
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
  addressLine: z.string().optional(),
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
  apartment: z.string().optional(),
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
  city: z.string().optional(),
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
  state: z.string().optional(),
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
  postcode: z.string().min(5, "Postcode must be at least 5 characters"),
});

interface DirectoryInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    degree: string;
    institution: string;
    clinic: string;
    website: string;
    country: string;
    addressLine: string;
    apartment: string;
    city: string;
    state: string;
    postcode: string;
  }) => void;
}

const DirectoryInfoModal: React.FC<DirectoryInfoModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [degree, setDegree] = useState<string>("");
  const [institution, setInstitution] = useState<string>("");
  const [clinic, setClinic] = useState<string>("");
  const [website, setWebsiteLink] = useState<string>("");
  const [country, setCountry] = useState<string>("");
  const [addressLine, setAddressLine] = useState<string>("");
  const [apartment, setApartment] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [state, setState] = useState<string>("");
  const [postcode, setPostcode] = useState<string>("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCountry(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const result = directoryInfoSchema.safeParse({
      degree,
      institution,
      clinic,
      website,
      country,
      addressLine,
      apartment,
      city,
      state,
      postcode,
    });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (!result.success) {
      // Extract error messages from validation result
      const fieldErrors: Record<string, string> = {};
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      for (const [key, value] of Object.entries(result.error.format())) {
        if (value && "_errors" in value) {
          fieldErrors[key] = value._errors[0];
        }
      }
      setErrors(fieldErrors);
      return;
    }

    // Clear errors on successful validation
    setErrors({});

    onSubmit({
      degree,
      institution,
      clinic,
      website,
      country,
      addressLine,
      apartment,
      city,
      state,
      postcode,
    });
    setDegree("");
    setInstitution("");
    setClinic("");
    setWebsiteLink("");
    setCountry("");
    setAddressLine("");
    setApartment("");
    setCity("");
    setState("");
    setPostcode("");

    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
        <h2>Edit Directory Info</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="degree-title">Degree/Certification</label>
            <input
              id="degree-title"
              type="text"
              value={degree}
              onChange={(e) => {
                setDegree(e.target.value);
              }}
              placeholder="e.g. Master's Degree in Genetic Counceling"
              required
            />
            {errors.degree && <p className="error-message">{errors.degree}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="institution-title">Insitution of Education</label>
            <input
              id="institution-title"
              type="text"
              value={institution}
              onChange={(e) => {
                setInstitution(e.target.value);
              }}
              placeholder="e.g. University of California, San Diego"
              required
            />
            {errors.institution && <p className="error-message">{errors.institution}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="website-title">Clinic Website Link</label>
            <input
              id="website-title"
              type="text"
              value={website}
              onChange={(e) => {
                setInstitution(e.target.value);
              }}
              placeholder="Phone"
              required
            />
            {errors.website && <p className="error-message">{errors.website}</p>}
          </div>
          <label htmlFor="address-title">Address of clinic</label>
          <div className="form-group">
            <select
              value={country}
              onChange={handleCountryChange}
              className={country ? "country-selected" : ""}
            >
              <option value="" disabled>
                Country...
              </option>
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
            {errors.country && <p className="error-message">{errors.country}</p>}
          </div>
          <div className="form-group">
            <input
              id="address-title"
              type="text"
              value={addressLine}
              onChange={(e) => {
                setAddressLine(e.target.value);
              }}
              placeholder="Address Line"
            />
          </div>
          <div className="form-group">
            <input
              id="apartment-title"
              type="text"
              value={apartment}
              onChange={(e) => {
                setApartment(e.target.value);
              }}
              placeholder="Apartment, suite, etc."
            />
          </div>
          <div className="city-state-postcode">
            <div className="form-group">
              <input
                id="city-title"
                type="text"
                value={city}
                onChange={(e) => {
                  setCity(e.target.value);
                }}
                placeholder="City"
              />
            </div>
            <div className="form-group">
              <input
                id="state-title"
                type="text"
                value={state}
                onChange={(e) => {
                  setState(e.target.value);
                }}
                placeholder="State"
              />
            </div>
            <div className="form-group">
              <input
                id="postcode-title"
                type="text"
                value={postcode}
                onChange={(e) => {
                  setPostcode(e.target.value);
                }}
                placeholder="Postcode"
                required
              />
              {errors.postcode && <p className="error-message">{errors.postcode}</p>}
            </div>
          </div>
          <div className="modal-actions">
            <button
              type="button"
              className="save-button"
              onClick={() => {
                console.log("Saved!");
              }}
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DirectoryInfoModal;
