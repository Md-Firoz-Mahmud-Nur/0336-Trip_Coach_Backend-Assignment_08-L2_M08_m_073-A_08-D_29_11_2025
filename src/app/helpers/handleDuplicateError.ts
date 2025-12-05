import { MongoServerError } from "mongodb";
import { TGenericErrorResponse } from "../interfaces/error.types";

export const handlerDuplicateError = (
  err: MongoServerError
): TGenericErrorResponse => {
  console.log("temp", err);
  return {
    statusCode: 409,
    message: `${Object.values(err.keyValue)} already exists`,
    // message = `Duplicate ${Object.keys(err.keyValue)} entered, ${Object.values(err.keyValue)} already exists`,
  };
};
