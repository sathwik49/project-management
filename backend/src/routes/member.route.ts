import { Router } from "express";
import { joinWorkSpaceController } from "../controllers/member.controller";

const memberRouter = Router();

memberRouter.post("/join/:inviteCode", joinWorkSpaceController);

export default memberRouter;
