import { Router } from "express"
import { joinWorkSpaceController } from "../controllers/member.controller"

const  memberRouter = Router()

memberRouter.post("/workspace/:inviteCode/join",joinWorkSpaceController)

export default memberRouter