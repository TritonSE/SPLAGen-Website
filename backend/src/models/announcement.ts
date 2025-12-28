import { InferSchemaType, Schema, model } from "mongoose";

const announcementSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    recipients: {
      type: [String],
      required: true,
      default: ["everyone"],
      validate: {
        validator: function (value: string[]) {
          return (
            Array.isArray(value) &&
            value.every(
              (email) =>
                typeof email === "string" &&
                (email === "everyone" || /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)),
            )
          );
        },
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
