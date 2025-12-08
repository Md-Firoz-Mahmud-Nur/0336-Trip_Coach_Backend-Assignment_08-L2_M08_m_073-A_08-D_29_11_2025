/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from "mongoose";
import { Booking } from "./booking.model";

import { QueryBuilder } from "../../utils/QueryBuilder";
import { Package } from "../package/package.model";
import { bookingSearchableFields } from "./booking.constant";
import { BookingStatus, IBooking, PaymentStatus } from "./booking.interface";

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

const updateBookingStatus = async (id: string, payload: Partial<IBooking>) => {
  const booking = await Booking.findById(id);
  if (!booking) throw new Error("Booking not found.");

  const prevStatus = booking.status;
  const prevPaymentStatus = booking.paymentStatus;

  if (
    payload.status === BookingStatus.CANCELLED &&
    prevStatus !== BookingStatus.CANCELLED
  ) {
    const pkg = await Package.findById(booking.package);
    if (
      pkg &&
      pkg.availableSeats !== undefined &&
      pkg.availableSeats !== null
    ) {
      pkg.availableSeats = (pkg.availableSeats || 0) + (booking.pax || 1);
      await pkg.save();
    }

    if (booking.paymentStatus === PaymentStatus.PAID) {
      booking.paymentStatus = PaymentStatus.REFUNDED;
    }
  }

  if (
    payload.status === BookingStatus.CONFIRMED &&
    prevStatus !== BookingStatus.CONFIRMED
  ) {
  }

  booking.status = (payload.status as BookingStatus) || booking.status;
  if (payload.paymentStatus)
    booking.paymentStatus = payload.paymentStatus as PaymentStatus;
  if ((payload as any).transactionId)
    booking.transactionId = (payload as any).transactionId;
  if ((payload as any).notes) booking.notes = (payload as any).notes;

  await booking.save();
  return booking;
};

const cancelBooking = async (id: string, memberId: string) => {
  const booking = await Booking.findById(id);

  if (!booking) throw new Error("Booking not found.");
  if (booking.member.toString() !== memberId)
    throw new Error("Unauthorized to cancel this booking.");
  if (booking.status === BookingStatus.CANCELLED)
    throw new Error("Booking already cancelled.");

  const pkg = await Package.findById(booking.package);
  if (pkg && pkg.availableSeats !== undefined && pkg.availableSeats !== null) {
    pkg.availableSeats = (pkg.availableSeats || 0) + (booking.pax || 1);
    await pkg.save();
  }

  booking.status = BookingStatus.CANCELLED;

  if (booking.paymentStatus === PaymentStatus.PAID)
    booking.paymentStatus = PaymentStatus.REFUNDED;

  await booking.save();
  return booking;
};

export const BookingService = {
  createBooking,
  getAllBookings,
  getSingleBooking,
  getMyBooking,
  updateBookingStatus,
  cancelBooking,
};
