import express, { NextFunction, Request, Response } from "express";
import cors from "cors";

import cookieParser from "cookie-parser";
import { router } from "./app/routes";
import { globalErrorHandler } from "./app/middlewares/globalerrorhandler";
import notFound from "./app/middlewares/notfoundroute";

const app = express();

app.use(cookieParser());

app.set("trust proxy", 1); // trust first proxy
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
//

app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true, // cookie/auth header
  })
);

app.use("/api/v1/", router);

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to library App");
});

// For all non-webhook routes
app.use((req, res, next) => {
  if (req.originalUrl === "/api/v1/payments/webhook") return next();
  express.json()(req, res, next);
});

// global error handler

app.use(globalErrorHandler);

// handle not found route
app.use(notFound);

export default app;
