import { Types } from "mongoose";

export enum UserRole {
  ADMIN = "ADMIN",
  USER = "USER",
  AGENT = "AGENT",
}

export interface IAuthProvider {
  provider: string;
  providerId: string;
}

export enum AccountStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  BLOCKED = "BLOCKED",
  DELETED = "DELETED",
}

export interface IUser {
  _id?: Types.ObjectId;

  name: string;
  email: string;
  password?: string;

  phone?: string;
  profileImage?: string;
  address?: string;

  status?: AccountStatus;
  isVerified?: boolean;
  isDeleted?: boolean;

  role: UserRole;
  auths?: IAuthProvider[];

  bookings?: Types.ObjectId[];
  reviews?: Types.ObjectId[];
  wishlist?: Types.ObjectId[];
}
