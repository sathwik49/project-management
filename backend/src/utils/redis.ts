import Redis from "ioredis";
import { appConfig } from "../config/appConfig";

export const redisClient = new Redis(appConfig.REDIS_URL, {
  tls: {
    servername: appConfig.REDIS_SERVER_NAME,
  },
  connectTimeout: 10000,
  maxRetriesPerRequest: 3,
  enableReadyCheck: true,
});

