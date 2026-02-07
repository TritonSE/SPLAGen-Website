import { InferSchemaType, Schema, model } from "mongoose";

export const VALID_LANGUAGES = ["english", "spanish", "portuguese", "other"];

export const validateRecipients = (value: string[]) => {
  if (!Array.isArray(value)) return false;

  return value.every((recipient) => {
    if (typeof recipient !== "string") return false;

    // Check if it's "everyone"
    if (recipient === "everyone") return true;

    // Check if it's a language target (e.g., "language:english")
    if (recipient.startsWith("language:")) {
      const language = recipient.substring("language:".length); // Remove "language:" prefix
      return VALID_LANGUAGES.includes(language);
    }

    // Check if it's a valid email
    return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(recipient);
  });
};

const announcementSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    recipients: {
      type: [String],
      required: true,
      default: ["everyone"],
      validate: {
        validator: validateRecipients,
        message: "Recipients must be 'everyone' or an array of valid email addresses.",
      },
    },
    message: { type: String, required: true },
  },
  // files: [{ type: String }],
  // commentsAllowed: { type: Boolean, required: true },
  // comments: [{ type: Schema.Types.ObjectId, ref: "AnnouncementComment" }],
  { timestamps: true },
);

announcementSchema.index({
  title: "text",
  message: "text",
});

export type Announcement = InferSchemaType<typeof announcementSchema> & {
  recipients: string | string[];
};

export default model<Announcement>("Announcement", announcementSchema);
