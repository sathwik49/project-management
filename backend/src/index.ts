import express, { Request, Response } from "express";
import "dotenv/config";
import cors from "cors";
import { appConfig } from "./config/appConfig";
import errorMiddleware from "./middlewares/errorHandler";
import "./config/passport";
import mainRouter from "./routes";
import passport from "passport";
import { requestLogger } from "./middlewares/logger";
import session from "express-session";
import RedisStore from "connect-redis";
import { redisClient } from "./utils/redis";

const app = express();
const BASE_PATH = appConfig.BASE_PATH;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: appConfig.FRONTEND_ORIGIN,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  }),
);

app.use(
  session({
    name: "proman-session",
    secret: appConfig.SESSION_SECRET,
    store: new RedisStore({
      client: redisClient,
      prefix: "sess:",
    }),
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 3 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "lax",
      secure: appConfig.NODE_ENV === "production",
      domain: undefined,
    },
  }),
);

app.use(passport.initialize());
app.use(passport.session());
app.use(requestLogger);

app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Running",
  });
});

//Routes
app.use(`${BASE_PATH}`, mainRouter);

app.use(errorMiddleware);

const server = app.listen(appConfig.PORT);

server.on("listening", async () => {
  console.log(`Server running on http://localhost:${appConfig.PORT}`);
});

redisClient.on("connect", () => {
  console.log("Redis connected");
});

redisClient.on("ready", () => {
  console.log("Redis ready");
});

server.on("error", (err) => {
  console.log(err.message);
  process.exit(1);
});

redisClient.on("error", (err) => {
  console.error("Redis error:", err);
});
