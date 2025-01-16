import { InferSchemaType, Schema, model } from "mongoose";

const replySchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    postId: {
      type: Schema.Types.ObjectId,
      ref: "DiscussionPost",
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

type Reply = InferSchemaType<typeof replySchema>;

export default model<Reply>("Reply", replySchema);
