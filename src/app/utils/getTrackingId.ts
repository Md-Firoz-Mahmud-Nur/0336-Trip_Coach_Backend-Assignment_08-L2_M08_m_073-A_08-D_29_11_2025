import dayjs from "dayjs";
import mongoose from "mongoose";

const trackingIdSchema = new mongoose.Schema(
  {
    date: { type: String, unique: true },
    seq: { type: Number, default: 0 },
  },
  {
    versionKey: false,
  }
);

const TrackingID = mongoose.model("TrackingID", trackingIdSchema);

export const generateTrackingId = async () => {
  const today = dayjs().format("YYYYMMDD");

  const counter = await TrackingID.findOneAndUpdate(
    { date: today },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );

  const seqPadded = String(counter.seq).padStart(6, "0");

  return `TRK-${today}-${seqPadded}`;
};
