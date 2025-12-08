import z from "zod";

export const initPaymentZodSchema = z.object({
  bookingId: z.string().min(1, "Booking id is required"),
});

export const stripeWebhookZodSchema = z.object({
  rawBody: z.string(),
  signature: z.string(),
});
