import passport from "passport"
import { Request } from "express"
import { Strategy as GoogleStrategy } from "passport-google-oauth20"
import { appConfig } from "./appConfig"
import { NotFoundError } from "../utils/error"
import { loginOrCreateAccountService } from "../services/auth.service"
import { getUserById } from "../utils/get-user"

passport.use(
    new GoogleStrategy({
        clientID:appConfig.GOOGLE_CLIENT_ID,
        clientSecret:appConfig.GOOGLE_CLIENT_SECRET,
        callbackURL:appConfig.GOOGLE_CALLBACK_URL,
        scope:["email","profile"],
        passReqToCallback:true,
    },
    async (req:Request,accessToken,refreshToken,profile,done) => {
        try {
            const { email,sub:googleId,picture } = profile._json
            if(!googleId){
                throw new NotFoundError("Google Id not found.Please try again")
            }
            const user = await loginOrCreateAccountService({
                provider:"GOOGLE",
                displayName:profile.displayName,
                providerId:googleId,
                picture:picture,
                email:email,
            })
            //req.user = user
            done(null,user)
        } catch (error) {
            done(error,false);
        }
    }
))

passport.serializeUser((user: any, done) => done(null, user));
passport.deserializeUser((user: any, done) => done(null, user));