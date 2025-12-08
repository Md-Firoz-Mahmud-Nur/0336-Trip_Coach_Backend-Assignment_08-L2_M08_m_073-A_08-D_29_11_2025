import Stripe from "stripe";
import { envVariables } from "../../config/env";

const stripeSecretKey = envVariables.STRIPE_SECRET_KEY;

export const stripe = new Stripe(stripeSecretKey, {
  apiVersion: "2025-11-17.clover",
});
