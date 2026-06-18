import { Router } from "express";
import {
  emailVerificationController,
  googleTokenController,
  userLoginController,
  userLogoutController,
  userRegistrationController,
} from "../controllers/auth.controller";
import { authRateLimiter } from "../middlewares/authRatelimiter";

const authRouter = Router();

authRouter.post("/google/token", authRateLimiter, googleTokenController);
authRouter.post("/register", authRateLimiter, userRegistrationController);
authRouter.post("/login", authRateLimiter, userLoginController);
authRouter.get("/verify-email/:token", emailVerificationController);
authRouter.post("/logout", userLogoutController);

export default authRouter;
