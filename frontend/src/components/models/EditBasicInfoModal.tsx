"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import React, { useCallback } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

// import { UserContext } from "@/contexts/userContext";
import ExitButton from "@/../public/Icons/ExitButton.svg";
import "./EditBasicInfoModal.css";
import { editBasicInfoRequest } from "@/api/users";

const ExitButtonSrc: string = ExitButton as unknown as string;

type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
};

//Source: https://gist.github.com/jacurtis/ccb9ad32664d3b894c12
//eslint-disable-next-line
const phoneRegex = /\+?([\d|\(][\h|\(\d{3}\)|\.|\-|\d]{4,}\d)/;

const schema = z.object({
  firstName: z.string().min(1, "First Name is required"),
  lastName: z.string().min(1, "Last Name is required"),
  email: z.string().min(1, "Email is required").email("Invalid email format"),
  phone: z
    .string()
    .min(7, "Phone number must be at least 7 characters")
    .max(15, "Phone number must be at most 15 characters")
    .regex(phoneRegex, "Invalid phone number format"),
});

// Function to normalize phone numbers before sending them
const normalizePhoneNumber = (phone: string) => {
  return phone.replace(/[-.\s()]/g, ""); // Remove spaces, dashes, dots, and parentheses
};

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

  // const { firebaseUser } = useContext(UserContext);

  const onSubmit = useCallback<SubmitHandler<FormData>>(
    async (data) => {
      const formattedData = {
        ...data,
        phone: normalizePhoneNumber(data.phone),
      };

      // const firebaseToken = await firebaseUser?.getIdToken();
      // if (!firebaseToken || editingItemId === null) {
      //  //TODO Error handling?
      //   return;
      // }

      const response = await editBasicInfoRequest(formattedData, "firebaseToken");
      if (response.success) {
        onClose();
      }
      //TODO: else error handling? PAP's notifications?
    },
    [onClose],
  );

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
            <p className="error">
              {errors.firstName?.message && typeof errors.firstName.message === "string"
                ? errors.firstName.message
                : "\u00A0"}
            </p>
          </div>

          <div className="inputField">
            <label>Last Name*</label>
            <input {...register("lastName")} placeholder="Last Name" />
            <p className="error">
              {errors.lastName?.message && typeof errors.lastName.message === "string"
                ? errors.lastName.message
                : "\u00A0"}
            </p>
          </div>

          <div className="inputField">
            <label>Email*</label>
            <input type="email" {...register("email")} placeholder="Email" />
            <p className="error">
              {errors.email?.message && typeof errors.email.message === "string"
                ? errors.email.message
                : "\u00A0"}
            </p>
          </div>

          <div className="inputField">
            <label>Phone*</label>
            <input type="tel" {...register("phone")} placeholder="Phone" />
            <p className="error">
              {errors.phone?.message && typeof errors.phone.message === "string"
                ? errors.phone.message
                : "\u00A0"}
            </p>
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
