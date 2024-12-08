import mongoose, { model, Schema } from "mongoose";

const adminSchema = new Schema(
  {
    username: { type: String, required: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

const admin = model("admin", adminSchema);

export default admin;
