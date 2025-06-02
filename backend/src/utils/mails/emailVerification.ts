import { render } from "@react-email/components";
import { prisma } from "../../config/db"
import EmailVerification from "./mail-templates/VerifyEmail";
import { appConfig } from "../../config/appConfig";
import { genUUid } from "../gen-uuid";
import resend from "./resend";
import React from "react";
import { AppError } from "../error";
import { setUserVerificationToken } from "../user";

const checkEmailVerificationAndSendMail = async (email:string) => {
    const user = await prisma.account.findFirst({
        where:{
            providerId:email,
            provider:"EMAIL",
        },
        include:{
            user:{
                select:{
                    name:true
                }
            }
        }
    })

    if(!user?.emailVerified){
        const token = genUUid(15);
        console.log(token)
        const userName = user?.user.name as string
        const verificationLink = `${appConfig.FRONTEND_ORIGIN}/verify/${token}`
        const emailHtml = await render(React.createElement(EmailVerification,{userName,verificationLink}))

        const { data,error } = await resend.emails.send({
            from:"onboarding@resend.dev",
            to:email,
            subject:"Email Verification from ProManSystem",
            html:emailHtml
        })

        if(error){
            return null;
            //throw new Error("Couldn't send mail.Please try again");
        }
        await setUserVerificationToken(token,email);
        return true;
    }
}

export default checkEmailVerificationAndSendMail;