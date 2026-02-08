import { InferSchemaType, Schema, model } from "mongoose";

const discussionPostSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    subscribedUserIds: {
      type: [Schema.Types.ObjectId],
      ref: "User",
      default: [],
    },
  },
  { timestamps: true },
);

discussionPostSchema.index({
  title: "text",
  message: "text",
});

type DiscussionPost = InferSchemaType<typeof discussionPostSchema>;

export default model<DiscussionPost>("DiscussionPost", discussionPostSchema);
