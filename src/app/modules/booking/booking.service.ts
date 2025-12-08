/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from "mongoose";
import { Booking } from "./booking.model";

import { QueryBuilder } from "../../utils/QueryBuilder";
import { Package } from "../package/package.model";
import { bookingSearchableFields } from "./booking.constant";
import { IBooking } from "./booking.interface";

const createBooking = async (payload: IBooking) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const pkg = await Package.findById(payload.package).session(session);
    if (!pkg) throw new Error("Package not found.");

    if (pkg.availableSeats !== undefined && pkg.availableSeats !== null) {
      if (pkg.availableSeats < (payload.pax || 1)) {
        throw new Error("Not enough available seats for this package.");
      }
      pkg.availableSeats = (pkg.availableSeats || 0) - (payload.pax || 1);
      await pkg.save({ session });
    }

    const booking = await Booking.create([payload], { session });
    await session.commitTransaction();
    session.endSession();

    return booking[0];
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
};

const getAllBookings = async (query: Record<string, string>) => {
  const qb = new QueryBuilder(
    Booking.find()
      .populate("member", "name email")
      .populate("package", "title slug"),
    query
  );

  const bookingsQuery = qb
    .search(bookingSearchableFields)
    .filter()
    .sort()
    .fields()
    .paginate();

  const [data, meta] = await Promise.all([bookingsQuery.build(), qb.getMeta()]);

  return { data, meta };
};

const getSingleBooking = async (id: string) => {
  const booking = await Booking.findById(id)
    .populate("member", "name email phone")
    .populate("package", "title slug costFrom");
  if (!booking) throw new Error("Booking not found.");
  return booking;
};

const getMyBooking = async (
  memberId: string,
  query: Record<string, string>
) => {
  const qb = new QueryBuilder(
    Booking.find({ member: memberId }).populate(
      "package",
      "title slug costFrom"
    ),
    query
  );
  const bookingsQuery = qb
    .search(bookingSearchableFields)
    .filter()
    .sort()
    .fields()
    .paginate();
  const [data, meta] = await Promise.all([bookingsQuery.build(), qb.getMeta()]);
  return { data, meta };
};

export const BookingService = {
  createBooking,
  getAllBookings,
  getSingleBooking,
  getMyBooking,
};
