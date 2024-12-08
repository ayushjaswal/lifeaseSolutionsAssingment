import mongoose, { model, Schema } from "mongoose";

const teamSchema = new Schema(
  {
    teamName: { type: String, required: true },
    players: [{ type: Schema.Types.ObjectId, ref: "player" }],
    teamFlag: { type: String, required: true}
  },
  { timestamps: true }
);

const team = model("team", teamSchema);

export default team;
