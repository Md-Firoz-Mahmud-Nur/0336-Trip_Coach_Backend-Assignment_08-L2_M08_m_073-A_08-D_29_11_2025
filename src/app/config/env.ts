import dotenv from "dotenv";

dotenv.config({ quiet: true });

interface EnvConfig {
  MONGO_DB_USER: string;
  MONGO_DB_SECRET_KEY: string;
  MONGO_DB_URI_SECRET_KEY: string;
  PORT: string;
  NODE_ENV: "development" | "production";
  JWT_ACCESS_SECRET: string;
  JWT_ACCESS_EXPIRE: string;
  JWT_REFRESH_SECRET: string;
  JWT_REFRESH_EXPIRE: string;
  BCRYPT_SALT_ROUND: string;
  ADMIN_EMAIL: string;
  ADMIN_PASSWORD: string;
  EXPRESS_SESSION_SECRET: string;
  FRONTEND_URL: string;
}

const loadEnvVariables = (): EnvConfig => {
  const requiredEnvVariables: string[] = [
    "MONGO_DB_USER",
    "MONGO_DB_SECRET_KEY",
    "MONGO_DB_URI_SECRET_KEY",
    "PORT",
    "NODE_ENV",
    "JWT_ACCESS_SECRET",
    "JWT_ACCESS_EXPIRE",
    "JWT_REFRESH_SECRET",
    "JWT_REFRESH_EXPIRE",
    "BCRYPT_SALT_ROUND",
    "ADMIN_EMAIL",
    "ADMIN_PASSWORD",
    "EXPRESS_SESSION_SECRET",
    "FRONTEND_URL",
  ];

  requiredEnvVariables.forEach((key) => {
    if (!process.env[key]) {
      throw new Error(`Missing require environment variable ${key}`);
    }
  });

  return {
    MONGO_DB_USER: process.env.MONGO_DB_USER as string,
    MONGO_DB_SECRET_KEY: process.env.MONGO_DB_SECRET_KEY as string,
    MONGO_DB_URI_SECRET_KEY: process.env.MONGO_DB_URI_SECRET_KEY as string,
    PORT: process.env.PORT as string,
    NODE_ENV: process.env.NODE_ENV as "development" | "production",
    JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET as string,
    JWT_ACCESS_EXPIRE: process.env.JWT_ACCESS_EXPIRE as string,
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET as string,
    JWT_REFRESH_EXPIRE: process.env.JWT_REFRESH_EXPIRE as string,
    BCRYPT_SALT_ROUND: process.env.BCRYPT_SALT_ROUND as string,
    ADMIN_EMAIL: process.env.ADMIN_EMAIL as string,
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD as string,
    EXPRESS_SESSION_SECRET: process.env.EXPRESS_SESSION_SECRET as string,
    FRONTEND_URL: process.env.FRONTEND_URL as string,
  };
};

export const envVariables = loadEnvVariables();
