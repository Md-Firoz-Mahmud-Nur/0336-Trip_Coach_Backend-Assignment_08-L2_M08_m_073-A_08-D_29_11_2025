import { Types } from "mongoose";

export interface IPackageType {
  name: string;
  description?: string;
}

export interface IPackage {
  _id?: Types.ObjectId;
  title: string;
  slug: string;
  summary?: string;
  description?: string;
  images?: string[];
  destination?: string;
  costFrom?: number;
  currency?: string;
  durationDays?: number;
  capacity?: number;
  availableSeats?: number;
  startDate?: Date;
  endDate?: Date;
  departureLocation?: string;
  arrivalLocation?: string;
  included?: string[];
  excluded?: string[];
  amenities?: string[];
  itinerary?: string[];
  minAge?: number;
  maxAge?: number;
  division?: Types.ObjectId;
  packageType?: Types.ObjectId;
  tags?: string[];
  createdAt?: Date;
  updatedAt?: Date;
  isActive?: boolean;
  deleteImages?: string[];
}
