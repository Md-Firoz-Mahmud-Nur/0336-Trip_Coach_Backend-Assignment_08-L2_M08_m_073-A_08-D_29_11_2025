import { Response } from "express";
import { envVariables } from "../config/env";

export interface IAuthCookie {
  accessToken?: string;
  refreshToken?: string;
}

export const setAuthCookie = (res: Response, tokenInfo: IAuthCookie) => {
  if (tokenInfo.accessToken) {
    res.cookie("accessToken", tokenInfo.accessToken, {
      httpOnly: true,
      secure: envVariables.NODE_ENV === "production",
      sameSite: envVariables.NODE_ENV === "production" ? "none" : "lax",
    });
  }

  if (tokenInfo.refreshToken) {
    res.cookie("refreshToken", tokenInfo.refreshToken, {
      httpOnly: true,
      secure: envVariables.NODE_ENV === "production",
      sameSite: envVariables.NODE_ENV === "production" ? "none" : "lax",
    });
  }
};
