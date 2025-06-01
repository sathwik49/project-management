import { Resend } from "resend";
import { appConfig } from "../../config/appConfig";


const resend = new Resend(appConfig.RESEND_API_KEY)

export default resend;