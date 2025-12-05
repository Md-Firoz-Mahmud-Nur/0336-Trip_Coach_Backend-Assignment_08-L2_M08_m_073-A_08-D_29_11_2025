/* eslint-disable no-console */
import dotenv from "dotenv";
import { Server } from "http";
import mongoose from "mongoose";
import app from "./app";
import { envVariables } from "./app/config/env";
import { seedAdmin } from "./app/utils/seedAdmin";
dotenv.config({ quiet: true });

const {
  MONGO_DB_USER,
  MONGO_DB_SECRET_KEY,
  MONGO_DB_URI_SECRET_KEY,
  PORT,
  NODE_ENV,
} = envVariables;

console.log(NODE_ENV);

let server: Server;

const startServer = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://${MONGO_DB_USER}:${MONGO_DB_SECRET_KEY}@cluster0.${MONGO_DB_URI_SECRET_KEY}.mongodb.net/tripCoach?retryWrites=true&w=majority&appName=Cluster0`
    );
    console.log("Connected to MongoDB");

    server = app.listen(PORT, () => {
      console.log(`App is listing on PORT ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

(async () => {
  await startServer();
  await seedAdmin();
})();

process.on("SIGTERM", () => {
  console.log("SIGTERM signal received... Server shutting down..");

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }

  process.exit(1);
});

process.on("SIGINT", () => {
  console.log("SIGINT signal received... Server shutting down..");

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }

  process.exit(1);
});

process.on("unhandledRejection", (err) => {
  console.log("Unhandled Rejection detected... Server shutting down..", err);

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }

  process.exit(1);
});

process.on("uncaughtException", (err) => {
  console.log("Uncaught Exception detected... Server shutting down..", err);

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }

  process.exit(1);
});
