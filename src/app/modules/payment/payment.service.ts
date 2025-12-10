/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Payment } from "./payment.model";
import { stripe } from "./stripe.config";

import { Booking } from "../booking/booking.model";

import { Types } from "mongoose";
import AppError from "../../errorHelper/AppError";
import { PaymentStatus } from "./payment.interface";

const createCheckoutSession = async (
  bookingId: string,
  successUrl: string,
  cancelUrl: string
) => {
  console.log("Creating checkout session: ", bookingId);
  const booking = await Booking.findById(bookingId).populate("package");
  if (!booking) throw new AppError(404, "Booking not found");

  console.log("Booking found:", booking);

  if (booking?.paymentStatus === "PAID") {
    throw new AppError(400, "Booking already paid");
  }

  const pkg: any = booking.package;
  const amount = Math.round((booking.totalAmount || 0) * 100);
  const currency = (booking.currency || "USD").toLowerCase();

  const paymentRecord = await Payment.create({
    booking: booking._id,
    amount: booking.totalAmount,
    currency: booking.currency || "USD",
    gateway: "STRIPE",
    status: PaymentStatus.PENDING,
  });

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: currency,
          product_data: {
            name: `Trip Coach Booking For: ${pkg.title || "Service"}`,
            description: pkg.summary || pkg.description || "description",
          },
          unit_amount: amount * 100,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: {
      bookingId: booking._id.toString(),
      paymentId: paymentRecord._id.toString(),
    },
  });

  paymentRecord.gatewaySessionId = session.id;
  await paymentRecord.save();

  return {
    sessionId: session.id,
    url: session.url,
  };
};

const getSinglePaymentAdmin = async (paymentId: string) => {
  if (!Types.ObjectId.isValid(paymentId)) {
    throw new AppError(400, "Invalid payment ID");
  }

  const payment = await Payment.findById(paymentId)
    .populate("member", "name email phone role")
    .populate({
      path: "booking",
      select: "pax status paymentStatus totalAmount",
      populate: {
        path: "package",
        select: "title slug destination costFrom",
      },
    });

  if (!payment) {
    throw new AppError(404, "Payment not found");
  }

  return payment;
};

export const PaymentService = {
  createCheckoutSession,
  getSinglePaymentAdmin,
};
