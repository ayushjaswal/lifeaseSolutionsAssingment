import { model, Schema } from "mongoose";

const matchSchema = new Schema(
  {
    innings: [{ type: Schema.Types.ObjectId, required: true, ref: 'inning' }]
  },
  { timestamps: true }
);

const match = model("match", matchSchema);

export default match;
