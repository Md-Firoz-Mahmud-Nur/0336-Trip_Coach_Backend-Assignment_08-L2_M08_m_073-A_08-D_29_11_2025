import bcryptjs from "bcryptjs";
import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import AppError from "../../errorHelper/AppError";
import { IAuthProvider, IUser, Role } from "./user.interface";
import { User } from "./user.model";

const createUser = async (payload: Partial<IUser>) => {
  const { email, password, ...rest } = payload;

  const isUserExit = await User.findOne({ email });

  if (isUserExit) {
    throw new Error("User already exists with this email");
  }

  const hashedPassword = await bcryptjs.hash(password as string, 10);

  const authProvider: IAuthProvider = {
    provider: "credentials",
    providerId: email as string,
  };

  const user = await User.create({
    email,
    password: hashedPassword,
    auths: [authProvider],
    ...rest,
  });

  return user;
};

const getAllUsers = async () => {
  const users = await User.find({});
  const totalUsers = await User.countDocuments();
  return {
    data: users,
    meta: { total: totalUsers },
  };
};

const getMe = async (userId: string) => {
  const isUserExist = await User.findById(userId).select("-password");

  if (!isUserExist) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  return isUserExist;
};

const getSingleUser = async (decodedToken: JwtPayload, userId: string) => {
  // if (decodedToken.role !== Role.ADMIN) {
  //   throw new AppError(httpStatus.BAD_REQUEST, "You are not authorized");
  // }

  const isUserExist = await User.findById(userId).select("-password");

  if (!isUserExist) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  return isUserExist;
};

const getAllTourist = async () => {
  const users = await User.find({ role: Role.TOURIST });
  const totalUsers = await User.countDocuments({ role: Role.TOURIST });
  return {
    data: users,
    meta: { total: totalUsers },
  };
};

const getAllGuide = async () => {
  const users = await User.find({ role: Role.GUIDE });
  const totalUsers = await User.countDocuments({ role: Role.GUIDE });
  return {
    data: users,
    meta: { total: totalUsers },
  };
};

const updateUser = async (
  userId: string,
  payload: Partial<IUser>,
  decodedToken: JwtPayload
) => {
  const isUserExist = await User.findById(userId);

  if (!isUserExist) {
    throw new AppError(httpStatus.NOT_FOUND, "User Not Found");
  }

  if (
    payload?.isBlocked !== undefined ||
    payload?.role !== undefined ||
    payload?.isVerified !== undefined ||
    payload?.isDeleted !== undefined
  ) {
    if (decodedToken.role !== Role.ADMIN) {
      throw new AppError(httpStatus.BAD_REQUEST, "You are not an admin");
    }
  }

  if (payload?.name !== undefined || payload?.picture !== undefined) {
    if (!isUserExist._id.equals(decodedToken.userId)) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        "You can not change others information"
      );
    }
  }

  const newUpdatedUser = await User.findByIdAndUpdate(userId, payload, {
    new: true,
    runValidators: true,
  });

  return newUpdatedUser;
};

export const UserService = {
  createUser,
  getAllUsers,
  getMe,
  getSingleUser,
  getAllTourist,
  getAllGuide,
  updateUser,
};
