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

const app = express();
const BASE_PATH = appConfig.BASE_PATH;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    name: "proman-session",
    secret: appConfig.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 3 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "lax",
      secure:appConfig.NODE_ENV === "production" 
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(
  cors({
    origin: appConfig.FRONTEND_ORIGIN,
    credentials: true,
  })
);
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
server.on("error", (err) => {
  console.log(err.message);
  process.exit(1);
});
