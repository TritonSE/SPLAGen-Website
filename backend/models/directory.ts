import { InferSchemaType, Schema, model } from "mongoose";

const directorySchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
  },
  { timestamps: true },
);

type Directory = InferSchemaType<typeof directorySchema>;

export default model<Directory>("Directory", directorySchema);
