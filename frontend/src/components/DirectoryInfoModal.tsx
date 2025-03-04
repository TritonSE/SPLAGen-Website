import React, { useCallback } from "react"; // React should be first
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"; // Move before local imports
import { z } from "zod";
import "./DirectoryInfoModal.css";

// Define validation schema using Zod
const directoryInfoSchema = z.object({
  degree: z.string().min(3, "Degree must be at least 3 characters"),
  institution: z.string().min(3, "Institution must be at least 3 characters"),
  clinic: z.string().optional(),
  website: z.string().url("Invalid website URL").optional(),
  country: z.string().nonempty("Country is required"),
  addressLine: z.string().min(3, "Address must be at least 3 characters").optional(),
  apartment: z.string().optional(),
  city: z.string().min(2, "City must be at least 2 characters").optional(),
  state: z.string().min(2, "State must be at least 2 characters").optional(),
  postcode: z
    .string()
    .min(3, "Postcode must be at least 3 characters")
    .max(10, "Postcode must be at most 10 characters"),
});

type DirectoryInfoFormData = z.infer<typeof directoryInfoSchema>;

type DirectoryInfoModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: DirectoryInfoFormData) => Promise<void>; // Ensuring async handling
};

const DirectoryInfoModal: React.FC<DirectoryInfoModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<DirectoryInfoFormData>({
    resolver: zodResolver(directoryInfoSchema),
  });

  const handleFormSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault(); // Prevent default form behavior

      void handleSubmit(async (data) => {
        try {
          await onSubmit(data); // Ensure async handling
          reset();
          onClose();
        } catch (error) {
          console.error("Error submitting form:", error);
        }
      })();
    },
    [onSubmit, reset, onClose, handleSubmit],
  );

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
        <h2>Edit Directory Info</h2>
        <form onSubmit={handleFormSubmit}>
          <div className="form-group">
            <label htmlFor="degree">Degree/Certification</label>
            <input
              id="degree"
              {...register("degree")}
              placeholder="e.g. Master's Degree"
              required
            />
            <p className="error-message">{errors.degree?.message ?? ""}</p>
          </div>

          <div className="form-group">
            <label htmlFor="institution">Institution</label>
            <input
              id="institution"
              {...register("institution")}
              placeholder="e.g. UC San Diego"
              required
            />
            <p className="error-message">{errors.institution?.message ?? ""}</p>
          </div>

          <div className="form-group">
            <label htmlFor="website">Clinic Website Link</label>
            <input id="website" {...register("website")} placeholder="Website URL" />
            <p className="error-message">{errors.website?.message ?? ""}</p>
          </div>

          <label htmlFor="country">Country</label>
          <div className="form-group">
            <select id="country" {...register("country")}>
              <option value="" disabled>
                Country...
              </option>
              {[
                "USA",
                "Canada",
                "India",
                "Mexico",
                "Brazil",
                "UK",
                "Australia",
                "Germany",
                "France",
                "Italy",
                "Japan",
                "China",
                "South Korea",
              ].map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <p className="error-message">{errors.country?.message ?? ""}</p>
          </div>

          <div className="form-group">
            <input id="addressLine" {...register("addressLine")} placeholder="Address Line" />
          </div>

          <div className="form-group">
            <input id="apartment" {...register("apartment")} placeholder="Apartment, suite, etc." />
          </div>

          <div className="city-state-postcode">
            <div className="form-group">
              <input id="city" {...register("city")} placeholder="City" />
            </div>
            <div className="form-group">
              <input id="state" {...register("state")} placeholder="State" />
            </div>
            <div className="form-group">
              <input id="postcode" {...register("postcode")} placeholder="Postcode" required />
              <p className="error-message">{errors.postcode?.message ?? ""}</p>
            </div>
          </div>

          <div className="modal-actions">
            <button type="submit" className="save-button">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DirectoryInfoModal;
