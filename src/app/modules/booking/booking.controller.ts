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

const getAllBookings = catchAsync(async (req: Request, res: Response) => {
  const result = await BookingService.getAllBookings(
    req.query as Record<string, string>
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Bookings retrieved",
    data: result.data,
    meta: result.meta,
  });
});

const getSingleBooking = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await BookingService.getSingleBooking(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Booking retrieved",
    data: result,
  });
});

const getMyBooking = catchAsync(async (req: Request, res: Response) => {
  const memberId = req.user.userId;
  const result = await BookingService.getMyBooking(
    memberId,
    req.query as Record<string, string>
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Tourist bookings retrieved",
    data: result.data,
    meta: result.meta,
  });
});

const updateBookingStatus = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const payload = req.body;
  const result = await BookingService.updateBookingStatus(id, payload);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Booking status updated",
    data: result,
  });
});

export const BookingController = {
  createBooking,
  getAllBookings,
  getSingleBooking,
  getMyBooking,
  updateBookingStatus,
};
