/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { PaymentService } from "./payment.service";

import { envVariables } from "../../config/env";
import AppError from "../../errorHelper/AppError";
import { Payment } from "./payment.model";

const initStripeCheckout = catchAsync(async (req: Request, res: Response) => {
  const { bookingId } = req.body;
  if (!bookingId) throw new AppError(400, "bookingId is required");

  const successUrl = `${envVariables.STRIPE_SUCCESS_URL}?bookingId=${bookingId}`;
  const cancelUrl = envVariables.STRIPE_CANCEL_URL;

  const result = await PaymentService.createCheckoutSession(
    bookingId,
    successUrl,
    cancelUrl
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Stripe checkout session created",
    data: result,
  });
});

const getPayments = async (req: Request, res: Response) => {
  const payments = await Payment.find().sort({ createdAt: -1 });
  return res.json({
    success: true,
    data: payments,
  });
};

export const PaymentController = {
  initStripeCheckout,
  getPayments,
};
