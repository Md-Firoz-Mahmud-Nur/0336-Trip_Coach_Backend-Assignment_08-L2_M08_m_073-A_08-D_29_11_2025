import { Types } from "mongoose";

export enum PaymentStatus {
  PENDING = "PENDING",
  PAID = "PAID",
  FAILED = "FAILED",
  REFUNDED = "REFUNDED",
}

export interface IPayment {
  _id?: Types.ObjectId;
  booking: Types.ObjectId;
  amount: number;
  currency?: string;
  gateway?: string;
  gatewaySessionId?: string;
  gatewayPaymentIntentId?: string;
  status?: PaymentStatus;
  metadata?: Record<string, any>;
  createdAt?: Date;
  updatedAt?: Date;
}
