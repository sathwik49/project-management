import { Router } from "express";
import passport from "passport"
import { appConfig } from "../config/appConfig";
import { googleLogin } from "../controllers/auth.controller";

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

export default authRouter;