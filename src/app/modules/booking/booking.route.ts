import express from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { validateRequest } from "../../middlewares/validateRequest";
import { Role } from "../user/user.interface";
import { BookingController } from "./booking.controller";
import {
  createBookingZodSchema,
  updateBookingStatusZodSchema,
} from "./booking.validation";

const router = express.Router();

router.post(
  "/create",
  checkAuth(Role.TOURIST),
  validateRequest(createBookingZodSchema),
  BookingController.createBooking
);

router.get("/", checkAuth(Role.ADMIN), BookingController.getAllBookings);

router.get(
  "/admin/:id",
  checkAuth(Role.ADMIN),
  BookingController.getSingleBooking
);

router.get("/me", checkAuth(Role.TOURIST), BookingController.getMyBooking);

router.patch(
  "/admin/:id/status",
  checkAuth(Role.ADMIN),
  validateRequest(updateBookingStatusZodSchema),
  BookingController.updateBookingStatus
);

router.patch(
  "/me/:id/cancel",
  checkAuth(Role.TOURIST),
  BookingController.cancelBooking
);

export const bookingRoutes = router;
