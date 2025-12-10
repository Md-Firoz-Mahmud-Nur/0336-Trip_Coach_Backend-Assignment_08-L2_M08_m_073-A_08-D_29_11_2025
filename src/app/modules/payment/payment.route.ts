import express from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { validateRequest } from "../../middlewares/validateRequest";
import { Role } from "../user/user.interface";
import { PaymentController } from "./payment.controller";
import { initPaymentZodSchema } from "./payment.validation";

const router = express.Router();

router.get("/", checkAuth(Role.ADMIN), PaymentController.getPayments);

router.post(
  "/create",
  checkAuth(Role.TOURIST),
  validateRequest(initPaymentZodSchema),
  PaymentController.initStripeCheckout
);

export const paymentRoutes = router;
