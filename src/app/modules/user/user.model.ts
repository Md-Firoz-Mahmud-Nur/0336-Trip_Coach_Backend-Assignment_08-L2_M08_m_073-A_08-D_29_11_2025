import { model, Schema } from "mongoose";
import { AccountStatus, IAuthProvider, IUser, Role } from "./user.interface";

const guideProfileSchema = new Schema(
  {
    city: String,
    languages: [String],
    experience: String,
    tourType: String,
    availability: String,
    bio: String,
    portfolio: String,
    social: String,
  },
  {
    _id: false,
    versionKey: false,
  }
);

const authProviderSchema = new Schema<IAuthProvider>(
  {
    provider: { type: String, required: true },
    providerId: { type: String, required: true },
  },
  {
    versionKey: false,
    _id: false,
  }
);

const userSchema = new Schema<IUser>(
  {
    // basic info
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    isGuideDocumentSubmit: { type: Boolean, default: false },
    isGuide: { type: Boolean, default: false },

    // user role
    role: {
      type: String,
      enum: Object.values(Role),
      default: Role.TOURIST,
    },

    // optional
    phone: { type: String },
    picture: { type: String },
    address: { type: String },

    // account state
    status: {
      type: String,
      enum: Object.values(AccountStatus),
      default: AccountStatus.ACTIVE,
    },

    isVerified: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },

    // oauth providers list
    auths: {
      type: [authProviderSchema],
      default: [],
    },

    guideProfile: {
      type: guideProfileSchema,
      default: null,
    },

    // relations
    bookings: [{ type: Schema.Types.ObjectId, ref: "Booking" }],
    reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],
    wishlist: [{ type: Schema.Types.ObjectId, ref: "Tour" }],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);



export const User = model<IUser>("User", userSchema);
