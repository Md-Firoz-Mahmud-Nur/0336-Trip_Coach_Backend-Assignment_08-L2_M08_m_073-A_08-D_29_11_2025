/* eslint-disable no-console */
import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { IBooking } from "./booking.interface";
import { BookingService } from "./booking.service";

const createBooking = catchAsync(async (req: Request, res: Response) => {
  const memberId = req.user.userId;
  const payload: IBooking = {
    ...req.body,
    member: memberId,
  } as unknown as IBooking;

  const result = await BookingService.createBooking(payload);
  await result.populate("member", "name email");

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Booking created",
    data: result,
  });
});

export const BookingController = {
  createBooking,
};
