import { InferSchemaType, Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    // Should I add an separate firebaseId field or should we directly link with _id?
    _id: { type: String, required: true },

    account: {
      type: { type: String, enum: ["Admin", "Counselor"], required: true },
      inDirectory: { type: Boolean, required: true },
      profilePicture: { type: String, default: "" },

      // Is membership required for counselors?
      // Should this be an enum, and if so, what are the possible values?
      membership: { type: String, required: true },
    },

    personal: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      email: { type: String, required: true },
    },

    professional: {
      title: { type: String },
      prefLanguages: [{ type: String, enum: ["English", "Spanish"] }],
      country: { type: String },
    },

    education: {
      degree: { type: String },
      institution: { type: String },
    },

    clinic: {
      name: { type: String },
      url: { type: String },
      address: { type: String },
    },

    display: {
      workEmail: { type: String },
      workPhone: { type: String },
      // How to get services enum values?
      services: [{ type: String }],
      languages: [{ type: String, enum: ["English", "Spanish", "Portuguese", "Other"] }],
      license: [{ type: String }],

      options: {
        openToAppointments: { type: Boolean, default: false },
        openToRequests: { type: Boolean, default: false },
        remote: { type: Boolean, default: false },
      },
    },
  },
  { timestamps: true },
);

type User = InferSchemaType<typeof userSchema>;

export default model<User>("User", userSchema);
