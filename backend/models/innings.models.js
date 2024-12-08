import mongoose, { model, Schema } from "mongoose";

const inningSchema = new Schema(
  {
    overs: { type: Number, required: true, default: 0 },
    battingTeam: { type: Schema.Types.ObjectId, ref: "team", required: true },
    bowlingTeam: { type: Schema.Types.ObjectId, ref: "team", required: true },
    ballRun: [
      {
        ballCom: { type: String },
        striker: { type: Schema.Types.ObjectId, required: true, ref: "player" },
        nonStriker: {
          type: Schema.Types.ObjectId,
          required: true,
          ref: "player",
        },
        bowler: { type: Schema.Types.ObjectId, required: true, ref: "player" },
        runs: { type: Number, required: true, default: 0 },
        extras: { type: Number, required: true, default: 0 },
        wides: { type: Boolean, required: true, default: false },
        byes: { type: Boolean, required: true, default: false },
        freeHit: { type: Boolean, required: true, default: false },
        legbyes: { type: Boolean, required: true, default: false },
        noBall: { type: Boolean, required: true, default: false },
        wickets: { type: Boolean, required: true, default: false },
      },
    ],
    teamScore: { type: Number, required: true, default: 0 },
    wickets: { type: Number, default: 0 },
    match: { type: Schema.Types.ObjectId, ref: "match" },
    inngingsEnded: { type: Boolean, required: true, default: false },
  },
  { timestamps: true }
);

const inning = model("inning", inningSchema);

export default inning;
