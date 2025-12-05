import mongoose from "mongoose";
import { TGenericErrorResponse } from "../interfaces/error.types";

export const handleCastError = (
  err: mongoose.Error.CastError
): TGenericErrorResponse => {
  console.log("\n \n error from handleCastError \n \n", err);
  return {
    statusCode: 400,
    message: "Invalid ID, Please Provide A Valid ID from handleCastError",
  };
};
