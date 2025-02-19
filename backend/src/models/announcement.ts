import { InferSchemaType, Schema, model } from "mongoose";

const announcementSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, required: true },
    message: {
      title: { type: String, required: true },
      channel: { type: String, required: true, default: "everyone" },
      // text as markdown?
      text: { type: String, required: true },
    },
    //Files should be urls?
    files: [{ type: String }],
    commentsAllowed: { type: Boolean, required: true },
    comments: [{ type: Schema.Types.ObjectId, ref: "AnnouncementComment" }],
  },
  { timestamps: true },
);

type Announcement = InferSchemaType<typeof announcementSchema>;

export default model<Announcement>("Announcement", announcementSchema);
