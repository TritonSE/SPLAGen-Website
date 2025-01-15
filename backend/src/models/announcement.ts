import { InferSchemaType, Schema, model } from "mongoose";

const announcementSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, required: true },
    message: {
      title: { type: String, required: true },
      channel: { type: String, required: true, default: "everyone" },
      // text as html
      text: { type: String, required: true },
    },
    // How to handle file attachments?
    commentsAllowed: { type: Boolean, required: true },
  },
  { timestamps: true },
);

type Announcement = InferSchemaType<typeof announcementSchema>;

export default model<Announcement>("Announcement", announcementSchema);
