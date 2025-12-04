import dotenv from "dotenv";

dotenv.config();

interface EnvConfig {
  PORT: string;
  NODE_ENV: "development" | "production";

  MONGO_DB_USER: string;
  MONGO_DB_SECRET_KEY: string;
  MONGO_DB_URI_SECRET_KEY: string;

  JWT_ACCESS_SECRET: string;
  JWT_ACCESS_EXPIRES: string;
  JWT_REFRESH_SECRET: string;
  JWT_REFRESH_EXPIRES: string;

  // REDIS_HOST: string;
  // REDIS_PORT: string;
  // REDIS_USERNAME: string;
  // REDIS_PASSWORD: string;
}

const loadEnvVariables = (): EnvConfig => {
  const requiredEnvVariables: string[] = [
    "PORT",
    "NODE_ENV",

    "MONGO_DB_USER",
    "MONGO_DB_SECRET_KEY",
    "MONGO_DB_URI_SECRET_KEY",

    "JWT_ACCESS_SECRET",
    "JWT_ACCESS_EXPIRES",
    "JWT_REFRESH_SECRET",
    "JWT_REFRESH_EXPIRES",

    // "REDIS_HOST",
    // "REDIS_PORT",
    // "REDIS_USERNAME",
    // "REDIS_PASSWORD",
  ];

  requiredEnvVariables.forEach((key) => {
    if (!process.env[key]) {
      throw new Error(`Missing require environment variabl ${key}`);
    }
  });

  return {
    PORT: process.env.PORT as string,
    NODE_ENV: process.env.NODE_ENV as "development" | "production",

    MONGO_DB_USER: process.env.MONGO_DB_USER as string,
    MONGO_DB_SECRET_KEY: process.env.MONGO_DB_SECRET_KEY as string,
    MONGO_DB_URI_SECRET_KEY: process.env.MONGO_DB_URI_SECRET_KEY as string,

    JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET as string,
    JWT_ACCESS_EXPIRES: process.env.JWT_ACCESS_EXPIRES as string,
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET as string,
    JWT_REFRESH_EXPIRES: process.env.JWT_REFRESH_EXPIRES as string,

    // REDIS_HOST: process.env.REDIS_HOST as string,
    // REDIS_PORT: process.env.REDIS_PORT as string,
    // REDIS_USERNAME: process.env.REDIS_USERNAME as string,
    // REDIS_PASSWORD: process.env.REDIS_PASSWORD as string,
  };
};

export const envVars = loadEnvVariables();
