import Redis from "ioredis";
import { appConfig } from "../config/appConfig";
import { AppError } from "./error";

const redis = new Redis(appConfig.REDIS_URL);
redis.on("error", (err) => {
  console.error("[REDIS ERROR]", err.message);
});

export default redis;
