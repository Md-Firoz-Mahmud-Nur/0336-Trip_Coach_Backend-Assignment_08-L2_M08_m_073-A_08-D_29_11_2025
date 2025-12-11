import { Types } from "mongoose";

export enum Role {
  ADMIN = "ADMIN",
  TOURIST = "TOURIST",
  GUIDE = "GUIDE",
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
  isGuideDocumentSubmit: boolean;

  phone?: string;
  picture?: string;
  address?: string;

  status?: AccountStatus;
  isVerified?: boolean;
  isDeleted?: boolean;
  isBlocked?: boolean;

  role: Role;
  auths?: IAuthProvider[];

  bookings?: Types.ObjectId[];
  reviews?: Types.ObjectId[];
  wishlist?: Types.ObjectId[];
}
