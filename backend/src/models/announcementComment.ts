import { InferSchemaType, Schema, model } from "mongoose";

const announcementComment = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, required: true },
    announcementId: { type: Schema.Types.ObjectId, required: true, ref: "Announcement" },
    message: { type: String, required: true },
  },
  { timestamps: true },
);

type AnnouncementComment = InferSchemaType<typeof announcementComment>;

export default model<AnnouncementComment>("AnnouncementComment", announcementComment);
