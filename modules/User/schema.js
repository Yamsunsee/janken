import mongoose from "mongoose";
const { Schema, model } = mongoose;

const userSchema = new Schema({
  name: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  friends: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  pendingRequests: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

export default model("User", userSchema);
