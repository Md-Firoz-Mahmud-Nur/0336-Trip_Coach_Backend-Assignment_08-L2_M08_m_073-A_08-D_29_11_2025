import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { User } from "./user.model";
import { UserService } from "./user.service";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await UserService.createUser(req.body);

    res.status(httpStatus.CREATED).json({
      message: "User Created Successfully",
      user,
    });
  } catch (err: any) {
    console.log("error", next(err));
  }
};

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.getAllUsers();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "All Users Retrieved Successfully",
    data: result.data,
    meta: result.meta,
  });
});

const getMe = catchAsync(async (req: Request, res: Response) => {
  const decodedToken = req.user as JwtPayload;
  const user = await UserService.getMe(decodedToken.userId as string);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User Retrieved Successfully",
    data: user,
  });
});

const getSingleUser = catchAsync(async (req: Request, res: Response) => {
  const decodedToken = req.user as JwtPayload;
  const userId = req.params.id;

  const user = await UserService.getSingleUser(decodedToken, userId as string);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User Retrieved Successfully",
    data: user,
  });
});

const getAllTourist = catchAsync(async (req: Request, res: Response) => {
  const data = await UserService.getAllTourist();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Sender Retrieved Successfully",
    data,
  });
});

const getAllGuide = catchAsync(async (req: Request, res: Response) => {
  const data = await UserService.getAllGuide();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Receiver Retrieved Successfully",
    data,
  });
});

const updateUser = catchAsync(async (req: Request, res: Response) => {
  const userId = req.params.id;

  const verifiedToken = req.user as JwtPayload;

  const payload = req.body;

  const user = await UserService.updateUser(userId, payload, verifiedToken);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "User Updated Successfully",
    data: user,
  });
});

// new

const submitGuideApplication = async (req: Request, res: Response) => {
  const decoded = req.user as JwtPayload;
  const userId = decoded.userId as string;

  const {
    city,
    languages,
    experience,
    tourType,
    availability,
    bio,
    portfolio,
    social,
  } = req.body;

  const user = await User.findByIdAndUpdate(
    userId,
    {
      guideProfile: {
        city,
        languages:
          typeof languages === "string"
            ? languages.split(",").map((l: string) => l.trim())
            : languages,
        experience,
        tourType,
        availability,
        bio,
        portfolio,
        social,
      },
      isGuideDocumentSubmit: true,
    },
    { new: true }
  );

  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  return res.status(200).json({
    success: true,
    message: "Guide application submitted",
    data: user,
  });
};

const getPendingGuideApplications = async (req: Request, res: Response) => {
  const users = await User.find({
    isGuideDocumentSubmit: true,
    isGuide: false,
    isDeleted: false,
  });

  return res.status(200).json({
    success: true,
    data: users,
  });
};

const approveGuide = async (req: Request, res: Response) => {
  const { userId } = req.params;

  const user = await User.findByIdAndUpdate(
    userId,
    {
      isGuide: true,
    },
    { new: true }
  );

  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  return res.status(200).json({
    success: true,
    message: "Guide approved",
    data: user,
  });
};

const rejectGuide = async (req: Request, res: Response) => {
  const { userId } = req.params;

  const user = await User.findByIdAndUpdate(
    userId,
    {
      isGuideDocumentSubmit: false,
      isGuide: false,
      guideProfile: null,
    },
    { new: true }
  );

  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  return res.status(200).json({
    success: true,
    message: "Guide application rejected",
    data: user,
  });
};

export const UserControllers = {
  createUser,
  getAllUsers,
  getMe,
  getSingleUser,
  getAllTourist,
  getAllGuide,
  updateUser,
  submitGuideApplication,
  getPendingGuideApplications,
  approveGuide,
  rejectGuide,
};
