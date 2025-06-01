import { Router } from "express";
import passport from "passport"
import { appConfig } from "../config/appConfig";
import { emailVerificationController, googleLogin, userLoginController, userLogoutController, userRegistrationController } from "../controllers/auth.controller";

const authRouter = Router()

const failureUrl = `${appConfig.FRONTEND_GOOGLE_CALLBACK_URL}/?status=failure`

authRouter.get("/google",
    passport.authenticate("google",{
        scope:["email","profile",],
    }),
)

authRouter.get("/google/callback",
    passport.authenticate("google",{
        failureRedirect:failureUrl
    }),
    googleLogin
)

authRouter.post("/register",userRegistrationController)
authRouter.post("/login",userLoginController)
authRouter.post("/verify-email/:id",emailVerificationController)
authRouter.post("/logout",userLogoutController)

export default authRouter;