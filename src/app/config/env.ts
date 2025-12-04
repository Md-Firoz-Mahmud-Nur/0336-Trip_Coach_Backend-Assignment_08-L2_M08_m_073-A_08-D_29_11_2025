import dotenv from "dotenv";

dotenv.config();

interface EnvConfig {
  PORT: string;
}

const loadEnvVariables = (): EnvConfig => {
  const requiredEnvVariables: string[] = ["PORT"];

  requiredEnvVariables.forEach((key) => {
    if (!process.env[key]) {
      throw new Error(`Missing require environment variabl ${key}`);
    }
  });

  return {
    PORT: process.env.PORT as string,
  };
};

export const envVars = loadEnvVariables();
