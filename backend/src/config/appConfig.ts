import { getEnv } from "../utils/getEnv";

export const appConfig = {
  NODE_ENV: getEnv("NODE_ENV"),
  PORT: getEnv("PORT", "8951"),
  BASE_PATH: getEnv("BASE_PATH", "/api"),
  SESSION_SECRET: getEnv("SESSION_SECRET"),
  FRONTEND_ORIGIN: getEnv("FRONTEND_ORIGIN"),
  JWT_ACCESS_TOKEN_SECRET: getEnv("JWT_ACCESS_TOKEN_SECRET"),
  JWT_REFRESH_TOKEN_SECRET: getEnv("JWT_REFRESH_TOKEN_SECRET"),
  REDIS_URL: getEnv("REDIS_URL"),
  RESEND_API_KEY: getEnv("RESEND_API_KEY"),
  REDIS_SERVER_NAME: getEnv("REDIS_SERVER_NAME"),
};
