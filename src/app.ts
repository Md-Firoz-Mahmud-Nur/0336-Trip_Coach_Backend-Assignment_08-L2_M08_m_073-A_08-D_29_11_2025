import cors from "cors";
import express, { Request, Response } from "express";

import cookieParser from "cookie-parser";
import { globalErrorHandler } from "./app/middlewares/globalErrorHandler";
import notFound from "./app/middlewares/notFound";
import { router } from "./app/routes";

const app = express();

app.use(cookieParser());

app.set("trust proxy", 1);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
//

app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);

app.use("/api/v1/", router);

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to Tour Coach");
});

app.use((req, res, next) => {
  if (req.originalUrl === "/api/v1/payments/webhook") return next();
  express.json()(req, res, next);
});

app.use(globalErrorHandler);

app.use(notFound);

export default app;
