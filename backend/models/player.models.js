import mongoose, { model, Schema } from "mongoose";

const playerSchema = new Schema(
  {
    name: { type: String, required: true },
    role: { type: String, required: true },
    format: [{ type: String, required: true }],
  },
  { timestamps: true }
);

const player = model("player", playerSchema);

export default player;
