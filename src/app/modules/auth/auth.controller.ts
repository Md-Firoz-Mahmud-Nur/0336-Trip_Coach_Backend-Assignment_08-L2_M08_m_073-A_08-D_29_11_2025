import { Request, Response } from "express";
import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import { envVariables } from "../../config/env";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { setAuthCookie } from "../../utils/setCookie";
import { authServices } from "./auth.service";
import AppError from "../../errorHelper/AppError";

const credentialsLogin = catchAsync(async (req: Request, res: Response) => {
  const loginInfo = await authServices.credentialsLogin(req.body);

  setAuthCookie(res, loginInfo);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "User Logged In Successfully",
    data: loginInfo,
  });
});

const getNewAccessToken = catchAsync(async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    throw new AppError(httpStatus.BAD_REQUEST, "Refresh Token is required");
  }

  const tokenInfo = await authServices.getNewAccessToken(
    refreshToken as string
  );

  setAuthCookie(res, tokenInfo);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Get New Access Token Successfully",
    data: tokenInfo,
  });
});

const logout = catchAsync(async (req: Request, res: Response) => {
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: envVariables.NODE_ENV === "production",
    sameSite: envVariables.NODE_ENV === "production" ? "none" : "lax",
  });

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: envVariables.NODE_ENV === "production",
    sameSite: envVariables.NODE_ENV === "production" ? "none" : "lax",
  });

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User Logged Out Successfully",
    data: null,
  });
});

const resetPassword = catchAsync(async (req: Request, res: Response) => {
  const decodedToken = req.user;
  const password = req.body.password;

  const updatePassword = req.body.updatePassword;

  await authServices.resetPassword(
    decodedToken as JwtPayload,
    password,
    updatePassword
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Password Changed Successfully",
    data: null,
  });
});

export const authControllers = {
  credentialsLogin,
  getNewAccessToken,
  logout,
  resetPassword,
};
