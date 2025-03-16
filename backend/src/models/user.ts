import { InferSchemaType, Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    firebaseId: { type: String, required: true },

    account: {
      type: { type: String, enum: ["superadmin", "admin", "counselor", "student"], required: true },
      inDirectory: { type: Boolean, required: true },
      profilePicture: { type: String, default: "" },
      // can they have multiple memberships?
      membership: {
        type: String,
        enum: ["student", "geneticCounselor", "healthcareProvider", "associate"],
        required: true,
      },
    },

    personal: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String },
    },

    professional: {
      title: { type: String },
      prefLanguages: [{ type: String, enum: ["english", "spanish", "portuguese", "other"] }],
      otherPrefLanguages: { type: String },
      country: { type: String },
    },

    education: {
      degree: { type: String, enum: ["masters", "diploma", "fellowship", "md", "phd", "other"] },
      program: { type: String },
      otherDegree: { type: String, default: "" },
      institution: { type: String },
      email: { type: String },
      gradDate: { type: String },
    },

    clinic: {
      name: { type: String },
      url: { type: String },
      location: {
        country: { type: String },
        address: { type: String },
        suite: { type: String },
      },
    },

    display: {
      workEmail: { type: String },
      workPhone: { type: String },

      // I feel like this should not be hard-coded? Like we should have a single list elsewhere
      services: [
        {
          type: String,
          enum: [
            "pediatrics",
            "cardiovascular",
            "neurogenetics",
            "rareDiseases",
            "cancer",
            "biochemical",
            "prenatal",
            "adult",
            "psychiatric",
            "reproductive",
            "ophthalmic",
            "research",
            "pharmacogenomics",
            "metabolic",
            "other",
          ],
        },
      ],

      languages: [{ type: String, enum: ["english", "spanish", "portuguese", "other"] }],
      license: [{ type: String }],

      options: {
        openToAppointments: { type: Boolean, default: false },
        openToRequests: { type: Boolean, default: false },
        remote: { type: Boolean, default: false },
      },

      comments: {
        noLicense: { type: String },
        additional: { type: String },
      },
    },
  },

  { timestamps: true },
);

type User = InferSchemaType<typeof userSchema>;

export default model<User>("User", userSchema);
