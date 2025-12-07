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

export const bookingRoutes = router;
