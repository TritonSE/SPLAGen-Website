import { InferSchemaType, Schema, model } from "mongoose";

const announcementSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, required: true },
    title: { type: String, required: true },
    recipients: {
      type: Schema.Types.Mixed, // Allows either a string or an array
      required: true,
      default: "everyone",
      validate: {
        validator: function (value: "everyone" | string[]) {
          if (typeof value === "string") {
            return value === "everyone";
          }
          if (Array.isArray(value)) {
            return value.every(
              (email) => typeof email === "string" && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email),
            );
          }
          return false;
        },
        message: "Channel must be 'everyone' or an array of valid email addresses.",
      },
    },
    message: { type: String, required: true },
  },
  // files: [{ type: String }],
  // commentsAllowed: { type: Boolean, required: true },
  // comments: [{ type: Schema.Types.ObjectId, ref: "AnnouncementComment" }],
  { timestamps: true },
);

type Announcement = InferSchemaType<typeof announcementSchema>;

export default model<Announcement>("Announcement", announcementSchema);
