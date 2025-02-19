import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

import ExitButton from "../../public/Icons/ExitButton.svg";
import "./EditBasicInfoModal.css";
import { editBasicInfoRequest } from "../api/requests";

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

if (!API_BASE_URL) {
  throw new Error("API_BASE_URL is not defined in the environment variables.");
}

const ExitButtonSrc: string = ExitButton as unknown as string;

type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
};

const schema = z.object({
  firstName: z.string().min(1, "First Name is required"),
  lastName: z.string().min(1, "Last Name is required"),
  email: z.string().min(1, "Email is required").email("Invalid email format"),
  phone: z
    .string()
    .min(1, "Phone Number is required")
    .refine((val) => val.length >= 5 && val.length <= 15, {
      message: "Invalid phone number format",
    }),
});

export const EditBasicInfoModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      const response = await editBasicInfoRequest(
        "POST",
        `${API_BASE_URL}/users/personal-information`,
        data,
        {},
      );
      if (response.ok) {
        onClose();
      }
    } catch (error) {
      console.error("Request failed:", error);
    }
  };

  return isOpen ? (
    <div className="modal-overlay">
      <div className="modal-container">
        <button className="close-button" onClick={onClose}>
          <Image src={ExitButtonSrc} alt="Exit" />
        </button>
        <div className="modal-header">
          <h2> Edit Basic Info</h2>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void handleSubmit(onSubmit)(e);
          }}
          className="modal-body"
        >
          <div className="inputField">
            <label>First Name*</label>
            <input {...register("firstName")} placeholder="First Name" />
            {errors.firstName?.message && typeof errors.firstName.message === "string" && (
              <p className="error">{errors.firstName.message}</p>
            )}
          </div>

          <div className="inputField">
            <label>Last Name*</label>
            <input {...register("lastName")} placeholder="Last Name" />
            {errors.lastName?.message && typeof errors.lastName.message === "string" && (
              <p className="error">{errors.lastName.message}</p>
            )}
          </div>

          <div className="inputField">
            <label>Email*</label>
            <input type="email" {...register("email")} placeholder="Email" />
            {errors.email?.message && typeof errors.email.message === "string" && (
              <p className="error">{errors.email.message}</p>
            )}
          </div>

          <div className="inputField">
            <label>Phone*</label>
            <input type="tel" {...register("phone")} placeholder="Phone" />
            {errors.phone?.message && typeof errors.phone.message === "string" && (
              <p className="error">{errors.phone.message}</p>
            )}
          </div>

          <div className="modal-footer">
            <button type="submit">
              <span>Save</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  ) : null;
};
