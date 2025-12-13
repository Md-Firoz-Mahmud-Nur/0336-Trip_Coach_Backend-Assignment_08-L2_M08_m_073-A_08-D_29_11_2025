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
  const booking = await Booking.findById(bookingId).populate("package");
  if (!booking) throw new AppError(404, "Booking not found");

  if (booking.paymentStatus === "PAID") {
    throw new AppError(400, "Booking already paid");
  }

  const pkg: any = booking.package;

  // booking.totalAmount is in BDT; convert to USD (example rate)
  const amountBdt = booking.totalAmount || 0;
  const usdRate = 127; // 1 USD = 127 BDT (example, you should pull from config/API)
  const amountUsd = amountBdt / usdRate;

  // Stripe expects smallest unit: cents for usd
  const unitAmount = Math.round(amountUsd * 100);

  const paymentRecord = await Payment.create({
    booking: booking._id,
    amount: amountBdt, // keep original BDT amount in DB
    currency: "BDT", // your app's currency
    gateway: "STRIPE",
    status: PaymentStatus.PENDING,
  });

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd", // force USD
          product_data: {
            name: `Trip Coach Booking For: ${pkg.title || "Service"}`,
            description: pkg.summary || pkg.description || "description",
          },
          unit_amount: unitAmount, // e.g. 210 BDT -> ~1.65 USD -> 165
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
      appCurrency: "BDT",
      appAmount: amountBdt.toString(),
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
