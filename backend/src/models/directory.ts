import { InferSchemaType, Schema, model } from "mongoose";

const directorySchema = new Schema(
  {
    userIds: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true },
);

type Directory = InferSchemaType<typeof directorySchema>;

export default model<Directory>("Directory", directorySchema);
