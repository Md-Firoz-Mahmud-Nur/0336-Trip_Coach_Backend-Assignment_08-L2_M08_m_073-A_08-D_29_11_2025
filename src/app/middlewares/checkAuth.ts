import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import { envVariables } from "../config/env";
import AppError from "../errorHelper/AppError";
import { User } from "../modules/user/user.model";
import { verifyToken } from "../utils/jwt";
import { setAuthCookie } from "../utils/setCookie";
import { createNewAccessTokenWithRefreshToken } from "../utils/userTokens";
export const checkAuth =
  (...authRoles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      let accessToken = req.cookies.accessToken;
      if (!accessToken) {
        const refreshToken = req.cookies.refreshToken;
        if (refreshToken) {
          const createAccessTokenWithRefresh =
            await createNewAccessTokenWithRefreshToken(refreshToken);
          setAuthCookie(res, { accessToken: createAccessTokenWithRefresh });
          accessToken = createAccessTokenWithRefresh;
        } else {
          throw new AppError(403, "Access token not found");
        }
      }

      const verifyAccessToken = verifyToken(
        accessToken,
        envVariables.JWT_ACCESS_SECRET
      ) as JwtPayload;

      const isUserExist = await User.findOne({
        email: verifyAccessToken.email,
      });

      if (!isUserExist) {
        throw new AppError(httpStatus.BAD_REQUEST, "User does not exist");
      }

      if (!isUserExist.isVerified) {
        throw new AppError(httpStatus.BAD_REQUEST, "User is not verified");
      }

      if (isUserExist.isBlocked) {
        throw new AppError(httpStatus.BAD_REQUEST, "User is blocked");
      }

      if (isUserExist.isDeleted) {
        throw new AppError(httpStatus.BAD_REQUEST, "User is deleted");
      }

      req.user = verifyAccessToken;

      if (!authRoles.includes((verifyAccessToken as JwtPayload).role)) {
        throw new AppError(403, "You are not authorized");
      }

      next();
    } catch (error) {
      next(error);
    }
  };
