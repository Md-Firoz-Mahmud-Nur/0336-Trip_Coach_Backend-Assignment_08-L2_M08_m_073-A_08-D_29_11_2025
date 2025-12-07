import express from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { validateRequest } from "../../middlewares/validateRequest";
import { Role } from "../user/user.interface";
import { BookingController } from "./booking.controller";
import { createBookingZodSchema } from "./booking.validation";

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

export const bookingRoutes = router;
