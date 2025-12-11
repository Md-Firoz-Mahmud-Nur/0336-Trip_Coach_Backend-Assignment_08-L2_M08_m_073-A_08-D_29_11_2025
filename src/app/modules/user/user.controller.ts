import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { UserService } from "./user.service";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await UserService.createUser(req.body);

    console.log({ user });

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

export const UserControllers = {
  createUser,
  getAllUsers,
  getMe,
  getSingleUser,
  getAllTourist,
  getAllGuide,
  updateUser,
};
